import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import { ChefHat } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default async function ProfilePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 pb-24 md:pb-12 relative overflow-hidden transition-colors duration-300">
            <AnimatedBackground />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 sm:p-12 transition-colors duration-300">
                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
