from .base import *
import os

DEBUG = False

allowed_hosts = os.getenv("DJANGO_ALLOWED_HOSTS", "")
ALLOWED_HOSTS = [host.strip() for host in allowed_hosts.split(",") if host.strip()]


INTERNAL_IPS = []
CORS_ALLOW_ALL_ORIGINS = True  
CORS_ALLOW_CREDENTIALS = True
# CORS — restrict origins strictly in production
# cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
# CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]


CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'accept',
    'x-requested-with',
    'x-csrftoken',
    'x-requested-by',
]





AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {  
            'class': 'logging.StreamHandler',
        },
    },
    'root': {  
        'handlers': ['console'],
        'level': 'INFO',  
    },
}
