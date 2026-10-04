import os
import requests
import configparser
from pathlib import Path


def get_access_token():
    # Prefer environment variables (populated from .env via Docker env_file or shell)
    client_id = os.environ.get("SAT_CLIENT_ID")
    client_secret = os.environ.get("SAT_CLIENT_SECRET")

    if not client_id or not client_secret:
        # Fall back to creds.ini relative to this file (local dev)
        config = configparser.ConfigParser()
        config.read(str(Path(__file__).parent / "creds.ini"))
        client_id = config.get("llm", "sat_client_id", fallback=None)
        client_secret = config.get("llm", "sat_client_secret", fallback=None)

    if not client_id or not client_secret:
        print(
            "✗ No SAT credentials found (set SAT_CLIENT_ID / SAT_CLIENT_SECRET in .env or creds.ini)"
        )
        return None

    url = "https://sat-prod.codebig2.net/v2/oauth/token?"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Client-Id": client_id,
        "X-Client-Secret": client_secret,
    }

    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        token_data = response.json()
        access_token = token_data.get("access_token")
        if access_token:
            print("✓ Access token retrieved successfully")
            return access_token
        else:
            print("✗ No access_token in response")
            print(f"Response: {token_data}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"✗ Error making request: {e}")
        return None


if __name__ == "__main__":
    token = get_access_token()
    if token:
        print(f"\nAccess Token: {token}")
    else:
        print("\nFailed to retrieve access token")
