from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Device Lifecycle Intelligence API"
    version: str = "1.0.0"

    # DLI LLM / SAT OAuth — these are passed to dli.py / generate_token.py
    sat_client_id: str = ""
    sat_client_secret: str = ""
    llm_model: str = ""
    openai_api_base: str = ""


settings = Settings()
