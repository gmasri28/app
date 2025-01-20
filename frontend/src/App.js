import React, { useEffect, useState } from 'react';
import api from './api';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });

    // Obtener tareas del backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/tasks'); // Petición al backend
                setTasks(response.data); // Guardar tareas en el estado
            } catch (error) {
                console.error('Error al obtener tareas:', error);
            }
        };

        fetchTasks();
    }, []);

    // Crear nueva tarea
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/tasks', {
                title: newTask.title,
                description: newTask.description,
            });
            setTasks([...tasks, response.data]); // Agregar la nueva tarea al estado
            setNewTask({ title: '', description: '' }); // Limpiar el formulario
        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
    };

    // Marcar tarea como completada/no completada
    const handleToggleComplete = async (id, completed) => {
        try {
            const response = await api.put(`/tasks/${id}`, { completed: !completed });
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: response.data.completed } : task
                )
            );
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
    };

    // Eliminar tarea
    const handleDeleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`); // Petición DELETE al backend
            setTasks(tasks.filter((task) => task.id !== id)); // Eliminar la tarea del estado
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    };

    return (
        <div className="App">
            <div className="container mx-auto px-4 py-8 max-w-screen-md">
                <h1 className="text-3xl font-bold text-center mb-6">Lista de Tareas</h1>

                {/* Formulario para crear tareas */}
                <form onSubmit={handleCreateTask} className="mb-6 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Crear Tarea
                    </button>
                </form>

                {/* Lista de tareas */}
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="p-4 border rounded shadow flex flex-col space-y-2 bg-white"
                        >
                            <p className="font-semibold text-lg">{task.title}</p>
                            <p className="text-gray-500">{task.description}</p>
                            <p
                                className={`text-sm font-bold ${
                                    task.completed ? 'text-green-500' : 'text-red-500'
                                }`}
                            >
                                {task.completed ? 'Completada' : 'Pendiente'}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleComplete(task.id, task.completed)}
                                    className={`py-2 px-4 rounded ${
                                        task.completed
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-gray-500 hover:bg-gray-600'
                                    } text-white transition`}
                                >
                                    {task.completed ? 'Marcar como Pendiente' : 'Marcar como Completada'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
