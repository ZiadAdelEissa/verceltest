import { useState, useEffect } from "react";
import { getProducts } from "../../Api/carwashapi.js";
import AnimatedButton from "../../AnimationButton/AnimatedButton.jsx";
import { useScrollAnimation } from "../../hooks/useScrollAnimation.js";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useScrollAnimation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      ref={sectionRef}
      className="container mx-auto text-black px-4 py-8  translate-y-6 transition duration-500"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{product.price}$</span>
               <a href="/booking"> <AnimatedButton>Add to Booking</AnimatedButton></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
