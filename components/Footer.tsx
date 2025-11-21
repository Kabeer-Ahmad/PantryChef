import Link from 'next/link'
import { ChefHat, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="#" className="text-gray-400 hover:text-cyan-600 transition-colors">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-cyan-600 transition-colors">
                        <span className="sr-only">GitHub</span>
                        <Github className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-cyan-600 transition-colors">
                        <span className="sr-only">Instagram</span>
                        <Instagram className="h-6 w-6" />
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
                        <ChefHat className="h-6 w-6 text-cyan-600" />
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; {new Date().getFullYear()} PantryChef, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
