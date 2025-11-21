# Authentication Setup for Gated Models

If you want to use **Llama 3.1 8B Instruct** (which requires approval), you need to set up authentication.

## Option 1: Using Hugging Face Token (Recommended for Spaces)

1. **Get your Hugging Face token:**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token with "Read" access
   - Copy the token

2. **Add token to Space:**
   - Go to your Space settings
   - Navigate to "Variables and secrets"
   - Add a new secret:
     - **Name**: `HF_TOKEN`
     - **Value**: Your token

3. **Update app.py to use token:**
   ```python
   from huggingface_hub import login
   import os
   
   # Login with token from environment
   token = os.getenv("HF_TOKEN")
   if token:
       login(token=token)
   ```

## Option 2: Using Environment Variable Locally

If testing locally:

```bash
export HF_TOKEN="your_token_here"
python app.py
```

## Option 3: Use Non-Gated Model (Easiest)

Just use the default `Qwen/Qwen2.5-7B-Instruct` - it works great and requires no authentication!

To switch back to Llama after getting approval:

1. Request access: https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
2. Wait for approval (1-2 days)
3. Set up authentication (Option 1 above)
4. Change `MODEL_NAME` in app.py to `"meta-llama/Llama-3.1-8B-Instruct"`

