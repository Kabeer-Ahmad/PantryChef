import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json
import re
import os

# Fix OMP_NUM_THREADS warning
os.environ['OMP_NUM_THREADS'] = '1'

# Optional: Authenticate for gated models (like Llama)
# Uncomment if you want to use Llama 3.1 and have access
# from huggingface_hub import login
# token = os.getenv("HF_TOKEN")
# if token:
#     login(token=token)

# Load the model and tokenizer
# Using Qwen2.5 7B Instruct - no approval needed, excellent for structured outputs
# Alternative: "mistralai/Mistral-7B-Instruct-v0.2" or "microsoft/Phi-3-mini-4k-instruct"
# For Llama: "meta-llama/Llama-3.1-8B-Instruct" (requires approval + authentication)
MODEL_NAME = os.getenv("HF_MODEL_NAME", "Qwen/Qwen2.5-7B-Instruct")

print(f"Loading model and tokenizer: {MODEL_NAME}...")

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

# Fix pad_token if not set (important for Qwen models)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.pad_token_id = tokenizer.eos_token_id

# Load model
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    dtype=torch.float16,  # Use dtype instead of torch_dtype
    device_map="auto",
    trust_remote_code=True
)

print(f"Model {MODEL_NAME} loaded successfully!")

def extract_json(text: str) -> dict:
    """Extract JSON from model response"""
    # Try to find JSON object in the text
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group(0))
        except json.JSONDecodeError:
            # Try to fix common JSON issues
            cleaned = json_match.group(0)
            # Remove trailing commas
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
    
    # Parse ingredients
    ingredient_list = [ing.strip() for ing in ingredients.split(',') if ing.strip()]
    
    if not ingredient_list:
        return "❌ Please provide valid ingredients separated by commas."
    
    # Construct the prompt
    # Simplified prompt for better generation
    prompt = f"""Create a recipe using these ingredients: {', '.join(ingredient_list)}.

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

    # Format for Qwen2.5 chat template
    messages = [
        {"role": "system", "content": "You are a helpful chef assistant. Always respond with valid JSON only."},
        {"role": "user", "content": prompt}
    ]
    
    # Tokenize using chat template
    try:
        # Qwen2.5 uses apply_chat_template
        formatted_prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        
        # Tokenize the formatted prompt
        encoded = tokenizer(
            formatted_prompt,
            return_tensors="pt",
            padding=False,
            truncation=True,
            max_length=2048
        )
        input_ids = encoded.input_ids.to(model.device)
        attention_mask = encoded.attention_mask.to(model.device) if encoded.attention_mask is not None else None
        
    except Exception as e:
        print(f"Chat template failed, using direct prompt: {e}")
        # Fallback: use prompt directly
        encoded = tokenizer(
            prompt,
            return_tensors="pt",
            padding=False,
            truncation=True,
            max_length=2048
        )
        input_ids = encoded.input_ids.to(model.device)
        attention_mask = encoded.attention_mask.to(model.device) if encoded.attention_mask is not None else None
    
    # Create attention mask if not provided
    if attention_mask is None:
        attention_mask = (input_ids != tokenizer.pad_token_id).long().to(model.device)
    
    # Generate
    print(f"Generating recipe... Input length: {input_ids.shape[1]}")
    with torch.no_grad():
        try:
            outputs = model.generate(
                input_ids,
                attention_mask=attention_mask,
                max_new_tokens=1000,  # Reduced for faster generation
                temperature=0.7,  # Slightly lower for more focused output
                top_p=0.9,
                repetition_penalty=1.2,  # Increased to reduce repetition
                do_sample=True,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id,
            )
            print(f"Generation complete. Output length: {outputs[0].shape[0]}")
        except Exception as e:
            print(f"Generation error: {e}")
            import traceback
            traceback.print_exc()
            return f"❌ Error during generation: {str(e)}"
    
    # Decode - extract only the new tokens
    input_length = input_ids.shape[1]
    output_length = outputs[0].shape[0]
    
    print(f"Decoding response. Input: {input_length}, Output: {output_length}")
    
    if output_length > input_length:
        response = tokenizer.decode(outputs[0][input_length:], skip_special_tokens=True)
    else:
        # Fallback: decode entire output
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    print(f"Response length: {len(response)}")
    print(f"Response preview: {response[:200]}")
    
    # Debug: check if response is empty
    if not response or len(response.strip()) == 0:
        return f"❌ Empty response from model. Input length: {input_length}, Output length: {output_length}. Full output: {tokenizer.decode(outputs[0], skip_special_tokens=True)[:500]}"
    
    # Extract JSON
    recipe_data = extract_json(response)
    
    if not recipe_data:
        print(f"Failed to extract JSON. Full response: {response}")
        return f"❌ Failed to generate valid recipe JSON.\n\nRaw response (first 1000 chars):\n\n{response[:1000]}\n\nPlease try again."
    
    # Validate structure
    required_fields = ["title", "description", "ingredients", "instructions", "prep_time"]
    missing_fields = [field for field in required_fields if field not in recipe_data]
    
    if missing_fields:
        return f"❌ Generated recipe missing required fields: {', '.join(missing_fields)}\n\nResponse: {response[:500]}"
    
    # Format output
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
    
    output += f"\n---\n\n**JSON Output:**\n```json\n{json.dumps(recipe_data, indent=2)}\n```"
    
    return output

# Create Gradio interface
with gr.Blocks(title="PantryChef - AI Recipe Generator", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🥘 PantryChef - AI Recipe Generator
    
    Generate delicious recipes from the ingredients you have in your pantry!
    
    Simply enter your available ingredients, and our AI chef will create a custom recipe for you.
    """)
    
    with gr.Row():
        with gr.Column(scale=2):
            ingredients_input = gr.Textbox(
                label="Available Ingredients",
                placeholder="e.g., Chicken, Rice, Tomatoes, Onions, Garlic",
                lines=3,
                info="Enter ingredients separated by commas"
            )
            
            with gr.Row():
                dietary_prefs_input = gr.Textbox(
                    label="Dietary Preferences",
                    placeholder="e.g., Vegetarian, Vegan, Keto",
                    value="None"
                )
                allergies_input = gr.Textbox(
                    label="Allergies (MUST AVOID)",
                    placeholder="e.g., Nuts, Shellfish, Dairy",
                    value="None"
                )
            
            favorite_cuisines_input = gr.Textbox(
                label="Favorite Cuisines",
                placeholder="e.g., Italian, Asian, Mexican",
                value="Any"
            )
            
            generate_btn = gr.Button("Generate Recipe 🍳", variant="primary", size="lg")
        
        with gr.Column(scale=3):
            output = gr.Markdown(label="Generated Recipe")
    
    # Examples
    gr.Examples(
        examples=[
            ["Chicken, Rice, Tomatoes, Onions, Garlic", "None", "None", "Any"],
            ["Eggs, Flour, Milk, Butter, Sugar", "None", "Dairy", "Any"],
            ["Tofu, Broccoli, Carrots, Soy Sauce, Ginger", "Vegan", "None", "Asian"],
            ["Pasta, Olive Oil, Garlic, Basil, Tomatoes", "Vegetarian", "None", "Italian"],
        ],
        inputs=[ingredients_input, dietary_prefs_input, allergies_input, favorite_cuisines_input]
    )
    
    generate_btn.click(
        fn=generate_recipe,
        inputs=[ingredients_input, dietary_prefs_input, allergies_input, favorite_cuisines_input],
        outputs=output
    )
    
    gr.Markdown("""
    ---
    ### 💡 Tips
    - Be specific with your ingredients for better results
    - The AI may suggest common pantry staples (salt, pepper, oil) if needed
    - Allergies are strictly avoided in generated recipes
    - Dietary preferences help tailor the recipe to your needs
    """)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)

