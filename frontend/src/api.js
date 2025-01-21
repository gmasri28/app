import axios from 'axios';

const api = axios.create({
    baseURL: 'https://todo-backend-h74j.onrender.com/', // URL de tu backend
});

export default api;
