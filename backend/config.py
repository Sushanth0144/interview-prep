import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///db.sqlite")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 15          # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7  # 7 days
    CORS_ORIGINS = ["http://localhost:4200"]
