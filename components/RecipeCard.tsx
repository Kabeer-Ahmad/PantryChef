'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
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
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"
        >
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-cyan-700 transition-colors">
                        {recipe.recipe_json.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 whitespace-nowrap ml-4">
                        {new Date(recipe.created_at).toLocaleDateString()}
                    </span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">
                    {recipe.recipe_json.description}
                </p>

                <div className="mb-8">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-600 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                        Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {recipe.recipe_json.ingredients.slice(0, 5).map((item: string, i: number) => (
                            <span key={i} className="text-sm bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-100">
                                {item}
                            </span>
                        ))}
                        {recipe.recipe_json.ingredients.length > 5 && (
                            <span className="text-sm text-gray-400 px-2 py-1.5">
                                +{recipe.recipe_json.ingredients.length - 5} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
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
                                        size={22}
                                        className={`${star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-200 hover:text-yellow-200'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-gray-400">
                            {rating > 0 ? 'Rated' : 'Rate this'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
