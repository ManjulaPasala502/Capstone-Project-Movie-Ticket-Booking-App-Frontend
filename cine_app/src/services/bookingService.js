import API from './api';

export const bookTickets = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await API.get('/bookings/my');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await API.delete(`/bookings/${bookingId}`);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await API.get('/bookings'); // Admin only
  return response.data;
};
