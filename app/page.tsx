'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChefHat, Brain, Clock, Heart, Utensils, Star, Leaf, X, LogIn } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        router.push('/profile');
        router.refresh();
      }
    } catch (error: any) {
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    // Scroll to hero section smoothly
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), springConfig);

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      <Navbar user={user} onLoginClick={handleLoginClick} />

      {/* Hero Section */}
      <div ref={heroRef} className="relative isolate px-6 pt-6 sm:pt-6 lg:px-8 flex-grow flex items-center">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <motion.div
            animate={{
              rotate: [30, 60, 30],
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut"
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-200 to-blue-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl py-6 sm:py-8 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:py-12 items-center">
          <div className="lg:col-span-6 text-center lg:text-left mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-cyan-600 ring-1 ring-inset ring-cyan-600/20 bg-cyan-50 mb-6">
                <Sparkles className="mr-1 h-4 w-4" />
                AI-Powered Cooking Assistant
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                Turn your leftovers into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Masterpieces</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600 mb-8">
                Don't let good food go to waste. PantryChef uses advanced AI to create delicious, personalized recipes from ingredients you already have.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-x-6">
                <button
                  onClick={() => {
                    if (user) {
                      router.push('/dashboard');
                    } else {
                      setShowLogin(true);
                      // Scroll to login window on mobile if needed
                      setTimeout(() => {
                        const loginElement = document.getElementById('login-window-container');
                        loginElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }
                  }}
                  className="w-full sm:w-auto group rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-cyan-500 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Start Cooking Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  See how it works <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Conditional: MacBook Login Window or Recipe Card */}
          <div id="login-window-container" className="col-span-12 lg:col-span-6 relative mt-10 lg:mt-0 perspective-1000">
            {!showLogin ? (
              // Recipe Card
              <motion.div
                key="recipe-card"
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="relative z-10 max-w-md mx-auto lg:max-w-none"
              >
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform transition-transform hover:scale-[1.02] duration-300">
                  {/* Card Header Image */}
                  <div className="relative h-48 sm:h-56 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                      alt="Delicious Bowl"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-green-500/80 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider">Match 98%</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-bold text-xl sm:text-2xl">Healthy Quinoa Bowl</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-gray-800 shadow-lg">
                      <Clock className="w-3.5 h-3.5 text-cyan-600" />
                      15 min
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">🍅</div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">🥑</div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">🥬</div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        + 2 pantry items
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-cyan-50/50 p-4 rounded-xl border border-cyan-100/50">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-[10px] font-bold">1</div>
                        <span>Cook quinoa according to package</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-[10px] font-bold">2</div>
                        <span>Slice avocado and cherry tomatoes</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 text-[10px] font-bold">3</div>
                        <span>Combine and drizzle with dressing</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <Utensils className="w-4 h-4" />
                      View Full Recipe
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -right-4 sm:-right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 max-w-[150px] hidden sm:block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">Eco Friendly</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">Saved 2 ingredients from waste!</p>
                </motion.div>

                {/* Decorative Blobs */}
                <motion.div
                  animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl -z-10"
                />
                <motion.div
                  animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                  className="absolute -bottom-12 -left-12 w-72 h-72 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10"
                />
              </motion.div>
            ) : (
              // MacBook Login Window
              <motion.div
                key="login-window"
                initial={{ opacity: 0, scale: 0.85, y: 30, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                  damping: 20
                }}
                className="relative z-10 max-w-md mx-auto lg:max-w-none"
              >
                {/* MacBook Window */}
                <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden border border-gray-300/80 backdrop-blur-sm">
                  {/* Window Title Bar */}
                  <div className="bg-gradient-to-b from-gray-200/90 to-gray-300/90 backdrop-blur-md px-4 py-3 flex items-center gap-2 border-b border-gray-400/50">
                    <motion.button
                      onClick={() => setShowLogin(false)}
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 transition-all shadow-sm relative group"
                      aria-label="Close"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-2 h-2 text-red-900/0 group-hover:text-red-900/60 absolute inset-0 m-auto transition-colors" />
                    </motion.button>
                    <motion.div
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="flex-1 text-center">
                      <span className="text-xs font-semibold text-gray-700">PantryChef Login</span>
                    </div>
                  </div>



                  {/* Auth Form Container */}
                  <motion.div
                    className="bg-white p-6 sm:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <motion.div
                      className="text-center mb-6"
                      key={isLogin ? 'login-header' : 'signup-header'}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {isLogin ? 'Sign in to start cooking' : 'Join PantryChef today'}
                      </p>
                    </motion.div>

                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                      >
                        {loginError}
                      </motion.div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                      >
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="you@example.com"
                          />
                          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 pl-11 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                          />
                          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        className="relative w-full py-3.5 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white rounded-xl font-bold text-base hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/50 overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                          </div>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <LogIn className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                          </>
                        )}
                      </motion.button>
                    </form>

                    <motion.div
                      className="mt-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setLoginError('');
                          }}
                          className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline focus:outline-none"
                        >
                          {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Decorative Blobs for Login */}
                <motion.div
                  animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl -z-10"
                />
                <motion.div
                  animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                  className="absolute -bottom-12 -left-12 w-72 h-72 bg-gradient-to-tr from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden" ref={targetRef}>
        <motion.div style={{ y }} className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-200 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000" />
        </motion.div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            style={{ opacity, scale }}
            className="mx-auto max-w-2xl lg:text-center mb-16"
          >
            <h2 className="text-base font-semibold leading-7 text-cyan-600">Cook Smarter</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to master your kitchen
            </p>
          </motion.div>

          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {[
                {
                  name: 'AI-Powered Recipes',
                  description: 'Our advanced AI understands ingredients and cooking techniques to create unique, edible recipes just for you.',
                  icon: Sparkles,
                },
                {
                  name: 'Reduce Food Waste',
                  description: 'Use what you have. Save money and help the planet by cooking with ingredients that might otherwise go to waste.',
                  icon: Leaf,
                },
                {
                  name: 'Personalized for You',
                  description: "Set your dietary preferences, allergies, and favorite cuisines. We'll tailor every recipe to your needs.",
                  icon: ChefHat,
                },
                {
                  name: 'Quick & Easy',
                  description: 'Get recipes in seconds. Filter by prep time to find something that fits your schedule perfectly.',
                  icon: Clock,
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 50 }}
                  className="relative flex flex-col bg-gradient-to-br from-white via-white to-cyan-50/30 p-8 rounded-2xl border border-gray-200/50 group"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 0 0 1px rgba(6, 182, 212, 0.05)',
                    transform: 'translateY(-2px)',
                  }}
                >
                  {/* 3D depth layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-400/20 rounded-2xl blur-sm -z-10" />

                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 relative z-10">
                    <div className="relative h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 group-hover:from-cyan-400 group-hover:to-cyan-500 transition-all overflow-hidden shadow-lg shadow-cyan-500/30">
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                          repeatDelay: 2
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                      <feature.icon className="h-6 w-6 text-white relative z-10 drop-shadow-sm" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
