from logging.config import fileConfig
import sys
from os import path

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# 1. First, tell Python to look in the /app folder
# This must happen BEFORE importing models or db
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

# 2. Now you can safely import your project files
try:
    from db import Base 
    import models  # This will now work because of the sys.path line above
    target_metadata = Base.metadata
except ImportError as e:
    print(f"Import Error: {e}")
    target_metadata = None
    
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata is now set above!

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()