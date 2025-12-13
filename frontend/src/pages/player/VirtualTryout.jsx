import React, { useState } from 'react';
import { 
  FaUser, 
  FaTrophy, 
  FaCrosshairs, 
  FaUpload, 
  FaPlay, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCalendar,
  FaClock,
  FaAward,
  FaCamera,
  FaCheckCircle,
  FaChevronDown
} from 'react-icons/fa';
import Button from "../../components/Button";

// Simple utility function to replace cn
const cn = (...classes) => classes.filter(Boolean).join(' ');

const VirtualTryout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [playerData, setPlayerData] = useState({
    name: '',
    age: '',
    position: '',
    preferredFoot: '',
    height: '',
    weight: '',
    location: '',
    experience: '',
    clubHistory: '',
    achievements: '',
    goals: ''
  });

  const [skillAssessments, setSkillAssessments] = useState({
    dribbling: 0,
    passing: 0,
    shooting: 0,
    defending: 0,
    fitness: 0,
    gameIQ: 0
  });

  const [uploadedVideos, setUploadedVideos] = useState([]);

  const positions = [
    'Goalkeeper', 'Centre-Back', 'Left-Back', 'Right-Back', 'Defensive Midfielder',
    'Central Midfielder', 'Attacking Midfielder', 'Left Winger', 'Right Winger', 
    'Centre-Forward', 'Left Forward', 'Right Forward'
  ];

  const handleInputChange = (field, value) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillAssessment = (skill, rating) => {
    setSkillAssessments(prev => ({ ...prev, [skill]: rating }));
  };

  const handleVideoUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedVideos(prev => [...prev, { type, file, name: file.name }]);
      alert(`${type} video uploaded successfully!`);
    }
  };

  const submitTryout = () => {
    alert("Your virtual tryout has been submitted for review. We'll contact you within 48 hours.");
  };

  const SkillRatingCard = ({ skill, title, description, rating, onRate }) => (
    <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
              <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Rate your skill level</span>
            <span>{rating}/10</span>
          </div>
                  <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  i < rating 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                onClick={() => onRate(skill, i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${rating * 10}%` }}
          />
        </div>
      </div>
    </div>
  );

  const VideoUploadCard = ({ title, type, icon }) => (
    <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
          {icon}
          {title}
        </h3>
      </div>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
        <FaCamera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-300 mb-3">Upload your {title.toLowerCase()} video</p>
        <label htmlFor={`video-${type}`} className="cursor-pointer">
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded border border-gray-600 transition-colors">
            <FaUpload className="w-4 h-4 mr-2 inline" />
            Select Video
          </button>
        </label>
        <input
          id={`video-${type}`}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleVideoUpload(e, type)}
        />
        {uploadedVideos.find(v => v.type === type) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
            <FaCheckCircle className="w-4 h-4" />
            Video uploaded successfully
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-96 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-white">Virtual Tryout</h1>
            <p className="text-xl opacity-90 mb-6 text-white">
              Showcase your football skills from anywhere in Nigeria. Get discovered by scouts and clubs through our comprehensive virtual assessment platform.
            </p>
            <div className="inline-flex items-center bg-white bg-opacity-20 text-white text-lg px-4 py-2 rounded-full">
              <FaTrophy className="w-5 h-5 mr-2 text-white" />
              Free Assessment
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-black border border-gray-700 rounded-lg shadow-md p-1">
            {[1, 2, 3, 4].map((step) => (
              <Button
                key={step}
                title={
                  step === 1 ? 'Player Info' :
                  step === 2 ? 'Skills Assessment' :
                  step === 3 ? 'Video Uploads' :
                  'Review & Submit'
                }
                leftIcon={
                  step === 1 ? <FaUser className="w-4 h-4 mr-2 inline" /> :
                  step === 2 ? <FaCrosshairs className="w-4 h-4 mr-2 inline" /> :
                  step === 3 ? <FaCamera className="w-4 h-4 mr-2 inline" /> :
                  <FaTrophy className="w-4 h-4 mr-2 inline" />
                }
                containerClass={`px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600${currentStep === step ? ' ring-2 ring-violet-400' : ''}`}
                onClick={() => setCurrentStep(step)}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Player Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2 text-white">
                  <FaUser className="w-5 h-5 text-white" />
                  Personal Information
                </h2>
                <p className="text-gray-300">
                  Tell us about yourself and your football background
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Full Name</label>
                    <input
                      type="text"
                      value={playerData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Age</label>
                    <input
                      type="number"
                      value={playerData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Your age"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Primary Position</label>
                    <select
                      value={playerData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your position</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Preferred Foot</label>
                    <select
                      value={playerData.preferredFoot}
                      onChange={(e) => handleInputChange('preferredFoot', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select preferred foot</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Height (cm)</label>
                    <input
                      type="number"
                      value={playerData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="Height in centimeters"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Weight (kg)</label>
                    <input
                      type="number"
                      value={playerData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Weight in kilograms"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={playerData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State"
                      className="w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Football Experience</label>
                  <textarea
                    value={playerData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Describe your football experience, years playing, training background..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Club History</label>
                  <textarea
                    value={playerData.clubHistory}
                    onChange={(e) => handleInputChange('clubHistory', e.target.value)}
                    placeholder="List clubs you've played for, youth teams, school teams..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  title="Continue to Skills Assessment"
                  containerClass="w-full font-medium py-3 px-4 rounded-md bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600"
                  onClick={() => setCurrentStep(2)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills Assessment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2 text-white">
                  <FaCrosshairs className="w-5 h-5 text-white" />
                  Skills Self-Assessment
                </h2>
                <p className="text-gray-300">
                  Rate your abilities in different aspects of the game (1-10 scale)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillRatingCard
                skill="dribbling"
                title="Ball Control & Dribbling"
                description="Your ability to control and maneuver the ball"
                rating={skillAssessments.dribbling}
                onRate={handleSkillAssessment}
              />
              <SkillRatingCard
                skill="passing"
                title="Passing & Vision"
                description="Accuracy and creativity in passing"
                rating={skillAssessments.passing}
                onRate={handleSkillAssessment}
              />
              <SkillRatingCard
                skill="shooting"
                title="Shooting & Finishing"
                description="Goal scoring ability and shot accuracy"
                rating={skillAssessments.shooting}
                onRate={handleSkillAssessment}
              />
              <SkillRatingCard
                skill="defending"
                title="Defensive Skills"
                description="Tackling, positioning, and interception"
                rating={skillAssessments.defending}
                onRate={handleSkillAssessment}
              />
              <SkillRatingCard
                skill="fitness"
                title="Physical Fitness"
                description="Speed, stamina, and athletic ability"
                rating={skillAssessments.fitness}
                onRate={handleSkillAssessment}
              />
              <SkillRatingCard
                skill="gameIQ"
                title="Game Intelligence"
                description="Tactical awareness and decision making"
                rating={skillAssessments.gameIQ}
                onRate={handleSkillAssessment}
              />
            </div>

            <Button
              title="Continue to Video Uploads"
              containerClass="w-full font-medium py-3 px-4 rounded-md bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600"
              onClick={() => setCurrentStep(3)}
            />
          </div>
        )}

        {/* Step 3: Video Uploads */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2 text-white">
                  <FaCamera className="w-5 h-5 text-white" />
                  Video Showcase
                </h2>
                <p className="text-gray-300">
                  Upload videos demonstrating your skills and game highlights
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoUploadCard
                title="Skills Demonstration"
                type="skills"
                icon={<FaCrosshairs className="w-5 h-5" />}
              />
              <VideoUploadCard
                title="Game Highlights"
                type="highlights"
                icon={<FaTrophy className="w-5 h-5" />}
              />
              <VideoUploadCard
                title="Physical Training"
                type="training"
                icon={<FaAward className="w-5 h-5" />}
              />
              <VideoUploadCard
                title="Position-Specific Skills"
                type="position"
                icon={<FaStar className="w-5 h-5" />}
              />
            </div>

            <Button
              title="Continue to Review"
              containerClass="w-full font-medium py-3 px-4 rounded-md bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600"
              onClick={() => setCurrentStep(4)}
            />
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-black border border-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2 text-white">
                  <FaTrophy className="w-5 h-5 text-white" />
                  Review Your Tryout
                </h2>
                <p className="text-gray-300">
                  Review your information before submitting your virtual tryout
                </p>
              </div>
              <div className="space-y-6">
                {/* Player Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white">Player Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{playerData.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Age:</span>
                        <span className="text-white">{playerData.age || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Position:</span>
                        <span className="text-white">{playerData.position || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{playerData.location || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-white">Skills Overview</h3>
                    <div className="space-y-3">
                      {Object.entries(skillAssessments).map(([skill, rating]) => (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize text-white">{skill.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-white">{rating}/10</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${rating * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Videos Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">Uploaded Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedVideos.length > 0 ? (
                      uploadedVideos.map((video, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border border-gray-600 rounded-lg">
                          <FaCheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="font-medium capitalize text-white">{video.type} Video</p>
                            <p className="text-sm text-gray-400">{video.name}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No videos uploaded yet</p>
                    )}
                  </div>
                </div>

                {/* Submission */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center space-y-4">
                  <FaTrophy className="w-12 h-12 mx-auto text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Ready to Submit?</h3>
                  <p className="text-gray-300">
                    Your virtual tryout will be reviewed by our scouts within 48 hours. 
                    We'll contact you via email with feedback and next steps.
                  </p>
                  <Button
                    title={<><FaTrophy className="w-5 h-5 mr-2 inline" />Submit Virtual Tryout</>}
                    containerClass="font-medium py-3 px-6 rounded-md bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 shadow-lg"
                    onClick={submitTryout}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryout;