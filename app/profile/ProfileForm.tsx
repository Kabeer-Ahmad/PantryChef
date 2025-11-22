'use client'

import { updateProfile } from './actions'
import { useState } from 'react'
import { ChefHat } from 'lucide-react'

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Pescatarian', 'Gluten-Free', 'Keto', 'Paleo', 'Dairy-Free', 'Halal', 'Kosher', 'Low Carb', 'Whole30', 'Low FODMAP']
const COMMON_ALLERGIES = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'Mustard', 'Sulfites', 'Corn']
const CUISINE_OPTIONS = ['Pakistani', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'French', 'Mediterranean', 'American', 'Korean', 'Vietnamese', 'Greek', 'Turkish', 'Lebanese', 'Spanish']

interface ProfileFormProps {
    profile: any
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        setError('')

        const result = await updateProfile(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setMessage(result.success)
        }

        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            {/* Header with Display Name on desktop */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30">
                        <ChefHat size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Your Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Customize your cooking preferences</p>
                    </div>
                </div>
                <div className="md:w-80 flex-shrink-0">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors duration-300">
                        Display Name
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={profile?.name || ''}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-900/50 focus:border-cyan-400 dark:focus:border-cyan-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Chef John"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border border-cyan-100/50 dark:border-cyan-800/50 transition-colors duration-300">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-cyan-600 dark:text-cyan-400 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 pt-1 transition-colors duration-300">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5 transition-colors duration-300">Quick Tip</p>
                    <p>Leave these blank if you have no specific restrictions. We'll assume you enjoy everything!</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center text-sm transition-colors duration-300">🥗</span>
                        Dietary Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {DIETARY_OPTIONS.map((option) => (
                            <label key={option} className="relative group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="dietary_prefs"
                                    value={option}
                                    defaultChecked={profile?.dietary_prefs?.includes(option)}
                                    className="peer sr-only"
                                />
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all peer-checked:border-cyan-500 dark:peer-checked:border-cyan-600 peer-checked:bg-cyan-50 dark:peer-checked:bg-cyan-900/30 peer-checked:text-cyan-700 dark:peer-checked:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 duration-300">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center text-sm transition-colors duration-300">⚠️</span>
                        Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {COMMON_ALLERGIES.map((option) => (
                            <label key={option} className="relative group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="allergies"
                                    value={option}
                                    defaultChecked={profile?.allergies?.includes(option)}
                                    className="peer sr-only"
                                />
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all peer-checked:border-red-400 dark:peer-checked:border-red-600 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/30 peer-checked:text-red-700 dark:peer-checked:text-red-400 hover:border-red-200 dark:hover:border-red-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 duration-300">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors duration-300">
                        Other Allergies
                    </label>
                    <input
                        type="text"
                        name="custom_allergies"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-400 dark:focus:border-red-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-medium placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Strawberries, Latex..."
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors duration-300">
                        <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm transition-colors duration-300">🌮</span>
                        Favorite Cuisines
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {CUISINE_OPTIONS.map((option) => (
                            <label key={option} className="relative group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="favorite_cuisines"
                                    value={option}
                                    defaultChecked={profile?.favorite_cuisines?.includes(option)}
                                    className="peer sr-only"
                                />
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all peer-checked:border-orange-400 dark:peer-checked:border-orange-600 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/30 peer-checked:text-orange-700 dark:peer-checked:text-orange-400 hover:border-orange-200 dark:hover:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 duration-300">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 text-green-700 dark:text-green-400 font-medium text-center animate-fade-in transition-colors duration-300">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-700 dark:text-red-400 font-medium text-center animate-fade-in transition-colors duration-300">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
            >
                {loading ? 'Saving Profile...' : 'Save Changes'}
            </button>
        </form>
    )
}
