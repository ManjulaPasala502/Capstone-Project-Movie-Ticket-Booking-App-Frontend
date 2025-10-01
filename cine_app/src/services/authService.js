import API from './api';

const login = (credentials) => API.post('/auth/login', credentials);
const register = (data) => API.post('/auth/signup', data);

export default { login, register };
