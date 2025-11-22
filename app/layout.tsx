import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "PantryChef - Your AI Recipe Generator",
  description: "Generate delicious recipes from the ingredients you have in your pantry",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
};

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Always start with light theme - remove dark class
                  document.documentElement.classList.remove('dark');
                  
                  // Check localStorage for user's saved preference
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    // Default to light theme (ignore system preference)
                    document.documentElement.classList.remove('dark');
                    // Set to light if not already set
                    if (!theme) {
                      localStorage.setItem('theme', 'light');
                    }
                  }
                } catch (e) {
                  // If error, ensure light theme
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased transition-colors duration-300"
      >
        <ThemeProvider>
          <CustomCursor />
          <Navbar user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
