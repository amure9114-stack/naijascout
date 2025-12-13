"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Trials = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const filtersRef = useRef(null)
  const gridRef = useRef(null)
  const cardsRef = useRef([])

  // Trial data from API
  const [allTrials, setAllTrials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch trials from API
  useEffect(() => {
    const fetchTrials = async () => {
      try {
        setLoading(true)
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${API_URL}/api/trials`)
        const data = await res.json()
        
        if (data.success) {
          // Transform API data to match component format
          const transformed = data.data.map(trial => ({
            id: trial.id,
            name: trial.title,
            date: new Date(trial.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            location: trial.location,
            eligibility: trial.description 
              ? [trial.description, trial.ageGroup ? `Age: ${trial.ageGroup}` : ''].filter(Boolean)
              : [],
            category: trial.ageGroup || 'all',
            position: 'all',
            time: trial.time,
            rawDate: trial.date
          }))
          setAllTrials(transformed)
        } else {
          setError('Failed to load trials')
        }
      } catch (err) {
        console.error('Error fetching trials:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrials()
  }, [])

  // Filter states
  const [filters, setFilters] = useState({
    location: "",
    ageGroup: "",
    position: "",
    showFilters: false,
  })

  const [filteredTrials, setFilteredTrials] = useState(allTrials)

  // Filter logic
  useEffect(() => {
    let filtered = allTrials

    if (filters.location) {
      filtered = filtered.filter((trial) => trial.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.ageGroup) {
      filtered = filtered.filter((trial) => trial.category === filters.ageGroup)
    }

    if (filters.position && filters.position !== "all") {
      filtered = filtered.filter((trial) => trial.position === filters.position || trial.position === "all")
    }

    setFilteredTrials(filtered)
    console.log("Filters applied:", filters, "Results:", filtered.length)
  }, [filters, allTrials])

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Filters section animation
      gsap.fromTo(
        filtersRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Trial cards stagger animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    return () => ctx.revert()
  }, [filteredTrials])

  // Card hover animations
  const handleCardHover = (index, isHovering) => {
    gsap.to(cardsRef.current[index], {
      scale: isHovering ? 1.05 : 1,
      duration: 0.3,
      ease: isHovering ? "back.out(1.7)" : "power2.out",
    })
  }

  // Button hover animations
  const handleButtonHover = (element, isHovering) => {
    gsap.to(element, {
      scale: isHovering ? 1.1 : 1,
      backgroundColor: isHovering ? "#16a34a" : "#059669",
      duration: 0.2,
      ease: "power2.out",
    })
  }

  const handleViewAllTrials = () => {
    console.log("Navigating to all trials page")
    navigate("/player/trials")
  }

  const handleRegisterTrial = async (trialId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to apply for trials')
        navigate('/auth/login')
        return
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const username = localStorage.getItem('username')
      
      if (!username) {
        alert('User information not found. Please login again.')
        return
      }
      
      // Get player ID from username
      const playerRes = await fetch(`${API_URL}/api/players/username/${encodeURIComponent(username)}`)
      const playerData = await playerRes.json()
      
      if (!playerData.success || !playerData.data) {
        alert('Player profile not found. Please complete your profile first.')
        return
      }
      
      // Apply for trial
      const res = await fetch(`${API_URL}/api/trials/${trialId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          playerId: playerData.data.id
        })
      })
      
      const data = await res.json()
      if (data.success) {
        alert('Successfully applied for trial!')
      } else {
        alert('Failed to apply: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error applying for trial:', err)
      alert('Error applying: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black/70 text-white relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted className="w-full h-full object-cover opacity-30">
          <source src="/placeholder.mp4?height=1080&width=1920&query=football field aerial view" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="text-center py-20 px-4">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
            <h1 className="text-5xl font-bold mb-4">Upcoming Trials</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Showcase your skills and join Nigeria's top football trials
          </p>
        </section>

        {/* Filters Section */}
        <section ref={filtersRef} className="px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <Button
              title={filters.showFilters ? "Hide Filters" : "Show Filters"}
              containerClass=" px-6 py-3 rounded-lg bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 transition duration-300 mb-4"
              onClick={() => setFilters((prev) => ({ ...prev, showFilters: !prev.showFilters }))}
            />

            {filters.showFilters && (
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Enter city..."
                      value={filters.location}
                      onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Age Group</label>
                    <select
                      value={filters.ageGroup}
                      onChange={(e) => setFilters((prev) => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    >
                      <option value="">All Age Groups</option>
                      <option value="youth">Youth (16-21)</option>
                      <option value="professional">Professional (18-25)</option>
                      <option value="academy">Academy (14-19)</option>
                      <option value="elite">Elite (20-26)</option>
                      <option value="grassroots">Grassroots (15-20)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <select
                      value={filters.position}
                      onChange={(e) => setFilters((prev) => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    >
                      <option value="">All Positions</option>
                      <option value="all">All Positions</option>
                      <option value="defender">Defender</option>
                      <option value="midfielder">Midfielder</option>
                      <option value="forward">Forward</option>
                      <option value="goalkeeper">Goalkeeper</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Trial Listings */}
        <section className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {loading && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">Loading trials...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <p className="text-xl text-red-400">Error: {error}</p>
                <Button
                  title="Retry"
                  containerClass="mt-4 bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 px-6 py-3"
                  onClick={() => window.location.reload()}
                />
              </div>
            )}
            
            {!loading && !error && (
              <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrials.map((trial, index) => (
                <div
                  key={trial.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="bg-black/50 p-6 rounded-lg border border-gray-700 hover:shadow-lg transition duration-300 cursor-pointer"
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                >
                  <h3 className="text-xl font-semibold mb-3 text-green-400">{trial.name}</h3>

                  <div className="text-sm text-gray-300 mb-4">
                    <p className="mb-1">📅 {trial.date}</p>
                    <p className="mb-3">📍 {trial.location}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2 text-white">Eligibility:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {trial.eligibility.map((criteria, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    title="Register Now"
                    containerClass="w-full  py-3 px-4 rounded-lg bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 transition duration-300 font-medium"
                    onClick={() => handleRegisterTrial(trial.id)}
                  />
                </div>
              ))}
              </div>
            )}

            {!loading && !error && filteredTrials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No trials match your current filters.</p>
                <Button
                  title="Clear Filters"
                  containerClass="mt-4 bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
                  onClick={() => setFilters({ location: "", ageGroup: "", position: "", showFilters: false })}
                />
              </div>
            )}

            {/* View All Trials CTA */}
            {filteredTrials.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  title="View All Trials"
                  containerClass="px-8 py-4 rounded-lg bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 transition duration-300 text-lg font-medium"
                  onClick={handleViewAllTrials}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Trials
