import { createClient } from '@/utils/supabase/server'
import { Client } from '@gradio/client'
import { NextResponse } from 'next/server'

// Helper function to extract and parse JSON from LLM response
function extractJSON(text: string): any {
    // Try to find JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0])
        } catch (e) {
            // If parsing fails, try to fix common issues
            let cleaned = jsonMatch[0]
            // Remove trailing commas before closing braces/brackets
            cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')
            try {
                return JSON.parse(cleaned)
            } catch (e2) {
                throw new Error('Failed to parse JSON from LLM response')
            }
        }
    }
    throw new Error('No JSON found in LLM response')
}

// Validate recipe data structure
function validateRecipeData(data: any): boolean {
    return (
        data &&
        typeof data.title === 'string' &&
        typeof data.description === 'string' &&
        Array.isArray(data.ingredients) &&
        Array.isArray(data.instructions) &&
        typeof data.prep_time === 'string' &&
        data.title.length > 0 &&
        data.description.length > 0 &&
        data.ingredients.length > 0 &&
        data.instructions.length > 0
    )
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { ingredients } = await request.json()

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ error: 'Invalid ingredients' }, { status: 400 })
        }

        // Fetch user profile for dietary preferences
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('dietary_prefs, allergies, favorite_cuisines')
            .eq('id', user.id)
            .single()

        // Handle case where profile might not exist yet
        const dietaryPrefs = profile?.dietary_prefs && profile.dietary_prefs.length > 0
            ? profile.dietary_prefs.join(', ')
            : 'None specified'
        const allergies = profile?.allergies && profile.allergies.length > 0
            ? profile.allergies.join(', ')
            : 'None'
        const cuisines = profile?.favorite_cuisines && profile.favorite_cuisines.length > 0
            ? profile.favorite_cuisines.join(', ')
            : 'Any cuisine'

        // Prepare ingredients string for Gradio API
        const ingredientsString = ingredients.join(', ')

        // Connect to Hugging Face Space via Gradio client
        const spaceName = process.env.HF_SPACE_NAME || 'Stylique/pantry-chef'
        
        let client
        try {
            // Connect to public Space - no authentication needed for non-gated models
            client = await Client.connect(spaceName)
        } catch (error: any) {
            console.error('Failed to connect to Hugging Face Space:', error)
            return NextResponse.json(
                { error: `Failed to connect to recipe generator. Please check if the Space is running: ${spaceName}` },
                { status: 503 }
            )
        }

        // Call the Gradio API endpoint
        let result: any
        try {
            result = await client.predict('/generate_recipe', {
                ingredients: ingredientsString,
                dietary_prefs: dietaryPrefs !== 'None specified' ? dietaryPrefs : 'None',
                allergies: allergies !== 'None' ? allergies : 'None',
                favorite_cuisines: cuisines !== 'Any cuisine' ? cuisines : 'Any',
            })
        } catch (error: any) {
            console.error('Failed to generate recipe from Space:', error)
            return NextResponse.json(
                { error: 'Failed to generate recipe. The service may be temporarily unavailable. Please try again.' },
                { status: 503 }
            )
        }

        // The result.data[0] contains the markdown string with the recipe
        const markdownResponse = (result?.data?.[0] as string) || ''

        // Extract JSON from the markdown response
        // The JSON is typically in a code block at the end: ```json\n{...}\n```
        let recipeData
        try {
            // Try to find JSON in code block
            const jsonCodeBlockMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/)
            if (jsonCodeBlockMatch) {
                recipeData = JSON.parse(jsonCodeBlockMatch[1])
            } else {
                // Fallback: try to extract JSON object directly
                recipeData = extractJSON(markdownResponse)
            }
        } catch (error) {
            console.error('JSON extraction error:', error)
            console.error('Markdown response:', markdownResponse.substring(0, 500))
            return NextResponse.json(
                { error: 'Failed to parse recipe from AI response. Please try again.' },
                { status: 500 }
            )
        }

        // Validate recipe data structure
        if (!validateRecipeData(recipeData)) {
            console.error('Invalid recipe data structure:', recipeData)
            return NextResponse.json(
                { error: 'AI generated invalid recipe format. Please try again.' },
                { status: 500 }
            )
        }

        // Save to Supabase recipes table
        const { data: savedRecipe, error: saveError } = await supabase
            .from('recipes')
            .insert({
                user_id: user.id,
                ingredients_used: ingredients,
                recipe_json: recipeData,
            })
            .select()
            .single()

        if (saveError) {
            console.error('Error saving recipe to database:', saveError)
            return NextResponse.json(
                { error: 'Failed to save recipe to database' },
                { status: 500 }
            )
        }

        // Return the saved recipe
        return NextResponse.json(savedRecipe)
    } catch (error: any) {
        console.error('Error in generate-recipe API:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate recipe. Please try again.' },
            { status: 500 }
        )
    }
}
