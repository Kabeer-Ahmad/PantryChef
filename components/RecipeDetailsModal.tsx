'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, ChefHat, UtensilsCrossed, Star } from 'lucide-react'
import { useState } from 'react'
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

interface RecipeDetailsModalProps {
    recipe: Recipe
    isOpen: boolean
    onClose: () => void
}

export default function RecipeDetailsModal({ recipe, isOpen, onClose }: RecipeDetailsModalProps) {
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight pr-2">
                                            {recipe.recipe_json.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                                            {recipe.recipe_json.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-white/80 rounded-full transition-colors"
                                        aria-label="Close"
                                    >
                                        <X size={20} className="sm:w-6 sm:h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-700">
                                        <Clock size={16} className="sm:w-5 sm:h-5" />
                                        <span className="font-semibold text-xs sm:text-sm md:text-base">
                                            {recipe.recipe_json.prep_time}
                                        </span>
                                    </div>
                                    {recipe.created_at && (
                                        <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                                            {new Date(recipe.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
                                {/* Ingredients Section */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                                        <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg">
                                            <UtensilsCrossed className="text-cyan-600 sm:w-5 sm:h-5" size={18} />
                                        </div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                            Ingredients
                                        </h3>
                                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                                            {recipe.recipe_json.ingredients.length} items
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                        {recipe.recipe_json.ingredients.map((item: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all"
                                            >
                                                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-xs flex items-center justify-center mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-700 text-xs sm:text-sm md:text-base flex-1">
                                                    {item}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Instructions Section */}
                                <div className="mb-6 sm:mb-8">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                            <ChefHat className="text-blue-600 sm:w-5 sm:h-5" size={18} />
                                        </div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                            Instructions
                                        </h3>
                                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                                            {recipe.recipe_json.instructions.length} steps
                                        </span>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {recipe.recipe_json.instructions.map((instruction: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex gap-2 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border-l-4 border-cyan-500 hover:shadow-md transition-all"
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-lg">
                                                        {i + 1}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed flex-1 pt-0.5 sm:pt-1">
                                                    {instruction}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Rating */}
                            <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex-shrink-0">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-700">Rate this recipe:</span>
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => handleRate(star)}
                                                        disabled={isRating}
                                                        className="focus:outline-none transition-all hover:scale-110 active:scale-95 p-0.5 sm:p-1"
                                                    >
                                                    <Star
                                                        size={20}
                                                        className={`sm:w-6 sm:h-6 ${star <= (hoverRating || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-200 hover:text-yellow-200'
                                                            } transition-colors`}
                                                    />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {rating > 0 && (
                                            <span className="text-xs sm:text-sm font-medium text-gray-500 bg-yellow-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-yellow-200">
                                                Rated {rating} {rating === 1 ? 'star' : 'stars'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

