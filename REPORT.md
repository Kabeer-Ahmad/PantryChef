# PantryChef: AI-Powered Recipe Generation System

## Group Members

**Project Lead:** [Name]  
**Team Members:** [Name 1], [Name 2], [Name 3]  
**Institution:** [Institution Name]  
**Date:** November 2024

---

## Abstract

PantryChef is an intelligent web application that generates personalized recipes based on available ingredients, dietary preferences, allergies, and cuisine preferences. The system leverages Large Language Models (LLMs) through Hugging Face's model ecosystem, specifically utilizing the Qwen2.5-7B-Instruct model to create structured, usable recipes from user-specified ingredients. Built using Next.js 16 with React 19, the application provides a seamless user experience with features including ingredient autocomplete, recipe history tracking, user profiles, and responsive mobile design. The system integrates Supabase for authentication and data persistence, and employs a Gradio-based API deployed on Hugging Face Spaces for scalable recipe generation. This project demonstrates the practical application of modern AI technology in solving everyday culinary challenges, making home cooking more accessible and personalized.

**Keywords:** Recipe Generation, Large Language Models, Next.js, Hugging Face, AI-Powered Cooking, Personalization

---

## 1. Introduction

### 1.1 Background and Motivation

Cooking at home has numerous benefits, including better nutrition, cost savings, and creative expression. However, a common challenge faced by home cooks is determining what to cook with the ingredients they already have in their pantry. Traditional recipe websites require users to search for specific dishes, which often necessitates purchasing additional ingredients. This creates barriers to spontaneous cooking and can lead to food waste.

The advent of Large Language Models (LLMs) has opened new possibilities for solving this problem. Modern instruction-tuned models can understand natural language inputs about available ingredients and generate coherent, practical recipes that respect dietary constraints and preferences. This project aims to harness these capabilities to create an accessible, user-friendly solution for personalized recipe generation.

### 1.2 Problem Statement

The primary problem addressed by PantryChef is:
- **Ingredient-driven recipe discovery**: Users need a way to generate recipes based solely on available ingredients
- **Personalization**: Recipes must respect dietary preferences, allergies, and cuisine preferences
- **Usability**: The system must be intuitive, responsive, and accessible across devices
- **Reliability**: Generated recipes must be practical, well-structured, and safe to follow

### 1.3 Objectives

The main objectives of this project are:

1. **Develop a robust AI-powered recipe generation system** that accepts ingredient lists and user preferences to produce structured recipe outputs
2. **Create an intuitive web interface** with features such as ingredient autocomplete, recipe history, and user profiles
3. **Implement a scalable architecture** using modern web technologies and cloud-based AI services
4. **Ensure accessibility and mobile responsiveness** for a wide range of users and devices
5. **Validate the system's effectiveness** through functional testing and user experience evaluation

### 1.4 Scope

This project encompasses:
- Frontend web application (Next.js 16 with React 19)
- Backend API integration (Next.js API routes)
- AI model integration (Hugging Face Spaces with Gradio)
- Database and authentication (Supabase)
- Deployment infrastructure (Hugging Face Spaces + Next.js hosting)

The scope does not include:
- Real-time ingredient inventory tracking
- Shopping list generation
- Nutritional analysis
- Recipe image generation

---

## 2. Proposed Methodology

### 2.1 System Architecture

PantryChef follows a client-server architecture with three main components:

1. **Frontend Application** (Next.js)
   - User interface and interactions
   - Client-side state management
   - Responsive design for desktop and mobile

2. **Backend API** (Next.js API Routes)
   - Request validation and authentication
   - Integration with AI service
   - Database operations (Supabase)

3. **AI Service** (Hugging Face Spaces)
   - LLM model hosting
   - Recipe generation logic
   - Structured output formatting

#### Architecture Diagram Flow:
```
User → Next.js Frontend → Next.js API Route → Gradio Client → Hugging Face Space → LLM Model
                                                      ↓
                                          Supabase Database ← Recipe Storage
```

### 2.2 Technology Stack

#### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library with modern hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Canvas Confetti**: Celebration animations

