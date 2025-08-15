"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { ArrowRight, Trophy, Users, Calendar, Star, Shield, Target, Sun, Moon } from "lucide-react"

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  const features = [
    {
      icon: Trophy,
      title: "Championship Legacy",
      description:
        "Join a club with a winning tradition and championship mentality that drives excellence in every match.",
    },
    {
      icon: Users,
      title: "Strong Community",
      description:
        "Be part of a tight-knit football family where every member supports each other on and off the field.",
    },
    {
      icon: Target,
      title: "Skill Development",
      description:
        "Improve your game with professional coaching and structured training programs for all skill levels.",
    },
    {
      icon: Shield,
      title: "Team Spirit",
      description:
        "Experience the true meaning of teamwork and build lifelong friendships with fellow football enthusiasts.",
    },
  ]

  const stats = [
    { number: "4", label: "Active Teams" },
    { number: "100+", label: "Players" },
    { number: "50+", label: "Matches Played" },
    { number: "15+", label: "Trophies Won" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 ai-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/welcome" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Special FC" className="h-10 w-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Special FC
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <Link to="/login" className="btn-primary px-6 py-2">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                Welcome to Special FC
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Join the most passionate football community where dreams become reality. Experience the beautiful game
                with professional training, competitive matches, and a family of dedicated players.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn-primary px-8 py-4 text-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Join Our Team</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
                  Member Login
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img src="/logo.png" alt="Special FC Logo" className="w-full max-w-md mx-auto animate-float" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800 rounded-full opacity-20 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Why Join Special FC?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover what makes our football club the perfect place to pursue your passion for the beautiful game.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Details Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">About Our Teams</h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Special FC consists of four competitive teams, each with its own unique identity and playing
                style. Our teams compete in various leagues and tournaments, providing opportunities for players of all
                skill levels to showcase their talents and grow as footballers.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg">Professional coaching staff</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg">Regular training sessions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg">Competitive league matches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-yellow-300" />
                  <span className="text-lg">Strong team camaraderie</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Membership Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2"></div>
                    <span>Access to professional training facilities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2"></div>
                    <span>Participation in competitive matches</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2"></div>
                    <span>Team kit and equipment provided</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2"></div>
                    <span>Monthly team events and activities</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2"></div>
                    <span>Performance tracking and statistics</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Ready to Join the Team?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Take the first step towards becoming part of the Special Football FC family. Register today and start your
              journey with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 text-lg flex items-center justify-center space-x-2 group"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/welcome" className="btn-secondary px-8 py-4 text-lg">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo.png" alt="Special FC" className="h-10 w-10" />
              <span className="text-xl font-bold">Special FC</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 Special FC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
