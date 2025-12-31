import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';

const Sponsorship = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    location: '',
    position: '',
    experience: '',
    level: '',
    sponsorType: '',
    achievements: '',
    goals: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch sponsorships from API
  useEffect(() => {
    const fetchSponsorships = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/sponsorships?isActive=true`);

        if (!response.ok) {
          throw new Error('Failed to fetch sponsorships');
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setSponsorships(data.data);
        } else {
          setSponsorships([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching sponsorships:', err);
        setError('Failed to load sponsorships. Please try again later.');
        setSponsorships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorships();
  }, [API_URL]);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token || !user) {
        alert('Please log in to submit an application');
        setSubmitting(false);
        return;
      }

      // Submit to backend
      const response = await fetch(`${API_URL}/api/sponsorships/player/${user.id}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          position: formData.position,
          experience: formData.experience,
          level: formData.level,
          sponsorType: formData.sponsorType,
          achievements: formData.achievements,
          goals: formData.goals,
          playerId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        age: '',
        email: '',
        phone: '',
        location: '',
        position: '',
        experience: '',
        level: '',
        sponsorType: '',
        achievements: '',
        goals: ''
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Simple inline components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );

  const CardDescription = ({ children, className = "" }) => (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );

  const Input = ({ className = "", ...props }) => (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );

  const Textarea = ({ className = "", ...props }) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );

  const Label = ({ children, className = "", ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );

  // Simple icons using Unicode symbols and CSS
  const HeartIcon = () => <span className="text-xl">❤️</span>;
  const BuildingIcon = () => <span className="text-xl">🏢</span>;
  const CrownIcon = () => <span className="text-xl">👑</span>;
  const StarIcon = () => <span className="text-xl">⭐</span>;
  const TrophyIcon = () => <span className="text-xl">🏆</span>;
  const TargetIcon = () => <span className="text-xl">🎯</span>;
  const ZapIcon = () => <span className="text-xl">⚡</span>;
  const CheckIcon = () => <span className="text-green-500 text-sm">✓</span>;
  const LocationIcon = () => <span className="text-sm">📍</span>;
  const MailIcon = () => <span className="text-sm">✉️</span>;
  const PhoneIcon = () => <span className="text-sm">📞</span>;

  // Function to get icon based on sponsor type
  const getIconForSponsor = (sponsor) => {
    const typeMap = {
      'Corporate': BuildingIcon,
      'Foundation': CrownIcon,
      'Non-Profit': HeartIcon,
      'Government': TrophyIcon,
      'Individual': StarIcon
    };

    for (let key in typeMap) {
      if (sponsor.type && sponsor.type.includes(key)) {
        return typeMap[key];
      }
    }
    return BuildingIcon;
  };

  // Function to get color classes based on index
  const getColorClasses = (index) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  // Parse requirements and benefits if they're JSON strings
  const parseRequirements = (req) => {
    if (typeof req === 'string') {
      try {
        return JSON.parse(req);
      } catch (e) {
        return [req];
      }
    }
    return Array.isArray(req) ? req : [];
  };

  const parseBenefits = (ben) => {
    if (typeof ben === 'string') {
      try {
        return JSON.parse(ben);
      } catch (e) {
        return [ben];
      }
    }
    return Array.isArray(ben) ? ben : [];
  };

  // Fallback sponsors for demo purposes if API is empty
  const availableSponsors = [
    {
      name: 'Lagos Sports Foundation',
      type: 'Non-Profit Organization',
      amount: '₦300,000 - ₦800,000',
      period: 'per year',
      icon: HeartIcon,
      colorClasses: 'from-red-400 to-red-600',
      location: 'Lagos, Nigeria',
      focus: 'Youth Development',
      requirements: [
        'Age 16-21',
        'Lagos State resident',
        'Academic performance',
        'Community involvement'
      ],
      benefits: [
        'Training allowance',
        'Equipment support',
        'Educational assistance',
        'Mentorship program'
      ]
    },
    {
      name: 'First Bank Sports Scholarship',
      type: 'Corporate Sponsor',
      amount: '₦500,000 - ₦1,200,000',
      period: 'per year',
      icon: BuildingIcon,
      colorClasses: 'from-blue-400 to-blue-600',
      location: 'Nationwide',
      focus: 'Elite Athletes',
      featured: true,
      requirements: [
        'Age 18-25',
        'State/National team level',
        'Academic excellence',
        'Leadership qualities'
      ],
      benefits: [
        'Full tuition coverage',
        'Monthly stipend',
        'Professional coaching',
        'Career mentorship',
        'International exposure'
      ]
    },
    {
      name: 'Dangote Sports Initiative',
      type: 'Private Foundation',
      amount: '₦200,000 - ₦600,000',
      period: 'per year',
      icon: CrownIcon,
      colorClasses: 'from-green-400 to-green-600',
      location: 'Northern Nigeria',
      focus: 'Grassroots Development',
      requirements: [
        'Age 14-20',
        'Northern states only',
        'Demonstrated talent',
        'Financial need'
      ],
      benefits: [
        'Training facilities access',
        'Nutritional support',
        'Travel allowances',
        'Skills development'
      ]
    },
    {
      name: 'MTN Future Stars Program',
      type: 'Corporate Sponsor',
      amount: '₦400,000 - ₦900,000',
      period: 'per year',
      icon: StarIcon,
      colorClasses: 'from-yellow-400 to-yellow-600',
      location: 'Major Cities',
      focus: 'Professional Pathway',
      requirements: [
        'Age 17-23',
        'Club level experience',
        'Social media presence',
        'Brand alignment'
      ],
      benefits: [
        'Professional contracts',
        'Marketing opportunities',
        'Brand partnerships',
        'Media training'
      ]
    }
  ];

  const stats = [
    { label: 'Available Sponsors', value: sponsorships.length > 0 ? sponsorships.length.toString() : '150+', icon: BuildingIcon },
    { label: 'Active Applications', value: sponsorships.reduce((sum, s) => sum + (s._count?.applications || 0), 0).toString(), icon: TargetIcon },
    { label: 'Sponsored Players', value: '890+', icon: TrophyIcon },
    { label: 'Success Rate', value: '76%', icon: ZapIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-yellow-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Sponsor
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover sponsorship opportunities and take your football career to the next level with Nigeria's top sponsors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button title="Browse Sponsors" containerClass="bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-lg hover:shadow-xl hover:scale-105 h-11 px-8 text-lg" />
            <Button title="Application Tips" containerClass="bg-white/10 border-white/30 text-white hover:bg-white/20 border border-gray-300 h-11 px-8 text-lg" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Sponsors */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-800">Available Sponsors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore sponsorship opportunities from Nigeria's leading organizations and take your football career to the next level.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading sponsorships...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
              <p className="text-red-700 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && sponsorships.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {sponsorships.map((sponsor, index) => {
                const SponsorIcon = getIconForSponsor(sponsor);
                const requirements = parseRequirements(sponsor.requirements);
                const benefits = parseBenefits(sponsor.benefits);

                return (
                  <Card
                    key={sponsor.id}
                    className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getColorClasses(index)} flex items-center justify-center flex-shrink-0`}>
                          <SponsorIcon />
                        </div>
                        <div className="ml-4 flex-1">
                          <CardTitle className="text-xl mb-1">{sponsor.name}</CardTitle>
                          <p className="text-sm text-gray-500 mb-2">{sponsor.type}</p>
                          {sponsor.location && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <LocationIcon />
                              <span className="ml-1">{sponsor.location}</span>
                            </div>
                          )}
                          <div className="text-lg font-bold text-green-600">
                            {sponsor.amount}
                            <span className="text-sm font-normal text-gray-500">/{sponsor.period || 'per year'}</span>
                          </div>
                        </div>
                      </div>
                      {sponsor.focus && (
                        <div className="mt-3">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {sponsor.focus}
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                          <ul className="space-y-1">
                            {requirements.map((req, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <CheckIcon />
                                <span className="ml-2">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Benefits:</h4>
                          <ul className="space-y-1 mb-4">
                            {benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <StarIcon />
                                <span className="ml-2">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {sponsor._count && (
                        <div className="text-xs text-gray-500 py-2">
                          {sponsor._count.applications} application{sponsor._count.applications !== 1 ? 's' : ''}
                        </div>
                      )}
                      <Button
                        title="Apply Now"
                        containerClass={`w-full border border-gray-300 bg-transparent hover:bg-gray-50 h-11 px-8 text-lg`}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : !loading && !error && sponsorships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No sponsorships available at the moment.</p>
              <p className="text-gray-500">Please check back soon for new opportunities.</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Apply for Sponsorship</h2>
            <p className="text-xl text-gray-600">
              Complete your sponsorship application and get connected with sponsors who match your profile and goals.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Player Sponsorship Application</CardTitle>
              <CardDescription className="text-center mt-2">
                Fill out your profile and sponsorship requirements. Our team will match you with suitable sponsors.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                  ✓ Application submitted successfully! We'll review your profile and connect you with suitable sponsors.
                </div>
              )}

              <form onSubmit={handleSubmitApplication}>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Your Full Name"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="18"
                        value={formData.age}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (State)</Label>
                      <Input
                        id="location"
                        placeholder="Lagos State"
                        value={formData.location}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Playing Position</Label>
                      <Input
                        id="position"
                        placeholder="Midfielder"
                        value={formData.position}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Current Club/Team</Label>
                    <Input
                      id="experience"
                      placeholder="Current club or academy"
                      value={formData.experience}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Experience Level</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select your level</option>
                      <option value="grassroots">Grassroots/Amateur</option>
                      <option value="academy">Academy Player</option>
                      <option value="youth">Youth National Team</option>
                      <option value="professional">Professional Club</option>
                      <option value="national">Senior National Team</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sponsorType">Preferred Sponsor Type</Label>
                    <select
                      id="sponsorType"
                      value={formData.sponsorType}
                      onChange={handleFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Any sponsor type</option>
                      <option value="corporate">Corporate Sponsor</option>
                      <option value="foundation">Private Foundation</option>
                      <option value="nonprofit">Non-Profit Organization</option>
                      <option value="individual">Individual Sponsor</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Notable Achievements</Label>
                    <Textarea
                      id="achievements"
                      placeholder="List your key achievements, awards, tournaments played, etc..."
                      value={formData.achievements}
                      onChange={handleFormChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">Career Goals & Sponsorship Needs</Label>
                    <Textarea
                      id="goals"
                      placeholder="Describe your career goals and what kind of support you're looking for from sponsors..."
                      value={formData.goals}
                      onChange={handleFormChange}
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !formData.fullName || !formData.email || !formData.phone}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl h-11 px-8 text-lg rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Sponsorship Journey
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of Nigerian players who have found sponsors through NaijaScout and taken their careers to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button title="players@naijascout.com" leftIcon={<MailIcon />} containerClass="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl flex items-center h-11 px-8 text-lg" />
            <Button title="+234 800 PLAYER-HELP" leftIcon={<PhoneIcon />} containerClass="bg-white/10 border-white/30 text-white hover:bg-white/20 border border-gray-300 flex items-center h-11 px-8 text-lg" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsorship;