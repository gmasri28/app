from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://todo_db_uemr_user:xrQUNwaYFHnPJhlJUfPHqOS5gNJbiI2k@dpg-cu7j19lds78s73asgjvg-a.oregon-postgres.render.com/todo_db_uemr"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
