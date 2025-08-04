"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Star, Trophy, Users } from "lucide-react"

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 ai-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <img src="/logo.png" alt="Special FC Logo" className="w-32 h-32 mx-auto animate-float" />
          </motion.div>

          {/* Welcome Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
          >
            Welcome to Special FC
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Join the most exciting football community where passion meets excellence. Experience the thrill of the
            beautiful game with us!
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
          >
            <div className="card p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Star className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Elite Training</h3>
              <p className="text-gray-600 dark:text-gray-400">Professional coaching and world-class facilities</p>
            </div>

            <div className="card p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Trophy className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Competitive Leagues</h3>
              <p className="text-gray-600 dark:text-gray-400">Participate in exciting tournaments and matches</p>
            </div>

            <div className="card p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Community</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect with passionate football enthusiasts</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/landing" className="btn-primary px-8 py-4 text-lg flex items-center space-x-2 group">
              <span>Explore Our Club</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
              Member Login
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-5 w-12 h-12 bg-primary-300 dark:bg-primary-700 rounded-full opacity-30 animate-float"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default WelcomePage
