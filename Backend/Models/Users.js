import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  vehicles: [{
    make: String,
    model: String,
    year: Number,
    licensePlate: String,
  }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;