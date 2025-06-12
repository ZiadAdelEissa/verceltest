import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateQR = async (data) => {
  try {
    const fileName = `qr-${Date.now()}.png`;
    const filePath = path.join(__dirname, '../uploads', fileName);
    
    await QRCode.toFile(filePath, data, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    return `/imgs/${fileName}`;
  } catch (error) {
    throw new Error('QR generation failed');
  }
};