import express from 'express';
import {
  register,
  login,
  updateUser,
  deleteUser
} from '../Controller/authController.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;