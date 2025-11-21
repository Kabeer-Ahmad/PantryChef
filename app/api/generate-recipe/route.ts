import { createClient } from '@/utils/supabase/server'
import { HfInference } from '@huggingface/inference'
import { NextResponse } from 'next/server'

const hf = new HfInference(process.env.HF_ACCESS_TOKEN)

export async function POST(request: Request) {
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
    const { data: profile } = await supabase
        .from('profiles')
        .select('dietary_prefs, allergies, favorite_cuisines')
        .eq('id', user.id)
        .single()

    const dietaryPrefs = profile?.dietary_prefs?.join(', ') || 'None'
    const allergies = profile?.allergies?.join(', ') || 'None'
    const cuisines = profile?.favorite_cuisines?.join(', ') || 'Any'

    const prompt = `
You are a professional chef. Create a recipe using the following ingredients: ${ingredients.join(', ')}.
User Preferences:
- Dietary Restrictions: ${dietaryPrefs}
- Allergies: ${allergies} (MUST AVOID THESE)
- Preferred Cuisines: ${cuisines}

Strictly output ONLY valid JSON in the following format, with no other text:
{
  "title": "Recipe Title",
  "description": "Brief description",
  "ingredients": ["List of ingredients with quantities"],
  "instructions": ["Step 1", "Step 2"],
  "prep_time": "Time in minutes"
}
`

    try {
        const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: prompt,
            parameters: {
                max_new_tokens: 1000,
                return_full_text: false,
                temperature: 0.7,
            },
        })

        let generatedText = response.generated_text
        // Attempt to extract JSON if there's extra text
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            generatedText = jsonMatch[0]
        }

        const recipeData = JSON.parse(generatedText)

        // Save to Supabase
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
            console.error('Error saving recipe:', saveError)
            return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 })
        }

        return NextResponse.json(savedRecipe)
    } catch (error) {
        console.error('Error generating recipe:', error)
        return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 })
    }
}
