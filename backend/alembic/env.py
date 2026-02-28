"""
Alembic env.py – customised for the Intara platform.

Key customisations:
1. DATABASE_URL is read from app.core.config.settings (not hardcoded).
2. Base.metadata is imported from app.db.models so autogenerate works.
3. pgvector.sqlalchemy is imported so Alembic recognises Vector columns.
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# ── pgvector support ─────────────────────────────────────────────────────
# Must be imported BEFORE Alembic inspects model metadata, otherwise the
# Vector column type in DocumentChunk.embedding is silently skipped.
import pgvector.sqlalchemy  # noqa: F401

# ── App config & models ──────────────────────────────────────────────────
from app.core.config import settings

# Importing models ensures every table is registered on Base.metadata.
from app.db.models import Base  # noqa: F401 – triggers all model imports

# ── Alembic Config object ───────────────────────────────────────────────
config = context.config

# Override sqlalchemy.url dynamically so credentials stay in .env / env vars
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Tell Alembic which metadata to diff against
target_metadata = Base.metadata


# ── Offline migrations ───────────────────────────────────────────────────
def run_migrations_offline() -> None:
    """Emit SQL scripts without a live database connection."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# ── Online migrations ────────────────────────────────────────────────────
def run_migrations_online() -> None:
    """Run migrations against a live database."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
