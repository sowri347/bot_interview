# app/config.py
from typing import List, Optional, Union
from pydantic_settings import BaseSettings
import json

class Settings(BaseSettings):
    # required
    DATABASE_URL: str
    JWT_SECRET: str
    WHISPER_API_KEY: str
    GEMINI_API_KEY: str

    # CORS can be provided as:
    #  - comma separated string: "http://localhost:5173,https://example.com"
    #  - JSON array string: '["http://localhost:5173", "https://example.com"]'
    #  - actual list (when set programmatically)
    CORS_ORIGINS: Optional[Union[str, List[str]]] = "*"

    # optional extras
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        env_file = ".env"
        # ignore any extra environment vars instead of failing
        extra = "ignore"

    def cors_origins(self) -> List[str]:
        """
        Normalize CORS_ORIGINS to a list of origins.
        Returns ["*"] if wildcard or empty.
        """
        v = self.CORS_ORIGINS
        # if already a list, return it
        if isinstance(v, list):
            return v

        # if string
        if isinstance(v, str):
            s = v.strip()
            # wildcard or empty -> allow all
            if s == "" or s == "*" or s.lower() == "any":
                return ["*"]

            # Try parse JSON array
            try:
                parsed = json.loads(s)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed if str(x).strip()]
            except Exception:
                pass

            # fallback: comma-separated
            return [part.strip() for part in s.split(",") if part.strip()]

        # default empty list
        return []

# instantiate (reads .env automatically)
settings = Settings()
