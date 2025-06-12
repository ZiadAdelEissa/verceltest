import { useState, useEffect } from 'react';
import { getPackages, createBooking } from '../../Api/carwashapi.js';
import AnimatedButton from '../../AnimationButton/AnimatedButton.jsx';
import QRCodeModal from '../../QRCodeModal/QRCodeModal.jsx';
import { useAuth } from '../../AuthContext/AuthContext.jsx';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner.jsx';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { user } = useAuth();
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);
  

  const handlePurchase = async (packageId) => {
    try {
      const response = await createBooking({
        userId: user._id,
        packageId,
        bookingDate: new Date()
      });
      setQrCodeUrl(response.data.booking.qrCode);
      setSelectedPackage(packages.find(p => p._id === packageId));
      setShowQRModal(true);
    } catch (error) {
      console.error('Error purchasing package:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      ref={sectionRef}
      className="container mx-auto px-4 py-8  translate-y-6 transition duration-500"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Our Packages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {pkg.image && (
              <img 
                src={pkg.image} 
                alt={pkg.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Includes:</h4>
                <ul className="list-disc pl-5">
                  {pkg.includes.map((item, index) => (
                    <li key={index}>{item.productId?.name} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${pkg.price}</span>
                <AnimatedButton onClick={() => handlePurchase(pkg._id)}>
                  Purchase
                </AnimatedButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showQRModal && selectedPackage && (
        <QRCodeModal 
          qrCodeUrl={qrCodeUrl}
          packageName={selectedPackage.name}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}