#### Backend
- **Next.js API Routes**: Serverless functions
- **Supabase**: Authentication and PostgreSQL database
- **@gradio/client**: Integration with Hugging Face Spaces

#### AI/ML
- **Hugging Face Transformers**: Model loading and inference
- **Qwen2.5-7B-Instruct**: Primary LLM for recipe generation
- **Gradio**: Web interface and API for the AI service
- **PyTorch**: Deep learning framework

### 2.3 Core Components

#### 2.3.1 Ingredient Input System

The ingredient input component (`RecipeGenerator.tsx`) features:

- **Autocomplete Suggestions**: Comprehensive database of 200+ ingredients organized by categories (Vegetables, Fruits, Proteins, Grains, Dairy, Spices, etc.)
- **Category Browser**: Users can browse ingredient categories and quickly add items
- **Custom Input**: Users can add ingredients not in the suggestions by pressing Enter
- **Visual Feedback**: Real-time ingredient tags with removal capability

**Technical Implementation:**
- State management using React hooks (`useState`, `useMemo`)
- Keyboard navigation support (Arrow keys, Enter, Escape)
- Debounced search filtering for performance

#### 2.3.2 Recipe Generation Pipeline

The recipe generation process involves multiple steps:

1. **Input Validation**: Verify user authentication and ingredient list validity
2. **Profile Retrieval**: Fetch user's dietary preferences, allergies, and favorite cuisines from Supabase
3. **Prompt Construction**: Build a structured prompt that includes:
   - Available ingredients
   - Dietary preferences (vegetarian, vegan, keto, etc.)
   - Allergies (must-avoid items)
   - Cuisine preferences (Italian, Asian, Mexican, etc.)
4. **AI Generation**: Send prompt to Hugging Face Space via Gradio client
5. **Response Parsing**: Extract JSON from markdown-formatted response
6. **Validation**: Ensure recipe structure matches expected schema
7. **Database Storage**: Save recipe to Supabase with user association
8. **Response Delivery**: Return recipe data to frontend

**Prompt Engineering Strategy:**
The system uses a carefully constructed prompt that:
- Explicitly requests JSON-only output
- Specifies required fields (title, description, ingredients, instructions, prep_time)
- Emphasizes the use of only provided ingredients (with basic staples allowed)
- Clearly states allergy avoidance requirements
- Incorporates dietary and cuisine preferences

#### 2.3.3 User Interface Components

**Dashboard Page** (`app/dashboard/page.tsx`):
- Recipe generator interface
- Animated gradient background
- Mobile-responsive layout with sticky bottom navigation

**History Page** (`app/history/page.tsx`):
- Recipe preview cards showing title, description, prep time, and rating
- "Show Details" modal with full recipe information
- Recipe rating system (1-5 stars)
- Date-based organization

**Profile Page** (`app/profile/page.tsx`):
- User profile management
- Dietary preferences configuration
- Allergy settings
- Favorite cuisines selection
- Display name customization

**Recipe Display Components**:
- `RecipeCard.tsx`: Full recipe display with gradient header, ingredient grid, numbered instructions
- `RecipeCardPreview.tsx`: Compact preview for history page
- `RecipeDetailsModal.tsx`: Animated modal for detailed recipe view

#### 2.3.4 AI Model Configuration

**Model Selection**: Qwen2.5-7B-Instruct
- **Rationale**: 
  - Non-gated model (no approval required)
  - Excellent instruction-following capabilities
  - Strong performance on structured outputs
  - Balanced performance-to-size ratio

**Inference Configuration**:
- Temperature: 0.7 (balanced creativity and consistency)
- Max tokens: 1500 (sufficient for complete recipes)
- Top-p sampling: 0.9
- Attention mask: Explicitly provided to avoid padding issues
- Chat template: Uses model's native chat format for better instruction following

#### 2.3.5 Database Schema

**Supabase Tables**:

1. **profiles**:
   - `id` (UUID, primary key, references auth.users)
   - `name` (text)
   - `dietary_prefs` (text array)
   - `allergies` (text array)
   - `favorite_cuisines` (text array)

