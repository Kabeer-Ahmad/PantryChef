'use client'

import { useState, useMemo } from 'react'
import RecipeCardPreview from '@/components/RecipeCardPreview'
import { Search, Calendar, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HistoryClientProps {
    initialRecipes: any[]
    recipesByDate: Record<string, any[]>
}

export default function HistoryClient({ initialRecipes, recipesByDate }: HistoryClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [groupByDate, setGroupByDate] = useState(false)

    // Filter recipes based on search query
    const filteredRecipes = useMemo(() => {
        if (!searchQuery.trim()) return initialRecipes

        const query = searchQuery.toLowerCase()
        return initialRecipes.filter((recipe: any) => {
            const title = recipe.recipe_json?.title?.toLowerCase() || ''
            const description = recipe.recipe_json?.description?.toLowerCase() || ''
            const ingredients = recipe.recipe_json?.ingredients?.join(' ').toLowerCase() || ''
            const instructions = recipe.recipe_json?.instructions?.join(' ').toLowerCase() || ''
            
            return title.includes(query) || 
                   description.includes(query) ||
                   ingredients.includes(query) || 
                   instructions.includes(query)
        })
    }, [searchQuery, initialRecipes])

    // Group filtered recipes by date
    const groupedFilteredRecipes = useMemo(() => {
        if (!groupByDate) return null

        return filteredRecipes.reduce((acc: Record<string, any[]>, recipe: any) => {
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
        }, {})
    }, [filteredRecipes, groupByDate])

    if (initialRecipes.length === 0) return null

    return (
        <>
            {/* Search and Filter Bar */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search recipes by name, ingredients, or instructions..."
                            className="w-full pl-12 pr-10 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-900/50 focus:border-cyan-400 dark:focus:border-cyan-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setGroupByDate(!groupByDate)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                            groupByDate
                                ? 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-400 dark:border-cyan-600 text-cyan-700 dark:text-cyan-400'
                                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                        <Calendar size={18} />
                        <span className="text-sm sm:text-base font-medium">Group by Date</span>
                    </button>
                </div>
                {searchQuery && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                )}
            </div>

            {/* Recipes Display */}
            {filteredRecipes.length === 0 ? (
                <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors duration-300">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2 transition-colors duration-300">No recipes found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors duration-300">Try adjusting your search query</p>
                </div>
            ) : groupByDate && groupedFilteredRecipes ? (
                <div className="space-y-8">
                    {Object.entries(groupedFilteredRecipes)
                        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                        .map(([date, recipes]) => (
                            <motion.div
                                key={date}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent transition-colors duration-300"></div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                                        <Calendar className="text-cyan-600 dark:text-cyan-400" size={18} />
                                        <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">{date}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">({recipes.length})</span>
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent transition-colors duration-300"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {recipes.map((recipe: any) => (
                                        <RecipeCardPreview key={recipe.id} recipe={recipe} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                </div>
            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {filteredRecipes.map((recipe: any) => (
                                            <motion.div
                                                key={recipe.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <RecipeCardPreview recipe={recipe} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
            )}
        </>
    )
}

