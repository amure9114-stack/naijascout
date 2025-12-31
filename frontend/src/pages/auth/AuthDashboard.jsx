import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiLocationArrow } from "react-icons/ti";
import Button from "../../components/Button";

const AuthDashboard = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: "player",
      title: "Player",
      description: "Build your pro profile & get discovered by scouts worldwide",
      icon: "⚽",
      gradient: "from-green-600 to-emerald-700",
      hoverGradient: "from-green-500 to-emerald-600",
      borderActive: "border-green-400 shadow-green-500/50",
    },
    {
      id: "scout",
      title: "Scout • Agent • Club • Academy",
      description: "Find, evaluate & unlock the next generation of talent",
      icon: "🔍",
      gradient: "from-purple-600 to-indigo-700",
      hoverGradient: "from-purple-500 to-indigo-600",
      borderActive: "border-purple-400 shadow-purple-500/50",
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Save to localStorage immediately for seamless flow
    localStorage.setItem("userRole", role.id);
  };

  const handleAuthNavigation = (type) => {
    if (!selectedRole) return;

    const target = type === "login" ? "/auth/login" : "/auth/register";
    navigate(target, {
      state: { role: selectedRole.id },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]" />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="special-font text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Choose Your <span className="text-white">Role</span>
          </h1>
          <p className="text-green-100/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Join the future of African football talent discovery — whether you're a rising star or a global scout.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              className={`relative group cursor-pointer rounded-3xl p-8 border-2 transition-all duration-500 transform hover:scale-105
                ${selectedRole?.id === role.id
                  ? `border-white bg-gradient-to-br ${role.gradient} shadow-2xl ${role.borderActive}`
                  : "border-white/20 bg-white/5 backdrop-blur-xl hover:border-white/50 hover:bg-white/10"
                }`}
            >
              {/* Glass overlay effect */}
              <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-start gap-6">
                <div className={`text-6xl p-4 rounded-2xl bg-gradient-to-br ${role.gradient} shadow-2xl transform transition-transform duration-500 group-hover:scale-110`}>
                  {role.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                    {role.title}
                  </h3>
                  <p className="text-green-100/90 text-base leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedRole?.id === role.id && (
                <div className="absolute -top-3 -right-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${role.gradient}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            title="Continue"
            leftIcon={<TiLocationArrow className="text-xl" />}
            onClick={() => handleAuthNavigation("login")}
            disabled={!selectedRole}
            containerClass={`w-full sm:w-auto px-12 py-5 text-lg font-semibold rounded-2xl transition-all duration-300
              ${!selectedRole
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-xl hover:shadow-green-500/50 transform hover:scale-105"
              }`}
          />

          <Button
            title="Register Now"
            leftIcon={<TiLocationArrow className="text-xl" />}
            onClick={() => handleAuthNavigation("register")}
            disabled={!selectedRole}
            containerClass={`w-full sm:w-auto px-12 py-5 text-lg font-semibold rounded-2xl border-2 transition-all duration-300
              ${!selectedRole
                ? "border-gray-600 text-gray-400 cursor-not-allowed"
                : "border-green-500 text-green-400 hover:bg-green-500/20 hover:text-white shadow-xl hover:shadow-green-500/30 transform hover:scale-105"
              }`}
          />
        </div>

        {/* Footer note */}
        <p className="text-center mt-12 text-green-200/60 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate('/auth/login')}
            className="underline hover:text-green-400 transition-colors"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthDashboard;