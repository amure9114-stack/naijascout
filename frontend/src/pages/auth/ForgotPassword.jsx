import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

const Card = ({ children, className }) => <div className={`bg-black/20 border border-white/20 rounded-3xl p-6 w-full max-w-md ${className}`}>{children}</div>;
const Input = ({ className, ...props }) => <input className={`bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:border-green-500 focus:bg-white/15 w-full p-2 ${className}`} {...props} />;
const Button = ({ children, className, ...props }) => <button className={`bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 w-full p-2 ${className}`} {...props}>{children}</button>;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".form-card", { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to send reset link
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')` }}>
      <div className="bg-black/50 absolute inset-0" />
      <Card className="relative z-10 form-card">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          <Button type="submit">Send Reset Link</Button>
        </form>
        <p className="text-white/60 text-center mt-4"><Link to="/auth/login" className="text-green-500 hover:text-green-400">Back to Login</Link></p>
      </Card>
    </div>
  );
}