import Package from '../Models/packge.js';
import multer from 'multer';

// Create a new package
export const createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, includes } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const parsedIncludes = JSON.parse(includes);
    
    const packageItem = new Package({
      name,
      description,
      price,
      duration,
      includes: parsedIncludes,
      image
    });
    
    await packageItem.save();
    
    res.status(201).json({ message: 'Package created successfully', package: packageItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all packages
export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('includes.productId');
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get package by ID
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const packageItem = await Package.findById(id).populate('includes.productId');
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(packageItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update package
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }
    
    if (updates.includes) {
      updates.includes = JSON.parse(updates.includes);
    }
    
    const packageItem = await Package.findByIdAndUpdate(id, updates, { new: true });
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ message: 'Package updated successfully', package: packageItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageItem = await Package.findByIdAndDelete(id);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};