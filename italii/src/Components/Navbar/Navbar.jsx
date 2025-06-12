import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">CarWash Pro</Link>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>
              )}
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="hover:text-blue-200 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}