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
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-12 pb-24 md:pb-12 relative overflow-hidden">
            <AnimatedBackground />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12">
                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
