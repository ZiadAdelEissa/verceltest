import Booking from '../Models/Booking.js';
import Package from '../Models/packge.js';
import Product from '../Models/Product.js';
import { generateQR } from '../utils/qrGenerator.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, packageId, products, bookingDate } = req.body;
    
    let totalPrice = 0;
    let itemsToReduce = [];
    
    // Calculate total price and prepare items to reduce
    if (packageId) {
      const packageItem = await Package.findById(packageId);
      if (!packageItem) {
        return res.status(404).json({ message: 'Package not found' });
      }
      totalPrice += packageItem.price;
      itemsToReduce = packageItem.includes.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
    }
    
    if (products && products.length > 0) {
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }
        totalPrice += product.price * item.quantity;
        itemsToReduce.push(item);
      }
    }
    
    // Generate QR code
    const qrData = JSON.stringify({
      userId,
      items: itemsToReduce,
      bookingDate
    });
    
    const qrCodePath = await generateQR(qrData);
    
    // Create booking
    const booking = new Booking({
      userId,
      packageId,
      products,
      bookingDate,
      totalPrice,
      qrCode: qrCodePath,
      status: 'pending'
    });
    
    await booking.save();
    
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId packageId products.productId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('userId packageId products.productId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const booking = await Booking.findByIdAndUpdate(id, updates, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scan QR code and reduce items
export const scanQR = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Reduce items from package
    if (booking.packageId) {
      const packageItem = await Package.findById(booking.packageId);
      for (const item of packageItem.includes) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }
    
    // Reduce individual products
    for (const item of booking.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Update booking status
    booking.status = 'completed';
    await booking.save();
    
    res.status(200).json({ message: 'QR scanned successfully. Items reduced and booking completed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};