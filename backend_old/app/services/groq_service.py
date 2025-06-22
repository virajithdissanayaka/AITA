import os
import time
from groq import Groq
from typing import Optional

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        # self.api_key = os.getenv("GROQ_API_KEY", "your_api_key_here")  # Use a default for local testing
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.client = Groq(api_key=self.api_key)
        # Updated to use a currently supported production model
        self.model = "llama-3.3-70b-versatile"
        
    def create_system_prompt(self, question_type: str = "general") -> str:
        """Create a system prompt based on the question type"""
        base_prompt = """You are AITA (AI Terminal Companion), an expert Linux system administrator and bash scripting assistant. 
You provide concise, accurate, and practical help for Linux/Unix systems.

Guidelines:
- Keep responses concise but complete
- Provide working examples when possible
- Explain complex concepts clearly
- Focus on practical, real-world solutions
- Include safety warnings for potentially dangerous commands
- Use proper formatting for code blocks and commands
"""

        if "explain:" in question_type.lower():
            return base_prompt + "\nFocus on explaining shell commands, their options, and usage patterns."
        elif "script:" in question_type.lower():
            return base_prompt + "\nGenerate practical bash scripts with error handling and comments."
        elif "debug:" in question_type.lower():
            return base_prompt + "\nHelp diagnose and fix Linux/bash errors with step-by-step solutions."
        elif "man:" in question_type.lower():
            return base_prompt + "\nProvide concise summaries of man pages with most useful options."
        elif "install:" in question_type.lower():
            return base_prompt + "\nGuide through package installation for various Linux distributions."
        elif "security:" in question_type.lower():
            return base_prompt + "\nProvide security hardening advice and best practices."
        else:
            return base_prompt + "\nAnswer general Linux/bash questions with practical guidance."

    async def ask_ai(self, question: str) -> tuple[str, float]:
        """Send question to Groq API and return response with processing time"""
        start_time = time.time()
        
        try:
            system_prompt = self.create_system_prompt(question)
            
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=1024,
                top_p=0.8,
                stream=False
            )
            
            processing_time = time.time() - start_time
            response = completion.choices[0].message.content.strip()
            
            return response, processing_time
            
        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = f"AI service error: {str(e)}"
            return error_msg, processing_time

    def check_connection(self) -> bool:
        """Check if Groq API is accessible"""
        try:
            # Simple test request
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": "test"}],
                model=self.model,
                max_tokens=1
            )
            return True
        except Exception:
            return False