2. **recipes**:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to profiles.id)
   - `ingredients_used` (text array)
   - `recipe_json` (JSONB)
   - `rating` (integer, 0-5)
   - `created_at` (timestamp)

### 2.4 User Experience Design

#### 2.4.1 Mobile-First Approach

- Sticky bottom navigation for logged-in users (Dashboard, History, Profile)
- Touch-optimized input fields and buttons
- Responsive grid layouts that adapt to screen size
- Disabled custom cursor effects on mobile devices

#### 2.4.2 Visual Design

- Clean, modern aesthetic with cyan-blue gradient theme
- Animated gradient blobs for visual interest
- Smooth transitions and micro-interactions
- Celebration animations upon recipe generation
- Consistent iconography using Lucide React

#### 2.4.3 Interaction Patterns

- Immediate feedback for user actions
- Loading states during recipe generation
- Error handling with user-friendly messages
- Modal dialogs for detailed views
- Keyboard shortcuts for power users

### 2.5 Deployment Strategy

1. **Hugging Face Space Deployment**:
   - Gradio application deployed to `Stylique/pantry-chef`
   - Automatic GPU allocation
   - Public API access via Gradio client

2. **Next.js Application Deployment**:
   - Compatible with Vercel, Netlify, or self-hosted
   - Environment variables for API keys and configuration
   - Build-time optimization

3. **Database and Authentication**:
   - Managed Supabase instance
   - Automatic backups and scaling
   - Row-level security policies

---

## 3. Initial Results

### 3.1 Implementation Status

As of the current development phase, the following components have been successfully implemented:

#### 3.1.1 Frontend Features ✅

- **Authentication System**: Complete login/logout functionality with Supabase Auth
- **Dashboard Interface**: Functional recipe generator with ingredient input
- **Ingredient Suggestions**: Comprehensive database with autocomplete and category browsing
- **Recipe Display**: Rich recipe card component with structured layout
- **History Page**: Recipe preview cards with modal details view
- **Profile Management**: User settings for dietary preferences, allergies, and cuisines
- **Mobile Responsiveness**: Fully responsive design with sticky navigation
- **Animated Backgrounds**: Gradient blob animations on dashboard, history, and profile pages
- **Celebration Effects**: Confetti animations upon recipe generation

#### 3.1.2 Backend Integration ✅

- **API Route**: Functional `/api/generate-recipe` endpoint
- **Authentication Middleware**: User verification on protected routes
- **Gradio Client Integration**: Successful connection to Hugging Face Space
- **Database Operations**: Recipe storage and retrieval working correctly
- **Error Handling**: Comprehensive error handling and user feedback

#### 3.1.3 AI Service ✅

- **Model Deployment**: Qwen2.5-7B-Instruct successfully deployed on Hugging Face Space
- **Gradio Interface**: Working API endpoint `/generate_recipe`
- **JSON Extraction**: Robust parsing of LLM responses
- **Prompt Engineering**: Effective prompt structure for structured outputs

### 3.2 Technical Achievements

1. **Successful AI Integration**: 
   - Model loads correctly without authentication requirements
   - Generates coherent, structured recipe outputs
   - Handles dietary constraints and preferences appropriately

2. **Robust JSON Parsing**:
   - Multiple extraction strategies (regex, code block detection)
   - Error recovery mechanisms
   - Validation of recipe structure before storage

3. **Responsive Design**:
   - Mobile-first approach with touch optimization
   - Desktop enhancements with hover effects
   - Consistent experience across devices

4. **Performance Optimizations**:
   - Debounced search in ingredient autocomplete
   - Memoized filtered suggestions
   - Efficient state management
   - Optimized animations using Framer Motion

### 3.3 Sample Outputs

The system successfully generates recipes with the following structure:

