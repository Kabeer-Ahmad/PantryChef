import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import { ChefHat } from 'lucide-react'

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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-12 pb-24 md:pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30">
                            <ChefHat size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                            <p className="text-gray-500">Customize your cooking preferences</p>
                        </div>
                    </div>

                    <ProfileForm profile={profile} />
                </div>
            </div>
        </div>
    )
}
