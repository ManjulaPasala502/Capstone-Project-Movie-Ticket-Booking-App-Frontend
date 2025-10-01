import API from './api';

export const getProfile = async () => {
  const response = await API.get('/users/me');
  return response.data;
};

export const getUserBookingsService = async () => {
  const response = await API.get('/users/bookings');
  return response.data;
};
