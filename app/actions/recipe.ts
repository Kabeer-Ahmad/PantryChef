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

export async function deleteRecipe(recipeId: number) {
    const supabase = await createClient()

    // Get the current user to ensure they own the recipe
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting recipe:', error)
        return { error: 'Failed to delete recipe' }
    }

    revalidatePath('/history')
    return { success: true }
}
