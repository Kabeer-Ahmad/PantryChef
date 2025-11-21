'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, Plus, X, ChevronDown, Sparkles, PartyPopper } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RecipeCard from './RecipeCard'
import confetti from 'canvas-confetti'

// Comprehensive ingredient database organized by category
const INGREDIENT_SUGGESTIONS = {
    'Vegetables': [
        'Tomatoes', 'Onions', 'Garlic', 'Potatoes', 'Carrots', 'Bell Peppers', 'Broccoli', 'Cauliflower',
        'Spinach', 'Lettuce', 'Cabbage', 'Cucumber', 'Zucchini', 'Eggplant', 'Mushrooms', 'Corn',
        'Peas', 'Green Beans', 'Asparagus', 'Celery', 'Leeks', 'Scallions', 'Radish', 'Beets',
        'Sweet Potatoes', 'Pumpkin', 'Squash', 'Kale', 'Arugula', 'Brussels Sprouts', 'Artichoke'
    ],
    'Fruits': [
        'Apples', 'Bananas', 'Oranges', 'Lemons', 'Limes', 'Strawberries', 'Blueberries', 'Raspberries',
        'Grapes', 'Mangoes', 'Pineapple', 'Peaches', 'Pears', 'Avocado', 'Cherries', 'Kiwi',
        'Watermelon', 'Cantaloupe', 'Grapefruit', 'Pomegranate', 'Cranberries', 'Dates', 'Figs'
    ],
    'Proteins': [
        'Chicken Breast', 'Chicken Thighs', 'Ground Chicken', 'Beef', 'Ground Beef', 'Steak',
        'Pork', 'Ground Pork', 'Bacon', 'Ham', 'Turkey', 'Ground Turkey', 'Duck', 'Lamb',
        'Salmon', 'Tuna', 'Cod', 'Shrimp', 'Crab', 'Lobster', 'Mussels', 'Clams', 'Sardines',
        'Tofu', 'Tempeh', 'Chickpeas', 'Black Beans', 'Kidney Beans', 'Lentils', 'Edamame'
    ],
    'Grains & Legumes': [
        'Rice', 'Brown Rice', 'Wild Rice', 'Quinoa', 'Couscous', 'Bulgur', 'Barley', 'Oats',
        'Pasta', 'Spaghetti', 'Penne', 'Fusilli', 'Rigatoni', 'Bread', 'Breadcrumbs', 'Flour',
        'Cornmeal', 'Polenta', 'Black Beans', 'Kidney Beans', 'Pinto Beans', 'Navy Beans',
        'Chickpeas', 'Lentils', 'Split Peas', 'Black-Eyed Peas', 'Cannellini Beans'
    ],
    'Dairy & Eggs': [
        'Milk', 'Heavy Cream', 'Butter', 'Cheese', 'Cheddar Cheese', 'Mozzarella', 'Parmesan',
        'Feta Cheese', 'Goat Cheese', 'Cream Cheese', 'Sour Cream', 'Yogurt', 'Greek Yogurt',
        'Eggs', 'Egg Whites', 'Buttermilk', 'Cottage Cheese', 'Ricotta Cheese'
    ],
    'Spices & Herbs': [
        'Salt', 'Black Pepper', 'Paprika', 'Cumin', 'Coriander', 'Turmeric', 'Cinnamon',
        'Nutmeg', 'Ginger', 'Garlic Powder', 'Onion Powder', 'Chili Powder', 'Cayenne Pepper',
        'Red Pepper Flakes', 'Oregano', 'Basil', 'Thyme', 'Rosemary', 'Sage', 'Parsley',
        'Cilantro', 'Dill', 'Bay Leaves', 'Cardamom', 'Cloves', 'Star Anise', 'Fennel Seeds',
        'Mustard Seeds', 'Curry Powder', 'Garam Masala', 'Five Spice', 'Za\'atar'
    ],
    'Condiments & Sauces': [
        'Olive Oil', 'Vegetable Oil', 'Sesame Oil', 'Soy Sauce', 'Worcestershire Sauce',
        'Hot Sauce', 'Sriracha', 'Ketchup', 'Mustard', 'Mayonnaise', 'BBQ Sauce',
        'Teriyaki Sauce', 'Hoisin Sauce', 'Fish Sauce', 'Oyster Sauce', 'Vinegar',
        'Balsamic Vinegar', 'Apple Cider Vinegar', 'Rice Vinegar', 'Lemon Juice', 'Lime Juice',
        'Honey', 'Maple Syrup', 'Tomato Paste', 'Tomato Sauce', 'Pesto', 'Tahini'
    ],
    'Nuts & Seeds': [
        'Almonds', 'Walnuts', 'Pecans', 'Cashews', 'Peanuts', 'Pistachios', 'Hazelnuts',
        'Pine Nuts', 'Sunflower Seeds', 'Pumpkin Seeds', 'Sesame Seeds', 'Chia Seeds',
        'Flax Seeds', 'Hemp Seeds', 'Almond Butter', 'Peanut Butter', 'Cashew Butter'
    ],
    'Pantry Staples': [
        'Chicken Broth', 'Beef Broth', 'Vegetable Broth', 'Coconut Milk', 'Coconut Cream',
        'Canned Tomatoes', 'Canned Corn', 'Canned Beans', 'Olives', 'Capers', 'Anchovies',
        'Baking Soda', 'Baking Powder', 'Vanilla Extract', 'Cocoa Powder', 'Chocolate Chips',
        'Sugar', 'Brown Sugar', 'Powdered Sugar', 'Cornstarch', 'Arrowroot'
    ]
}

