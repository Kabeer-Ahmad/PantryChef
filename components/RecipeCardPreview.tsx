'use client'

import { useState, useEffect } from 'react'
import { Clock, Eye, Star, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RecipeDetailsModal from './RecipeDetailsModal'
import { rateRecipe, deleteRecipe } from '@/app/actions/recipe'

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
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleRate = async (value: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setIsRating(true)
        setRating(value)
        await rateRecipe(recipe.id, value)
        setIsRating(false)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDeleting(true)
        const result = await deleteRecipe(recipe.id)
        if (result.error) {
            console.error('Failed to delete recipe:', result.error)
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowDeleteConfirm(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group transition-colors duration-300 relative"
            >
                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 10 }}
                            >
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Delete Recipe?</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelDelete}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Button - Top Right */}
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    title="Delete recipe"
                >
                    <Trash2 size={16} />
                </button>

                <div className="p-4 sm:p-5 md:p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 leading-tight group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 duration-300 pr-8">
                            {recipe.recipe_json.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 mb-2 sm:mb-3 transition-colors duration-300">
                            {recipe.recipe_json.description}
                        </p>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-700 dark:text-cyan-400 transition-colors duration-300">
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

