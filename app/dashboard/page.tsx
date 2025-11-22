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
        redirect('/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 pb-24 md:pb-12 relative overflow-hidden transition-colors duration-300">
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">{profile?.name || 'Chef'}</span>! <ChefHat size={24} className="inline-block align-middle ml-1" />
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        Ready to cook something delicious? Tell us what ingredients you have.
                    </p>
                </div>

                <RecipeGenerator />
            </div>
        </div>
    )
}
