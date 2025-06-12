import express from 'express';

import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../Controller/packgeController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Package routes
router.post('/', upload.single('image'), createPackage);
router.get('/', getPackages);
router.get('/:id', getPackageById);
router.put('/:id', upload.single('image'), updatePackage);
router.delete('/:id', deletePackage);

export default router;