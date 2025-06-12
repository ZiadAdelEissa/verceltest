import AnimatedButton from '../AnimationButton/AnimatedButton.jsx';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';

export default function Home() {
  const sectionRef = useScrollAnimation();

  return (
    <div 
      ref={sectionRef}
      className="text-center py-12 opacity-0 translate-y-6 transition duration-500"
    >
      <h1 className="text-4xl font-bold mb-6">Welcome to CarWash Pro</h1>
      <p className="text-xl mb-8">Book your car wash service with ease</p>
      <AnimatedButton>Get Started</AnimatedButton>
    </div>
  );
}