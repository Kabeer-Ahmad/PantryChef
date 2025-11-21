import { createClient } from '@/utils/supabase/server'
import RecipeGenerator from '@/components/RecipeGenerator'
import { redirect } from 'next/navigation'
import { ChefHat } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-12 pb-24 md:pb-12 relative overflow-hidden">
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{profile?.name || 'Chef'}</span>! <ChefHat size={24} className="inline-block align-middle ml-1" />
                    </h1>
                    <p className="text-lg text-gray-600">
                        Ready to cook something delicious? Tell us what ingredients you have.
                    </p>
                </div>

                <RecipeGenerator />
            </div>
        </div>
    )
}
