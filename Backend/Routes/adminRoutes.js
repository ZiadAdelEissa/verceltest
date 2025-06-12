import express from 'express';
import { getUsers, getAllPackages } from '../Controller/adminController.js';

const router = express.Router();

// Admin-only routes
router.get('/users', getUsers);
router.get('/packages', getAllPackages);

export default router;