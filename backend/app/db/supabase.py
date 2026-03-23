# app/db/supabase.py

import os
from supabase import create_client, Client

# Read from environment variables (from .env file)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate that the variables are actually set
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_KEY must be set in your .env file"
    )

# Create the Supabase client — this is your database connection
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper function — use this in your routers instead of importing supabase directly
# This makes it easy to swap databases later if needed
def get_db() -> Client:
    return supabase