// Flatten all ingredients into a single searchable array (remove duplicates)
const ALL_INGREDIENTS = Array.from(new Set(Object.values(INGREDIENT_SUGGESTIONS).flat()))

export default function RecipeGenerator() {
    const [ingredients, setIngredients] = useState<string[]>([])
    const [currentIngredient, setCurrentIngredient] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [showCategories, setShowCategories] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const [recipe, setRecipe] = useState<any>(null)
    const [error, setError] = useState('')

    // Filter suggestions based on input
    useEffect(() => {
        if (currentIngredient.trim().length > 0) {
            const filtered = Array.from(new Set(
                ALL_INGREDIENTS.filter(ing =>
                    ing.toLowerCase().includes(currentIngredient.toLowerCase())
                )
            )).slice(0, 8) // Limit to 8 suggestions
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
            setSelectedIndex(-1)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [currentIngredient])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const addIngredient = (ingredient?: string) => {
        const ingredientToAdd = ingredient || currentIngredient.trim()
        if (ingredientToAdd && !ingredients.includes(ingredientToAdd)) {
            setIngredients([...ingredients, ingredientToAdd])
            setCurrentIngredient('')
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                addIngredient(suggestions[selectedIndex])
            } else {
                addIngredient()
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }
    }

    const selectFromCategory = (ingredient: string) => {
        addIngredient(ingredient)
        setShowCategories(false)
    }

    const triggerCelebration = () => {
        // Fireworks effect
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            
            // Launch from left
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            
            // Launch from right
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)

        // Center burst
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
            })
        }, 100)
    }

    const generateRecipe = async () => {
        if (ingredients.length === 0) return

        setLoading(true)
        setError('')
        setRecipe(null)

        try {
            const res = await fetch('/api/generate-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate recipe')
            }

            setRecipe(data)
            
            // Trigger celebration animation after a small delay
            setTimeout(() => {
                triggerCelebration()
            }, 100)
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateNew = () => {
        setRecipe(null)
        setIngredients([])
        setCurrentIngredient('')
        setError('')
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {!recipe ? (
                    <motion.div
                        key="input-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">🥘</span> What's in your pantry?
                        </h2>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1 group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentIngredient}
                            onChange={(e) => {
                                setCurrentIngredient(e.target.value)
                                setShowSuggestions(true)
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowSuggestions(true)
                            }}
                            placeholder="Type an ingredient..."
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 outline-none transition-all text-base sm:text-lg placeholder-gray-400 group-hover:border-gray-200"
                        />
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs sm:text-sm hidden sm:block">
                            Press Enter
                        </div>
                        
                        {/* Autocomplete Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl max-h-48 sm:max-h-64 overflow-y-auto"
                            >
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={`${suggestion}-${index}`}
                                        type="button"
                                        onClick={() => addIngredient(suggestion)}
                                        className={`w-full text-left px-4 py-3 hover:bg-cyan-50 transition-colors ${
                                            index === selectedIndex ? 'bg-cyan-50' : ''
                                        } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                                            index === suggestions.length - 1 ? 'rounded-b-2xl' : ''
                                        }`}
                                    >
                                        <span className="text-gray-700 font-medium">{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => addIngredient()}
                            className="bg-cyan-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95 flex-shrink-0"
                            aria-label="Add ingredient"
                        >
                            <Plus size={24} className="sm:w-7 sm:h-7" />
                        </button>
                        <button
                            onClick={() => setShowCategories(!showCategories)}
                            className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-3 sm:py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-1 sm:gap-2 flex-shrink-0"
                        >
                            <ChevronDown size={18} className={`sm:w-5 sm:h-5 ${showCategories ? 'rotate-180 transition-transform' : ''}`} />
                            <span className="hidden sm:inline text-sm sm:text-base">Browse</span>
                        </button>
                    </div>
                </div>

                {/* Category Browser */}
                {showCategories && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 bg-gray-50 rounded-2xl p-3 sm:p-4 border-2 border-gray-100 max-h-[60vh] sm:max-h-96 overflow-y-auto"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {Object.entries(INGREDIENT_SUGGESTIONS).map(([category, items]) => (
                                <div key={category} className="bg-white rounded-xl p-4 border border-gray-200">
                                    <h3 className="font-bold text-gray-800 mb-2 text-sm">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {items.slice(0, 6).map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => selectFromCategory(item)}
                                                disabled={ingredients.includes(item)}
                                                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                                                    ingredients.includes(item)
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 hover:shadow-sm'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                        {items.length > 6 && (
                                            <span className="px-3 py-1.5 text-xs text-gray-500">
                                                +{items.length - 6} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 min-h-[60px]">
                    <AnimatePresence mode="popLayout">
                        {ingredients.length === 0 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-400 italic w-full text-center py-2"
                            >
                                No ingredients added yet. Start typing above!
                            </motion.p>
                        )}
                        {ingredients.map((ing, i) => (
                            <motion.span
                                key={`${ing}-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 font-medium border border-cyan-100 shadow-sm text-sm sm:text-base"
                            >
                                {ing}
                                <button
                                    onClick={() => removeIngredient(i)}
                                    className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>

                <button
                    onClick={generateRecipe}
                    disabled={ingredients.length === 0 || loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 sm:p-5 rounded-2xl font-bold text-lg sm:text-xl hover:shadow-xl hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 sm:gap-3 group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> 
                            <span className="text-base sm:text-lg">Generating Chef's Special...</span>
                        </>
                    ) : (
                        <>
                            <span className="text-base sm:text-lg">Generate Recipe</span>
                            <Sparkles className="group-hover:translate-x-1 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                    )}
                </button>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 mt-6 text-center bg-red-50 py-3 rounded-xl border border-red-100"
                            >
                                {error}
                            </motion.p>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="recipe-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6"
                    >
                        {/* Celebration Header with Generate New Button */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mb-4 sm:mb-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl border-2 border-cyan-200 shadow-lg">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                            duration: 0.5,
                                            repeat: 2,
                                            repeatDelay: 0.2
                                        }}
                                        className="flex-shrink-0"
                                    >
                                        <PartyPopper className="text-cyan-600 sm:w-6 sm:h-6" size={20} />
                                    </motion.div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-0.5 leading-tight">
                                            Ta-da! Your Recipe is Ready!
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            Below is the recipe crafted especially for you
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateNew}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white text-cyan-600 rounded-lg font-medium hover:bg-cyan-50 border border-cyan-200 transition-all hover:shadow-sm active:scale-95 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
                                >
                                    <Plus className="rotate-45 sm:w-4 sm:h-4" size={14} />
                                    <span className="hidden sm:inline">New Recipe</span>
                                    <span className="sm:hidden">New</span>
                                </button>
                            </div>
                        </motion.div>
                        <RecipeCard recipe={recipe} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
