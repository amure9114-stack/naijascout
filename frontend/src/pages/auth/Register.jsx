import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Card = ({ children, className }) => <div className={`bg-black/20 border border-white/20 rounded-3xl p-6 w-full max-w-md ${className}`}>{children}</div>;
const Input = ({ className, ...props }) => <input className={`bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:border-green-500 focus:bg-white/15 w-full p-2 ${className}`} {...props} />;
const Select = ({ className, ...props }) => <select className={`bg-white/10 border border-white/30 rounded-xl text-white focus:border-green-500 focus:bg-white/15 w-full p-2 ${className}`} {...props} />;
const Button = ({ children, className, ...props }) => <button className={`bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 w-full p-2 ${className}`} {...props}>{children}</button>;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || "scout";
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".form-card", { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/auth/register`, {
        name,
        username,
        email,
        password,
        role,
      });
      navigate("/auth/login", { state: { role } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('/img/bg.jpg')` }}>
      <div className="bg-black/50 absolute inset-0" />
      <Card className="relative z-10 form-card">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          <Select value={role} onChange={(e) => setRole(e.target.value)} className="cursor-pointer" required>
           <option value="player">I'm a Player</option>
           <option value="scout">I'm a Scout, Agent, Club or Academy</option>
          </Select>

          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button type="submit">Register</Button>
        </form>
        <p className="text-white/60 text-center mt-4 text-sm">Already have an account? <Link to="/auth/login" className="text-green-500 hover:text-green-400">Login</Link></p>
      </Card>
    </div>
  );
}