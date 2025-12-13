import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import {
  FaArrowLeft,
  FaUser,
  FaCalendar,
  FaChartLine,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaFlag,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaEye
} from "react-icons/fa";

// Simple utility function to replace cn
const cn = (...classes) => classes.filter(Boolean).join(' ');

const InjuryManagement = () => {
  const { playerId } = useParams();

  // Mock player data - in real app, this would come from API
  const mockPlayer = {
    id: playerId || "1",
    name: "Kelechi Iheanacho",
    position: "Forward",
    age: 27,
    club: "Leicester City FC",
    nationality: "Nigerian",
    avatar: "/placeholder.svg"
  };

  const [injuries, setInjuries] = useState([
    {
      id: "1",
      playerId: mockPlayer.id,
      playerName: mockPlayer.name,
      injuryType: "Hamstring Strain",
      severity: "moderate",
      status: "recovering",
      dateInjured: "2024-01-15",
      expectedRecovery: "2024-02-28",
      description: "Grade 2 hamstring strain sustained during sprint in training session",
      bodyPart: "Thigh"
    },
    {
      id: "2",
      playerId: mockPlayer.id,
      playerName: mockPlayer.name,
      injuryType: "Ankle Sprain",
      severity: "mild",
      status: "recovered",
      dateInjured: "2023-11-20",
      expectedRecovery: "2023-12-15",
      description: "Minor ankle sprain from awkward landing after header",
      bodyPart: "Ankle"
    },
    {
      id: "3",
      playerId: mockPlayer.id,
      playerName: mockPlayer.name,
      injuryType: "Muscle Tear",
      severity: "severe",
      status: "recovered",
      dateInjured: "2023-08-10",
      expectedRecovery: "2023-10-30",
      description: "Quadriceps tear requiring surgery and extended rehabilitation",
      bodyPart: "Thigh"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    playerId: "",
    playerName: "",
    injuryType: "",
    severity: "mild",
    status: "active",
    dateInjured: "",
    expectedRecovery: "",
    description: "",
    bodyPart: ""
  });

  const handleAddInjury = (e) => {
    e.preventDefault();
    const newInjury = {
      ...formData,
      id: Date.now().toString(),
      playerId: mockPlayer.id,
      playerName: mockPlayer.name
    };
    setInjuries(prev => [newInjury, ...prev]);
    setFormData({
      playerId: "",
      playerName: "",
      injuryType: "",
      severity: "mild",
      status: "active",
      dateInjured: "",
      expectedRecovery: "",
      description: "",
      bodyPart: ""
    });
    setShowAddModal(false);
  };

  const activeInjuries = injuries.filter(injury => injury.status === "active");
  const recoveringInjuries = injuries.filter(injury => injury.status === "recovering");
  const totalRecoveryDays = injuries
    .filter(injury => injury.status === "recovered")
    .reduce((acc, injury) => {
      const injured = new Date(injury.dateInjured);
      const recovered = new Date(injury.expectedRecovery || injury.dateInjured);
      return acc + Math.ceil((recovered.getTime() - injured.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
  const avgRecoveryTime = injuries.filter(injury => injury.status === "recovered").length > 0
    ? Math.round(totalRecoveryDays / injuries.filter(injury => injury.status === "recovered").length)
    : 0;

  const severityConfig = {
    mild: {
      color: "bg-green-500 text-white",
      icon: "🟢",
      label: "Mild"
    },
    moderate: {
      color: "bg-yellow-500 text-white",
      icon: "🟡",
      label: "Moderate"
    },
    severe: {
      color: "bg-red-500 text-white",
      icon: "🔴",
      label: "Severe"
    }
  };

  const statusConfig = {
    active: {
      color: "bg-red-100 text-red-800",
      label: "Active"
    },
    recovering: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Recovering"
    },
    recovered: {
      color: "bg-green-100 text-green-800",
      label: "Recovered"
    }
  };

  const StatsCard = ({ title, value, description, icon: Icon, className }) => {
    return (
      <div className={cn("bg-black rounded-lg shadow-md border text-white border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-xs text-white mt-1">{description}</p>
        )}
      </div>
    );
  };

  const InjuryCard = ({ injury, onEdit, onView }) => {
    const severity = severityConfig[injury.severity];
    const status = statusConfig[injury.status];

    return (
      <div className="bg-black rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white">{injury.injuryType}</h3>
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", severity.color)}>
                {severity.icon} {severity.label}
              </span>
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", status.color)}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-white mb-2">{injury.bodyPart}</p>
            <p className="text-sm text-white">{injury.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onView(injury)}
              className="p-2 text-white hover:text-blue-600 transition-colors"
            >
              <FaEye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(injury)}
              className="p-2 text-white hover:text-green-600 transition-colors"
            >
              <FaEdit className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaCalendar className="h-3 w-3" />
              Injured: {new Date(injury.dateInjured).toLocaleDateString()}
            </span>
            {injury.expectedRecovery && (
              <span className="flex items-center gap-1">
                <FaClock className="h-3 w-3" />
                Expected: {new Date(injury.expectedRecovery).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AddInjuryModal = () => {
    const bodyParts = [
      "Head", "Neck", "Shoulder", "Upper Arm", "Elbow", "Forearm", "Wrist", "Hand",
      "Chest", "Back", "Lower Back", "Hip", "Thigh", "Knee", "Shin", "Calf", "Ankle", "Foot"
    ];

    const injuryTypes = [
      "Strain", "Sprain", "Fracture", "Dislocation", "Contusion", "Laceration",
      "Concussion", "Ligament Tear", "Muscle Tear", "Tendon Injury", "Other"
    ];

    return (
      <>
        <Button
          title="Add New Injury"
          leftIcon={<FaPlus className="h-4 w-4" />}
          containerClass="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        />

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Record New Injury</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddInjury} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player Name</label>
                    <input
                      type="text"
                      value={formData.playerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
                      placeholder="Enter player name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player ID</label>
                    <input
                      type="text"
                      value={formData.playerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, playerId: e.target.value }))}
                      placeholder="Enter player ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Injury Type</label>
                    <select
                      value={formData.injuryType}
                      onChange={(e) => setFormData(prev => ({ ...prev, injuryType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select injury type</option>
                      {injuryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Body Part</label>
                    <select
                      value={formData.bodyPart}
                      onChange={(e) => setFormData(prev => ({ ...prev, bodyPart: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select body part</option>
                      {bodyParts.map((part) => (
                        <option key={part} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="recovering">Recovering</option>
                      <option value="recovered">Recovered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Injured</label>
                    <input
                      type="date"
                      value={formData.dateInjured}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateInjured: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Recovery</label>
                    <input
                      type="date"
                      value={formData.expectedRecovery}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedRecovery: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the injury and circumstances..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    title="Add Injury"
                    containerClass="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddInjury(e);
                    }}
                  />
                  <Button
                    title="Cancel"
                    containerClass="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={() => setShowAddModal(false)}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gblack text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            {/* Back to Dashboard button removed */}
          </div>

          <div className="flex items-start gap-6">
            <div className="h-24 w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
              {mockPlayer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{mockPlayer.name}</h1>
              <div className="flex items-center gap-6 text-white text-opacity-90">
                <span className="flex items-center gap-2">
                  <FaUser className="h-4 w-4" />
                  {mockPlayer.position}
                </span>
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4" />
                  {mockPlayer.club}
                </span>
                <span className="flex items-center gap-2">
                  <FaFlag className="h-4 w-4" />
                  {mockPlayer.nationality}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Injuries"
            value={injuries.length}
            description="Career total"
            icon={FaExclamationTriangle}
            className="border-l-4 border-l-blue-600"
          />
          <StatsCard
            title="Active Injuries"
            value={activeInjuries.length}
            description="Currently active"
            icon={FaChartLine}
            className="border-l-4 border-l-red-600"
          />
          <StatsCard
            title="Recovering"
            value={recoveringInjuries.length}
            description="In rehabilitation"
            icon={FaArrowUp}
            className="border-l-4 border-l-yellow-600"
          />
          <StatsCard
            title="Avg Recovery"
            value={`${avgRecoveryTime}d`}
            description="Average recovery time"
            icon={FaClock}
            className="border-l-4 border-l-green-600"
          />
        </div>

        <hr className="mb-8 border-gray-600" />

        {/* Current Status */}
        {(activeInjuries.length > 0 || recoveringInjuries.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
              <FaChartLine className="h-6 w-6 text-blue-400" />
              Current Status
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...activeInjuries, ...recoveringInjuries].map((injury) => (
                <InjuryCard
                  key={injury.id}
                  injury={injury}
                  onView={(injury) => console.log("View injury:", injury)}
                  onEdit={(injury) => console.log("Edit injury:", injury)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Injury History */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
            <FaCalendar className="h-6 w-6 text-blue-400" />
            Injury History
          </h2>

          {injuries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
              <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Injury Records</h3>
              <p className="text-gray-600 mb-4">
                This player has a clean injury record so far.
              </p>
              <AddInjuryModal />
            </div>
          ) : (
            <div className="space-y-4">
              {injuries
                .sort((a, b) => new Date(b.dateInjured).getTime() - new Date(a.dateInjured).getTime())
                .map((injury) => (
                  <InjuryCard
                    key={injury.id}
                    injury={injury}
                    onView={(injury) => console.log("View injury:", injury)}
                    onEdit={(injury) => console.log("Edit injury:", injury)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InjuryManagement;