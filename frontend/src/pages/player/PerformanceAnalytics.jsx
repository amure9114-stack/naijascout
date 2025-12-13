"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Button from "../../components/Button";

gsap.registerPlugin(ScrollTrigger)

const PerformanceAnalytics = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const filtersRef = useRef(null)

  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [selectedMetricType, setSelectedMetricType] = useState("all")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Sample performance data
  const [performanceData] = useState([
    {
      id: 1,
      title: "Goals Scored",
      value: 15,
      subtitle: "This season",
      type: "offensive",
      chartData: [8, 12, 15, 18, 15, 20],
      color: "text-green-400",
    },
    {
      id: 2,
      title: "Assists",
      value: 8,
      subtitle: "Total assists",
      type: "offensive",
      chartData: [3, 5, 8, 6, 8, 10],
      color: "text-blue-400",
    },
    {
      id: 3,
      title: "Fitness Score",
      value: "92%",
      subtitle: "Overall fitness",
      type: "physical",
      chartData: [85, 88, 90, 92, 91, 92],
      color: "text-yellow-400",
    },
    {
      id: 4,
      title: "Pass Accuracy",
      value: "87%",
      subtitle: "Successful passes",
      type: "technical",
      chartData: [82, 85, 87, 86, 87, 89],
      color: "text-purple-400",
    },
    {
      id: 5,
      title: "Tackles Won",
      value: 23,
      subtitle: "Defensive actions",
      type: "defensive",
      chartData: [18, 20, 23, 21, 23, 25],
      color: "text-red-400",
    },
    {
      id: 6,
      title: "Distance Covered",
      value: "11.2km",
      subtitle: "Average per match",
      type: "physical",
      chartData: [10.5, 11.0, 11.2, 10.8, 11.2, 11.5],
      color: "text-orange-400",
    },
  ])

  // Filter data based on selected filters
  const filteredData = performanceData.filter((item) => {
    if (selectedMetricType !== "all" && item.type !== selectedMetricType) {
      return false
    }
    // Date filtering would be implemented with actual date logic
    return true
  })

  // GSAP Animations
  useEffect(() => {
    console.log("[v0] Initializing GSAP animations")

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      )

      // Cards stagger animation
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
            trigger: cardsRef.current[0],
            start: "top 80%",
            once: true,
          },
        },
      )

      // Filters slide animation
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
            once: true,
          },
        },
      )
    }, containerRef)

    return () => {
      console.log("[v0] Cleaning up GSAP animations")
      ctx.revert()
    }
  }, [])

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
      backgroundColor: isHovering ? "#16a34a" : "#16a34a",
      duration: 0.2,
      ease: "power2.out",
    })
  }

  // Mini chart component
  const MiniChart = ({ data, color }) => (
    <div className="flex items-end space-x-1 h-8">
      {data.map((value, index) => (
        <div
          key={index}
          className={`w-2 bg-gradient-to-t from-gray-600 to-${color.split("-")[1]}-400 rounded-sm`}
          style={{ height: `${(value / Math.max(...data)) * 100}%` }}
        />
      ))}
    </div>
  )

  const handleViewDetailedReport = () => {
    console.log("[v0] Navigating to detailed analytics")
    navigate("/player/analytics")
  }

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden bg-black/70 font-general">
      {/* Header Section */}
      <div ref={headerRef} className="bg-gradient-to-br from-gray-900 to-black py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Performance Analytics</h1>
          <p className="text-xl text-white/80">Track your progress and dominate the field</p>
        </div>
      </div>

      {/* Filters Section */}
      <div ref={filtersRef} className="max-w-6xl mx-auto px-4 py-8">
        <Button
          title={isFiltersOpen ? "Hide Filters" : "Show Filters"}
          containerClass="mb-4 px-4 py-2 bg-black/50 border border-gray-600 text-white rounded-lg hover:bg-black/70 transition-colors duration-300"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        />

        {isFiltersOpen && (
          <div className="bg-black/50 border border-gray-600 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Date Range</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="season">This Season</option>
                  <option value="month">Last Month</option>
                  <option value="week">Last Week</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2 font-semibold">Metric Type</label>
                <select
                  value={selectedMetricType}
                  onChange={(e) => setSelectedMetricType(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Metrics</option>
                  <option value="offensive">Offensive</option>
                  <option value="defensive">Defensive</option>
                  <option value="technical">Technical</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((metric, index) => (
            <div
              key={metric.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{metric.title}</h3>
                  <p className="text-sm text-gray-300">{metric.subtitle}</p>
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              </div>

              <div className="mt-4">
                <MiniChart data={metric.chartData} color={metric.color} />
              </div>

              <div className="mt-3 text-xs text-gray-400 capitalize">{metric.type} metric</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            title="View Detailed Report"
            containerClass="px-8 py-3  font-semibold rounded-lg bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300 shadow-lg"
            onClick={handleViewDetailedReport}
          />
        </div>
      </div>
    </div>
  )
}

export default PerformanceAnalytics
