from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here for Alembic auto-generation
from app.models.user import User  # noqa
