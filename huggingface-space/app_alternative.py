"""
Alternative version using Qwen2.5 7B Instruct (no approval needed)
Replace app.py with this if you want immediate deployment without Meta approval
"""

import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json
import re

# Use Qwen2.5 7B Instruct - no approval needed
MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"

print("Loading model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16,
    device_map="auto",
    trust_remote_code=True
)
print("Model loaded successfully!")

def extract_json(text: str) -> dict:
    """Extract JSON from model response"""
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            cleaned = json_match.group(0)
            cleaned = re.sub(r',(\s*[}\]])', r'\1', cleaned)
            try:
                return json.loads(cleaned)
            except:
                pass
    return None

def generate_recipe(
    ingredients: str,
    dietary_prefs: str = "None",
    allergies: str = "None",
    favorite_cuisines: str = "Any"
) -> str:
    """Generate a recipe from ingredients"""
    
    if not ingredients or not ingredients.strip():
        return "❌ Please provide at least one ingredient."
    
    ingredient_list = [ing.strip() for ing in ingredients.split(',') if ing.strip()]
    
    if not ingredient_list:
        return "❌ Please provide valid ingredients separated by commas."
    
    prompt = f"""You are an expert chef. Create a recipe using these ingredients: {', '.join(ingredient_list)}.

Requirements:
- Use only provided ingredients (can add salt, pepper, oil, water)
- {"AVOID: " + allergies if allergies and allergies.lower() != "none" else "No allergies"}
- {"Dietary: " + dietary_prefs if dietary_prefs and dietary_prefs.lower() != "none" else "No restrictions"}
- {"Cuisine: " + favorite_cuisines if favorite_cuisines and favorite_cuisines.lower() != "any" else "Any cuisine"}

Return ONLY this JSON format (no other text):
{{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": ["ingredient 1 with quantity", "ingredient 2"],
  "instructions": ["Step 1", "Step 2"],
  "prep_time": "time in minutes"
}}"""

    # Format for Qwen2.5
    messages = [
        {"role": "system", "content": "You are a helpful chef assistant that outputs JSON recipes."},
        {"role": "user", "content": prompt}
    ]
    
    input_ids = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        return_tensors="pt"
    ).to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            max_new_tokens=1500,
            temperature=0.8,
            top_p=0.9,
            repetition_penalty=1.1,
            do_sample=True,
        )
    
    response = tokenizer.decode(outputs[0][input_ids.shape[1]:], skip_special_tokens=True)
    recipe_data = extract_json(response)
    
    if not recipe_data:
        return f"❌ Failed to generate valid recipe.\n\nResponse: {response[:500]}"
    
    required_fields = ["title", "description", "ingredients", "instructions", "prep_time"]
    missing_fields = [field for field in required_fields if field not in recipe_data]
    
    if missing_fields:
        return f"❌ Missing fields: {', '.join(missing_fields)}\n\nResponse: {response[:500]}"
    
    output = f"""# {recipe_data['title']}

**{recipe_data['description']}**

⏱️ **Prep Time:** {recipe_data['prep_time']}

## Ingredients
"""
    for ingredient in recipe_data['ingredients']:
        output += f"- {ingredient}\n"
    
    output += "\n## Instructions\n"
    for i, instruction in enumerate(recipe_data['instructions'], 1):
        output += f"{i}. {instruction}\n"
    
    output += f"\n---\n\n**JSON:**\n```json\n{json.dumps(recipe_data, indent=2)}\n```"
    
    return output

with gr.Blocks(title="PantryChef - AI Recipe Generator", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🥘 PantryChef - AI Recipe Generator
    
    Generate delicious recipes from your pantry ingredients!
    """)
    
    with gr.Row():
        with gr.Column(scale=2):
            ingredients_input = gr.Textbox(
                label="Available Ingredients",
                placeholder="e.g., Chicken, Rice, Tomatoes, Onions, Garlic",
                lines=3
            )
            
            with gr.Row():
                dietary_prefs_input = gr.Textbox(
                    label="Dietary Preferences",
                    placeholder="e.g., Vegetarian, Vegan",
                    value="None"
                )
                allergies_input = gr.Textbox(
                    label="Allergies",
                    placeholder="e.g., Nuts, Shellfish",
                    value="None"
                )
            
            favorite_cuisines_input = gr.Textbox(
                label="Favorite Cuisines",
                placeholder="e.g., Italian, Asian",
                value="Any"
            )
            
            generate_btn = gr.Button("Generate Recipe 🍳", variant="primary", size="lg")
        
        with gr.Column(scale=3):
            output = gr.Markdown(label="Generated Recipe")
    
    generate_btn.click(
        fn=generate_recipe,
        inputs=[ingredients_input, dietary_prefs_input, allergies_input, favorite_cuisines_input],
        outputs=output
    )

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)

