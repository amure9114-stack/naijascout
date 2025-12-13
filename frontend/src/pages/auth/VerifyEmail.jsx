import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

const Card = ({ children, className }) => <div className={`bg-black/20 border border-white/20 rounded-3xl p-6 w-full max-w-md ${className}`}>{children}</div>;
const Input = ({ className, ...props }) => <input className={`bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:border-green-500 focus:bg-white/15 w-full p-2 ${className}`} {...props} />;
const Button = ({ children, className, ...props }) => <button className={`bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 w-full p-2 ${className}`} {...props}>{children}</button>;

export default function VerifyEmail() {
  const [code, setCode] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".form-card", { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to verify code
    console.log("Verifying with code:", code);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.3.0&auto=format&fit=crop&w=1350&q=80')` }}>
      <div className="bg-black/50 absolute inset-0" />
      <Card className="relative z-10 form-card">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Verify Email</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter verification code" required />
          <Button type="submit">Verify</Button>
        </form>
        <p className="text-white/60 text-center mt-4 text-sm">Didn’t receive a code? <Link to="/auth/register" className="text-green-500 hover:text-green-400">Resend</Link></p>
      </Card>
    </div>
  );
}