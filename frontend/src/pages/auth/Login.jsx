import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Card = ({ children, className }) => (
  <div className={`bg-black/20 border border-white/20 rounded-3xl p-6 w-full max-w-md ${className}`}>{children}</div>
);
const Input = ({ className, ...props }) => (
  <input
    className={`bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:border-green-500 focus:bg-white/15 w-full p-2 ${className}`}
    {...props}
  />
);
const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 w-full p-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || localStorage.getItem("userRole") || "scout";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".form-card", { opacity: 0, y: 50, duration: 1.2, ease: "power3.out" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
        role,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", role);
      if (role === "player") navigate("/player/dashboard");
      else if (role === "scout") navigate("/scout/profile");
      else navigate("/");
    } catch (err) {
      // Log full response body for developers and show the server message/reason when available
      console.error("Login error details:", err.response?.data || err.message || err);
      const serverData = err.response?.data;
      const userMessage = serverData?.message || serverData?.reason || "Login failed. Please try again.";
      setError(userMessage);
    }
  };

  const handleRegister = () => {
    navigate("/auth/register", { state: { role } });
  };

  const handleContinue = (e) => {
    e?.preventDefault();
    // Guest/dev flow only allowed in development builds
    if (!import.meta.env.DEV) {
      setError('Guest login is disabled in production. Please create an account or login.');
      return;
    }

    // Lightweight dev/guest flow: set a non-sensitive placeholder token
    // and the selected role so the app can navigate without calling the API.
    try {
      // In development we may store a lightweight role flag for quick navigation,
      // but we do not set any backdoor token here. Backend calls should still
      // use real authentication.
      localStorage.setItem('userRole', role);
    } catch (err) {
      // ignore localStorage errors
    }
    if (role === 'player') navigate('/player/dashboard');
    else if (role === 'scout') navigate('/scout/profile');
    else navigate('/');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url('/img/bg.jpg')`,
      }}
    >
      <div className="bg-black/50 absolute inset-0" />
      <Card className="relative z-10 form-card">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button type="submit">Login</Button>
        </form>
        <div className="text-center mt-4 space-y-2 text-sm text-white/60">
          <p>
            <Link to="/auth/forgot-password" className="text-green-500 hover:text-green-400">
              Forgot Password?
            </Link>
          </p>
          <p>
            No account?{' '}
            <button onClick={handleRegister} className="text-green-500 hover:text-green-400 underline">
              Register
            </button>
          </p>
          {/* Guest/dev shortcut removed for production safety. Use real accounts. */}
        </div>
      </Card>
    </div>
  );
}