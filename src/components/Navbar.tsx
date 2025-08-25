"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Menu, X, Sun, Moon, Home, Calendar, BarChart3, Users, Trophy, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import NotificationDropdown from "./NotificationDropdown"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/welcome")
  }

  // Different nav items for admin and regular users
  const getNavItems = () => {
    if (user?.role === "admin") {
      return [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "Players", path: "/admin/players", icon: Users },
        { name: "Matches", path: "/admin/matches", icon: Calendar },
        { name: "Statistics", path: "/admin/statistics", icon: BarChart3 },
        { name: "Table", path: "/table", icon: Trophy },
        { name: "Fixtures", path: "/fixtures", icon: Calendar },
      ]
    } else {
      return [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "Matches", path: "/matches", icon: Calendar },
        { name: "Fixtures", path: "/fixtures", icon: Calendar },
        { name: "Statistics", path: "/statistics", icon: BarChart3 },
        { name: "Table", path: "/table", icon: Trophy },
        { name: "Players", path: "/players", icon: Users },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Special FC" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Special FC
              </span>
              {user?.role === "admin" && (
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Admin Panel</span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {user && <NotificationDropdown />}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* User Menu */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  {/* <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.username} 
                  </p> */}
                  <p className="text-sm text-gray-500 font-semibold dark:text-gray-400 capitalize">{user.role} {user.is_verified ? "• Verified" : "• Pending"} ✅</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              {user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2">
                      {/* <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.first_name} {user.last_name}
                      </p> */}
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {user.role} {user.is_verified ? "• Verified" : "• Pending"} ✅
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
