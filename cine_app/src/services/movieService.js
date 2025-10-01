import API from './api';

export const fetchMovies = async () => {
  const response = await API.get('/movies');
  return response.data; // This includes { success: true, data: [...] }
};

export const getMovieById = async (id) => {
  const response = await API.get(`/movies/${id}`);
  return response.data; // { success: true, data: movie }
};
