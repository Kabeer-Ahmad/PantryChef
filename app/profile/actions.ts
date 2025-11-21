'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const dietaryPrefs = formData.getAll('dietary_prefs') as string[]
    const allergies = formData.getAll('allergies') as string[]
    const favoriteCuisines = formData.getAll('favorite_cuisines') as string[]

    // Handle custom allergies if any (assuming they might be passed as a comma-separated string or separate input)
    const customAllergies = formData.get('custom_allergies') as string
    if (customAllergies) {
        const splitCustom = customAllergies.split(',').map(s => s.trim()).filter(Boolean)
        allergies.push(...splitCustom)
    }

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            name,
            dietary_prefs: dietaryPrefs,
            allergies: allergies,
            favorite_cuisines: favoriteCuisines,
            updated_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    revalidatePath('/')
    return { success: 'Profile updated successfully' }
}
