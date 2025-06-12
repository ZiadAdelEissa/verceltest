export default function QRCodeModal({ qrCodeUrl, packageName, onClose }) {
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Package: {packageName}</h3>
          {qrCodeUrl && (
         <img 
         src={qrCodeUrl} 
         alt={`QR Code for ${packageName}`}
         className="w-full h-auto mb-4"
         onError={(e) => {
           console.error('Error loading QR code image');
           e.target.style.display = 'none';
         }}
       />
        )}          <p className="mb-4 text-gray-600">Show this QR code to redeem your package</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }