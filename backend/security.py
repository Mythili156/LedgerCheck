from cryptography.fernet import Fernet
import os
import base64

# Generate a key if not exists (In production, load strictly from env)
# We handle the case where env might be missing by generating one (but warn in logs)
ENV_KEY = os.getenv("ENCRYPTION_KEY")

if not ENV_KEY:
    # Generate a temporary key for this session or fallback
    # In a real app, this MUST be persistent
    key = Fernet.generate_key()
    print(f"WARNING: ENCRYPTION_KEY not set. Using generated key: {key.decode()}")
    print("Add this to your .env file to persist data access!")
else:
    key = ENV_KEY.encode() if isinstance(ENV_KEY, str) else ENV_KEY

cipher_suite = Fernet(key)

def encrypt_data(data: str) -> str:
    """Encrypts a string and returns a base64 encoded string."""
    if not data: return data
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    """Decrypts a base64 encoded string token."""
    if not token: return token
    try:
        return cipher_suite.decrypt(token.encode()).decode()
    except Exception as e:
        print(f"Decryption error: {e}")
        return "{}" # Return empty JSON compatible string on failure
