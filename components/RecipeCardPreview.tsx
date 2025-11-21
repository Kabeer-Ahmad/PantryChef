'use client'

import { useState } from 'react'
import { Clock, Eye, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RecipeDetailsModal from './RecipeDetailsModal'
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

export default function RecipeCardPreview({ recipe }: { recipe: Recipe }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rating, setRating] = useState(recipe.rating || 0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isRating, setIsRating] = useState(false)

    const handleRate = async (value: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setIsRating(true)
        setRating(value)
        await rateRecipe(recipe.id, value)
        setIsRating(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
            >
                <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 leading-tight group-hover:text-cyan-700 transition-colors line-clamp-2">
                            {recipe.recipe_json.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                            {recipe.recipe_json.description}
                        </p>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-700">
                            <Clock size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="text-xs sm:text-sm font-semibold">
                                {recipe.recipe_json.prep_time}
                            </span>
                        </div>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={(e) => handleRate(star, e)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    disabled={isRating}
                                    className="focus:outline-none transition-all hover:scale-110 active:scale-95 p-0.5"
                                >
                                    <Star
                                        size={14}
                                        className={`sm:w-4 sm:h-4 ${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-200 hover:text-yellow-200'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Show Details Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsModalOpen(true)
                        }}
                        className="mt-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm md:text-base group-hover:from-cyan-500 group-hover:to-blue-500"
                    >
                        <Eye size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <span>Show Details</span>
                    </button>
                </div>
            </motion.div>

            {/* Details Modal */}
            <RecipeDetailsModal
                recipe={recipe}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

