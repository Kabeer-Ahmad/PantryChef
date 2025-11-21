'use client'

import { updateProfile } from './actions'
import { useState } from 'react'

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
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Display Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={profile?.name || ''}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                        placeholder="Chef John"
                    />
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100/50">
                <div className="p-2 bg-white rounded-lg shadow-sm text-cyan-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-sm text-gray-600 pt-1">
                    <p className="font-semibold text-gray-900 mb-0.5">Quick Tip</p>
                    <p>Leave these blank if you have no specific restrictions. We'll assume you enjoy everything!</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">🥗</span>
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
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 bg-white text-gray-600 text-sm font-medium transition-all peer-checked:border-cyan-500 peer-checked:bg-cyan-50 peer-checked:text-cyan-700 hover:border-cyan-200 hover:bg-gray-50">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-sm">⚠️</span>
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
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 bg-white text-gray-600 text-sm font-medium transition-all peer-checked:border-red-400 peer-checked:bg-red-50 peer-checked:text-red-700 hover:border-red-200 hover:bg-gray-50">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Other Allergies
                    </label>
                    <input
                        type="text"
                        name="custom_allergies"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                        placeholder="Strawberries, Latex..."
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">🌮</span>
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
                                <div className="px-4 py-2 rounded-full border-2 border-gray-100 bg-white text-gray-600 text-sm font-medium transition-all peer-checked:border-orange-400 peer-checked:bg-orange-50 peer-checked:text-orange-700 hover:border-orange-200 hover:bg-gray-50">
                                    {option}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {message && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 font-medium text-center animate-fade-in">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 font-medium text-center animate-fade-in">
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
