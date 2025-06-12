export default function AnimatedButton({ children, className = '', ...props }) {
    return (
      <button
        className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-all hover:shadow-md ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }