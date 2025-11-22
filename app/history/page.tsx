import { createClient } from '@/utils/supabase/server'
import RecipeCard from '@/components/RecipeCard'
import { redirect } from 'next/navigation'
import { BookOpen, Search, Calendar, ChefHat } from 'lucide-react'
import HistoryClient from './HistoryClient'
import AnimatedBackground from '@/components/AnimatedBackground'

export default async function HistoryPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: recipes } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const recipeCount = recipes?.length || 0

    // Group recipes by date
    const recipesByDate = recipes?.reduce((acc: Record<string, typeof recipes>, recipe: any) => {
        const date = new Date(recipe.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(recipe)
        return acc
    }, {}) || {}

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 sm:py-12 pb-24 md:pb-12 relative overflow-hidden transition-colors duration-300">
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 transition-colors duration-300">
                            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl transition-colors duration-300">
                                <BookOpen className="text-cyan-600 dark:text-cyan-400" size={24} />
                            </div>
                            <span>Your Recipe History</span>
                        </h1>
                        {recipeCount > 0 && (
                            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                                <ChefHat className="text-cyan-600 dark:text-cyan-400" size={20} />
                                <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    <span className="text-cyan-600 dark:text-cyan-400 transition-colors duration-300">{recipeCount}</span> {recipeCount === 1 ? 'Recipe' : 'Recipes'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Client Component for Search and Filter */}
                <HistoryClient initialRecipes={recipes || []} recipesByDate={recipesByDate} />

                {recipeCount === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm transition-colors duration-300">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                                <ChefHat className="text-cyan-600 dark:text-cyan-400" size={40} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">No recipes yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-6 transition-colors duration-300">
                                Start creating delicious recipes from your pantry ingredients!
                            </p>
                            <a
                                href="/dashboard"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40"
                            >
                                Generate your first recipe
                            </a>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
