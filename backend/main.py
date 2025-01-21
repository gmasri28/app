from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import uuid4
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Task as TaskModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Permitir origen del frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)


# Modelos Pydantic
class Task(BaseModel):
    id: str
    title: str
    description: Optional[str]
    completed: bool

    class Config:
        orm_mode = True

class TaskInput(BaseModel):
    title: str = Field(..., max_length=100)
    description: Optional[str] = None
    completed: bool = False

class UpdateTaskStatus(BaseModel):
    completed: bool

# Dependencia para la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rutas
@app.get("/tasks", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(TaskModel).all()
    return tasks

@app.post("/tasks", response_model=Task)
def create_task(task_input: TaskInput, db: Session = Depends(get_db)):
    db_task = TaskModel(
        id=str(uuid4()),  # Genera un ID único automáticamente
        title=task_input.title,
        description=task_input.description,
        completed=task_input.completed,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/{id}", response_model=Task)
def get_task(id: str, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return task

@app.put("/tasks/{id}", response_model=Task)
def update_task_status(id: str, status_update: UpdateTaskStatus, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    task.completed = status_update.completed
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{id}", response_model=Task)
def delete_task(id: str, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    db.delete(task)
    db.commit()
    return task

@app.get("/")
def root():
    return {"message": "APIPP funcionando"}
