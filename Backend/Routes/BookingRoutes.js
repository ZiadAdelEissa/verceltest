import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  scanQR
} from '../Controller/BookingController.js';

const router = express.Router();

// Booking routes
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.post('/scan/:bookingId', scanQR);

export default router;