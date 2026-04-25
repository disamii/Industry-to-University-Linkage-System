from .base import *
import os


DEBUG = os.getenv("DJANGO_DEBUG", "True").lower() in ("true", "1", "yes")


ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS",
                          "localhost,127.0.0.1").split(",")


INSTALLED_APPS += [
    "debug_toolbar",
]

MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

INTERNAL_IPS = os.getenv("DJANGO_INTERNAL_IPS", "127.0.0.1").split(",")


CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "accept",
    "x-requested-with",
    "x-csrftoken",
    "x-requested-by",
]
