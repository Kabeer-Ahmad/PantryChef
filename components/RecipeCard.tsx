'use client'

import { useState } from 'react'
import { Star, Clock, ChefHat, UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'
import { rateRecipe } from '@/app/actions/recipe'

interface Recipe {
    id: number
    recipe_json: {
        title: string
        description: string
        ingredients: string[]
        instructions: string[]
        prep_time: string
    }
    rating: number | null
    created_at: string
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const [rating, setRating] = useState(recipe.rating || 0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isRating, setIsRating] = useState(false)

    const handleRate = async (value: number) => {
        setIsRating(true)
        setRating(value)
        await rateRecipe(recipe.id, value)
        setIsRating(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight transition-colors duration-300">
                            {recipe.recipe_json.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed transition-colors duration-300">
                            {recipe.recipe_json.description}
                        </p>
                    </div>
                    {recipe.created_at && (
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 whitespace-nowrap transition-colors duration-300">
                            {new Date(recipe.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    )}
                </div>

                {/* Prep Time Badge */}
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 transition-colors duration-300">
                    <Clock size={18} />
                    <span className="font-semibold text-sm sm:text-base">
                        {recipe.recipe_json.prep_time}
                    </span>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {/* Ingredients Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg transition-colors duration-300">
                            <UtensilsCrossed className="text-cyan-600 dark:text-cyan-400" size={20} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            Ingredients
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors duration-300">
                            {recipe.recipe_json.ingredients.length} items
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {recipe.recipe_json.ingredients.map((item: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-cyan-200 dark:hover:border-cyan-700 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/30 transition-all duration-300"
                            >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 font-semibold text-xs flex items-center justify-center mt-0.5 transition-colors duration-300">
                                    {i + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base flex-1 transition-colors duration-300">
                                    {item}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg transition-colors duration-300">
                            <ChefHat className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            Instructions
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors duration-300">
                            {recipe.recipe_json.instructions.length} steps
                        </span>
                    </div>
                    <div className="space-y-4">
                        {recipe.recipe_json.instructions.map((instruction: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-xl border-l-4 border-cyan-500 dark:border-cyan-600 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-lg">
                                        {i + 1}
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed flex-1 pt-1 transition-colors duration-300">
                                    {instruction}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Rating Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">Rate this recipe:</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleRate(star)}
                                        disabled={isRating}
                                        className="focus:outline-none transition-all hover:scale-110 active:scale-95 p-1"
                                    >
                                        <Star
                                            size={24}
                                            className={`${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-200 hover:text-yellow-200'
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {rating > 0 && (
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800/50 transition-colors duration-300">
                                Rated {rating} {rating === 1 ? 'star' : 'stars'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
