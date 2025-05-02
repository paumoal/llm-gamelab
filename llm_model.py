from openai import OpenAI
from openai import APIError
import ast

import time
from datetime import datetime, timezone

class LLMModel:
    def __init__(self, model_name: str, provider: str, api_key: str, base_url: str = None, system_prompt: str = "", max_retries: int = 3):
        self.model_name = model_name
        self.provider = provider.lower()
        self.api_key = api_key
        self.base_url = base_url
        self.system_prompt = system_prompt
        self.max_retries = max_retries
        self.client = self._initialize_client()
        self.history = []

    def _initialize_client(self):
        client_config = {
            "api_key": self.api_key
        }
        
        if self.provider == "openrouter":
            client_config["base_url"] = self.base_url or "https://openrouter.ai/api/v1"
        
        return OpenAI(**client_config)
    
    def call_model(self, messages: list):
        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                )
                
                result = response.choices[0].message.content
                
                messages.append({"role": "assistant", "content": result})

                self._update_history(messages, result)
                
                return result, messages
            
            except APIError as e:
                if attempt == self.max_retries - 1:
                    raise RuntimeError(f"Error after {self.max_retries} attempts: {str(e)}")
                time.sleep(2 ** attempt)  # Backoff exponencial

        return None, messages
    
    def validate_response_format(self, response: str) -> bool:
        try:
            parsed = ast.literal_eval(response)
            if not isinstance(parsed, list):
                return False
            return all(
                isinstance(item, str) and item.isdigit() if idx > 0 else isinstance(item, str)
                for idx, item in enumerate(parsed))
        except (SyntaxError, ValueError):
            return False
        
    def translate_response(self, raw_response: str, expected_format: str) -> list:
        messages = [
            {
                "role": "system",
                "content": f"""Please I need the answer in this format, I will give you a text where I need only that information in the format to use in Python dict:
                    {{
                        "move": "MOVE OR STEP with this format {expected_format} - list format in python",
                        "reason": "Explain why you move/select or step this position for the game."
                    }}
                    Don't use anything style or word to indicate format as ```json ```, ```python ``` or other style.
                    Don't write additional explanation outside the "reason", all write inside the "reason".
                    Verify if M and N are numbers, but you return as String. If not, you need say that.
                    """,
            },
            {
                "role": "user",
                "content": raw_response
            }
        ]
        
        translated, _ = self.call_model(messages)
        return translated

    def _update_history(self, messages: list, response: str):
        self.history.append({
            "timestamp": datetime.now(timezone.utc),
            "input": messages,
            "output": response,
            "model": self.model_name,
            "provider": self.provider
        })

    def get_model(self):
        return self.model_name

    def get_history(self):
        return self.history

    def __repr__(self):
        return f"<LLMModel: {self.provider}/{self.model_name}>"
