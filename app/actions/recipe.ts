'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function rateRecipe(recipeId: number, rating: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('recipes')
        .update({ rating })
        .eq('id', recipeId)

    if (error) {
        console.error('Error rating recipe:', error)
        return { error: 'Failed to rate recipe' }
    }

    revalidatePath('/history')
    return { success: true }
}