```json
{
  "title": "Spicy Tomato Rice with Herbs",
  "description": "A flavorful one-pot dish combining tomatoes, rice, and aromatic spices.",
  "ingredients": [
    "2 cups rice",
    "4 large tomatoes, diced",
    "1 onion, chopped",
    "3 cloves garlic, minced",
    "2 tbsp olive oil",
    "1 tsp salt",
    "1/2 tsp black pepper",
    "1 tsp paprika"
  ],
  "instructions": [
    "Heat oil in a large pot over medium heat.",
    "Add onions and garlic, sauté until fragrant.",
    "Add tomatoes and cook until softened.",
    "Stir in rice and spices, then add 4 cups of water.",
    "Bring to a boil, reduce heat, cover and simmer for 20 minutes.",
    "Let stand covered for 5 minutes before serving."
  ],
  "prep_time": "35 minutes"
}
```

### 3.4 User Interface Screenshots/Descriptions

**Dashboard View**:
- Clean hero section with ingredient input field
- Category browser for quick ingredient selection
- Generate button with loading states
- Celebration header with confetti on successful generation

**History Page**:
- Grid layout of recipe preview cards
- Compact information display (title, description, prep time, rating)
- "Show Details" button for full recipe view
- Smooth modal animations

**Recipe Details Modal**:
- Gradient header with recipe title and description
- Ingredients grid with numbered items
- Step-by-step instructions with numbered badges
- Rating section in footer

### 3.5 Current Limitations and Future Improvements

#### Known Limitations:

1. **Model Constraints**:
   - Occasional inconsistency in output format
   - May add ingredients not in the user's list (basic staples allowed)
   - Response times vary (3-10 seconds depending on model load)

2. **Feature Gaps**:
   - No recipe editing capability
   - No sharing functionality
   - No recipe favorites/bookmarking
   - No nutritional information

3. **Technical Debt**:
   - JSON parsing could be more robust
   - Error messages could be more specific
   - Recipe validation could be stricter

#### Planned Improvements:

1. **Enhanced AI Capabilities**:
   - Fine-tune model on recipe dataset for better consistency
   - Implement recipe quality scoring
   - Add multi-recipe generation (suggest 3 variations)

2. **User Features**:
   - Recipe sharing via links
   - Export recipes to PDF
   - Shopping list generation
   - Recipe ratings and reviews

3. **Technical Enhancements**:
   - Caching for frequently requested recipes
   - Batch ingredient suggestions based on user history
   - Image generation for recipes
   - Voice input for ingredients

4. **Performance**:
   - Model quantization for faster inference
   - Response streaming for better UX
   - CDN caching for static assets

### 3.6 Testing Status

**Manual Testing Completed**:
- ✅ User authentication flow
- ✅ Recipe generation with various ingredient combinations
- ✅ Dietary preference handling
- ✅ Allergy avoidance
- ✅ Mobile responsiveness
- ✅ Recipe storage and retrieval
- ✅ Rating system functionality

**Automated Testing** (To be implemented):
- Unit tests for utility functions
- Integration tests for API routes
- End-to-end tests for critical user flows

---

## 4. Conclusion

PantryChef demonstrates a successful integration of modern AI technology with user-friendly web design to solve a practical everyday problem. The system effectively generates personalized recipes based on available ingredients while respecting user preferences and constraints. The initial implementation shows promising results in terms of functionality, user experience, and technical architecture.

The project successfully leverages:
- **Modern Web Technologies**: Next.js 16, React 19, TypeScript for a robust frontend
- **Cloud Services**: Supabase for backend, Hugging Face Spaces for AI
- **LLM Capabilities**: Qwen2.5-7B-Instruct for structured recipe generation
- **Best Practices**: Mobile-first design, type safety, error handling

While there are areas for improvement, the foundation is solid and the system is functional for end users. Future work will focus on enhancing AI consistency, expanding features, and improving performance.

---

## 5. References and Technologies

### Technologies Used
- Next.js 16: https://nextjs.org
- React 19: https://react.dev
- Supabase: https://supabase.com
- Hugging Face: https://huggingface.co
- Gradio: https://gradio.app
- Qwen2.5-7B-Instruct: https://huggingface.co/Qwen/Qwen2.5-7B-Instruct

### Key Libraries
- @gradio/client: Gradio JavaScript client
- @supabase/ssr: Supabase server-side rendering utilities
- framer-motion: Animation library for React
- canvas-confetti: Celebration animation library
- lucide-react: Icon library

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Status:** Initial Report

