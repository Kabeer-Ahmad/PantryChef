---
title: PantryChef - AI Recipe Generator
emoji: 🥘
colorFrom: cyan
colorTo: blue
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: apache-2.0
---

# 🥘 PantryChef - AI Recipe Generator

Generate delicious, personalized recipes from the ingredients you have in your pantry!

## Features

- 🎯 **Smart Recipe Generation**: Uses advanced AI to create recipes from available ingredients
- 🥗 **Dietary Preferences**: Respects vegetarian, vegan, keto, and other dietary restrictions
- 🚫 **Allergy Awareness**: Strictly avoids allergens you specify
- 🌍 **Cuisine Styles**: Prefers your favorite cuisine styles (Italian, Asian, Mexican, etc.)
- 📋 **Structured Output**: Returns recipes in a clear, organized format with ingredients and step-by-step instructions

## How to Use

1. **Enter Ingredients**: List the ingredients you have available (comma-separated)
2. **Set Preferences** (Optional):
   - Dietary Preferences: e.g., "Vegetarian", "Vegan", "Keto"
   - Allergies: e.g., "Nuts", "Shellfish", "Dairy" (these will be strictly avoided)
   - Favorite Cuisines: e.g., "Italian", "Asian", "Mexican"
3. **Generate**: Click "Generate Recipe" and wait for your custom recipe!

## Model

This Space uses **Qwen2.5 7B Instruct** by default, an excellent instruction-following model that:
- ✅ Requires no approval or authentication
- ✅ Excellent at following complex instructions
- ✅ Great at generating structured JSON outputs
- ✅ Creative recipe generation
- ✅ Understanding dietary constraints

**Alternative Models** (set via `HF_MODEL_NAME` environment variable):
- `meta-llama/Llama-3.1-8B-Instruct` - Best quality (requires approval)
- `mistralai/Mistral-7B-Instruct-v0.2` - Good alternative
- `microsoft/Phi-3-mini-4k-instruct` - Fast and small

## Example Inputs

- `Chicken, Rice, Tomatoes, Onions, Garlic` → Generates a complete chicken and rice dish
- `Eggs, Flour, Milk, Butter, Sugar` → Creates a baking recipe
- `Tofu, Broccoli, Carrots, Soy Sauce, Ginger` → Asian-inspired vegetarian dish

## Output Format

Each generated recipe includes:
- **Title**: Creative, descriptive recipe name
- **Description**: Brief overview of the dish
- **Ingredients**: Complete list with quantities
- **Instructions**: Step-by-step cooking instructions
- **Prep Time**: Estimated preparation time

## Technical Details

- **Framework**: Gradio
- **Model**: meta-llama/Llama-3.1-8B-Instruct
- **Hardware**: GPU recommended for faster inference
- **Output Format**: JSON with structured recipe data

## License

Apache 2.0

---

Made with ❤️ for food lovers who want to make the most of their pantry!

