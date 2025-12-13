import React from 'react';
import Button from '../../components/Button';

const Sponsorship = () => {
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
    { label: 'Available Sponsors', value: '150+', icon: BuildingIcon },
    { label: 'Active Applications', value: '2,800+', icon: TargetIcon },
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

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {availableSponsors.filter(sponsor => !sponsor.featured).map((sponsor, index) => (
              <Card
                key={index}
                className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${sponsor.colorClasses} flex items-center justify-center flex-shrink-0`}>
                      <sponsor.icon />
                    </div>
                    <div className="ml-4 flex-1">
                      <CardTitle className="text-xl mb-1">{sponsor.name}</CardTitle>
                      <p className="text-sm text-gray-500 mb-2">{sponsor.type}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <LocationIcon />
                        <span className="ml-1">{sponsor.location}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {sponsor.amount}
                        <span className="text-sm font-normal text-gray-500">/{sponsor.period}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {sponsor.focus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                    <ul className="space-y-1">
                      {sponsor.requirements.map((req, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckIcon />
                          <span className="ml-2">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Benefits:</h4>
                    <ul className="space-y-1 mb-4">
                      {sponsor.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <StarIcon />
                          <span className="ml-2">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    title="Apply Now"
                    containerClass={`w-full border border-gray-300 bg-transparent hover:bg-gray-50 h-11 px-8 text-lg`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Your Full Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="18" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+234 800 000 0000" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location (State)</Label>
                  <Input id="location" placeholder="Lagos State" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Playing Position</Label>
                  <Input id="position" placeholder="Midfielder" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Current Club/Team</Label>
                <Input id="experience" placeholder="Current club or academy" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <select
                  id="level"
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
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Career Goals & Sponsorship Needs</Label>
                <Textarea
                  id="goals"
                  placeholder="Describe your career goals and what kind of support you're looking for from sponsors..."
                  rows={4}
                />
              </div>

              <Button title="Submit Application" containerClass="w-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl h-11 px-8 text-lg" />
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