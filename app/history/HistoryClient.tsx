'use client'

import { useState, useMemo } from 'react'
import RecipeCard from '@/components/RecipeCard'
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
            const title = recipe.title?.toLowerCase() || ''
            const ingredients = recipe.ingredients?.join(' ').toLowerCase() || ''
            const instructions = recipe.instructions?.toLowerCase() || ''
            
            return title.includes(query) || 
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
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search recipes by name, ingredients, or instructions..."
                            className="w-full pl-12 pr-10 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 outline-none transition-all text-sm sm:text-base placeholder-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setGroupByDate(!groupByDate)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                            groupByDate
                                ? 'bg-cyan-50 border-cyan-400 text-cyan-700'
                                : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Calendar size={18} />
                        <span className="text-sm sm:text-base font-medium">Group by Date</span>
                    </button>
                </div>
                {searchQuery && (
                    <p className="mt-3 text-sm text-gray-600">
                        Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </p>
                )}
            </div>

            {/* Recipes Display */}
            {filteredRecipes.length === 0 ? (
                <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg mb-2">No recipes found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search query</p>
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
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
                                        <Calendar className="text-cyan-600" size={18} />
                                        <span className="text-sm sm:text-base font-semibold text-gray-700">{date}</span>
                                        <span className="text-xs text-gray-500">({recipes.length})</span>
                                    </div>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {recipes.map((recipe: any) => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
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
                                <RecipeCard recipe={recipe} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </>
    )
}

