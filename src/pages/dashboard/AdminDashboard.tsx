"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import Layout from "../../components/Layout"
import { Users, Trophy, Calendar, CreditCard, CheckCircle, XCircle, TrendingUp, UserCheck } from 'lucide-react'
import { dashboardAPI, adminAPI } from "../../lib/api"
import toast from "react-hot-toast"

// Define a more specific Match interface for AdminDashboard
interface Match {
  id: number
  homeTeam: { id: number; name: string } | null // Allow null for safety
  awayTeam: { id: number; name: string } | null // Allow null for safety
  home_team_score: number
  away_team_score: number
  match_date: string
  is_played: boolean
}

interface AdminDashboardData {
  counts: {
    users: number
    verified_users: number
    teams: number
    matches: number
    pending_payments: number
  }
  recent_registrations: any[]
  pending_payments: any[]
  upcoming_matches: Match[] // Use the new Match interface
  recent_matches: any[]
  unread_notifications_count: number
  top_scorers: any[]
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboard()
      setDashboardData(response.data.data)
    } catch (error) {
      console.error("Failed to load admin dashboard data:", error); // Log the error for debugging
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async (userId: number) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("User verified successfully")
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to verify user")
    }
  }

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await adminAPI.verifyPayment(paymentId)
      toast.success("Payment verified successfully")
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to verify payment")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    )
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Dashboard</h2>
            <button onClick={fetchDashboardData} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage Special FC operations and members</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.users}</p>
                </div>
                <Users className="w-12 h-12 text-primary-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {dashboardData.counts.verified_users}
                  </p>
                </div>
                <UserCheck className="w-12 h-12 text-secondary-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teams</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.teams}</p>
                </div>
                <Trophy className="w-12 h-12 text-primary-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matches</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.matches}</p>
                </div>
                <Calendar className="w-12 h-12 text-secondary-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {dashboardData.counts.pending_payments}
                  </p>
                </div>
                <CreditCard className="w-12 h-12 text-yellow-500" />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Registrations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Registrations</h2>
                {dashboardData.recent_registrations.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_registrations.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.is_verified ? (
                            <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <CheckCircle size={16} />
                              <span className="text-sm">Verified</span>
                            </span>
                          ) : (
                            <button onClick={() => handleVerifyUser(user.id)} className="btn-primary px-3 py-1 text-sm">
                              Verify
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent registrations</p>
                )}
              </motion.div>

              {/* Pending Payments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pending Payments</h2>
                {dashboardData.pending_payments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.pending_payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {payment.user.first_name} {payment.user.last_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ₦{payment.amount} - {payment.type}
                          </p>
                        </div>
                        <button
                          onClick={() => handleVerifyPayment(payment.id)}
                          className="btn-primary px-3 py-1 text-sm"
                        >
                          Verify
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No pending payments</p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Scorers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Top Scorers</h3>
                {dashboardData.top_scorers.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.top_scorers.slice(0, 5).map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{scorer.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{scorer.team}</p>
                        </div>
                        <span className="font-bold text-primary-600 dark:text-primary-400">{scorer.goals}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No statistics available</p>
                )}
              </motion.div>

              {/* Upcoming Matches */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Upcoming Matches</h3>
                {dashboardData.upcoming_matches.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.upcoming_matches.slice(0, 3).map((match, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {match.homeTeam?.name || 'N/A'} vs {match.awayTeam?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(match.match_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No upcoming matches</p>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary py-2 text-sm flex items-center justify-center space-x-2">
                    <Users size={16} />
                    <span>Manage Users</span>
                  </button>
                  <button className="w-full btn-secondary py-2 text-sm flex items-center justify-center space-x-2">
                    <Calendar size={16} />
                    <span>Add Match</span>
                  </button>
                  <button className="w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors">
                    <TrendingUp size={16} />
                    <span>View Reports</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
