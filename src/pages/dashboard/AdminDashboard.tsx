"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import Layout from "../../components/Layout"
import {
  Users,
  Trophy,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  UserCheck,
  Plus,
  Eye,
  AlertTriangle,
  Target,
  Shield,
  Trash2,
  X,
} from "lucide-react"
import { adminAPI, notificationsAPI } from "../../lib/api"
import toast from "react-hot-toast"

interface Team {
  id: number
  name: string
  logo?: string
  founded_year?: number
  players_count: number
  wins: number
  losses: number
  draws: number
  goals_for: number
  goals_against: number
  points: number
  created_at: string
  players?: Player[]
}

interface Player {
  id: number
  first_name: string
  last_name: string
  username: string
  position: string
  jersey_number?: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  is_verified: boolean
}

interface AdminDashboardData {
  counts: {
    users: number
    verified_users: number
    unverified_users: number
    teams: number
    matches: number
    pending_payments: number
    total_payments: number
    live_matches: number
  }
  recent_registrations: any[]
  pending_payments: any[]
  verified_payments: any[]
  upcoming_matches: any[]
  live_matches: any[]
  recent_matches: any[]
  notifications: any[]
  unread_notifications_count: number
  top_scorers: any[]
  teams: Team[]
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    counts: {
      users: 0,
      verified_users: 0,
      unverified_users: 0,
      teams: 0,
      matches: 0,
      pending_payments: 0,
      total_payments: 0,
      live_matches: 0,
    },
    recent_registrations: [],
    pending_payments: [],
    verified_payments: [],
    upcoming_matches: [],
    live_matches: [],
    recent_matches: [],
    notifications: [],
    unread_notifications_count: 0,
    top_scorers: [],
    teams: [],
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "payments" | "teams">("overview")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const [showTeamPlayersModal, setShowTeamPlayersModal] = useState(false)
  const [newTeam, setNewTeam] = useState({
    name: "",
    founded_year: new Date().getFullYear(),
  })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null)

  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
    if (activeTab === "teams") {
      fetchTeams()
    }
  }, [activeTab])

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      const data = response.data.data || response.data
      setDashboardData(data)
    } catch (error: any) {
      console.error("Failed to load admin dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications()
      const notifications = response.data.data || response.data || []
      setDashboardData((prev) => ({
        ...prev,
        notifications: notifications,
      }))
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await adminAPI.getTeams()
      const teams = response.data.data || response.data || []
      setDashboardData((prev) => ({
        ...prev,
        teams: Array.isArray(teams) ? teams : [],
      }))
    } catch (error: any) {
      console.error("Failed to load teams:", error)
      toast.error("Failed to load teams")
    }
  }

  const fetchTeamPlayers = async (teamId: number) => {
    try {
      const response = await adminAPI.getTeamPlayers(teamId)
      const players = response.data.data || response.data || []
      const team = dashboardData.teams.find((t) => t.id === teamId)
      if (team) {
        setSelectedTeam({
          ...team,
          players: Array.isArray(players) ? players : [],
        })
        setShowTeamPlayersModal(true)
      }
    } catch (error: any) {
      console.error("Failed to load team players:", error)
      toast.error("Failed to load team players")
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminAPI.createTeam(newTeam)
      toast.success("Team created successfully")
      setShowCreateTeamModal(false)
      setNewTeam({ name: "", founded_year: new Date().getFullYear() })
      fetchTeams()
      fetchDashboardData() // Refresh counts
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team")
    }
  }

  const handleDeleteTeam = async (teamId: number, teamName: string) => {
    setConfirmMessage(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`)
    setConfirmAction(() => async () => {
      try {
        await adminAPI.deleteTeam(teamId)
        toast.success("Team deleted successfully")
        fetchTeams()
        fetchDashboardData() // Refresh counts
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete team")
      }
    })
    setConfirmOpen(true)
  }

  const handleVerifyUser = async (userId: number) => {
    try {
      await adminAPI.verifyUser(userId)
      toast.success("User verified successfully")
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify user")
    }
  }

  const handleUnverifyUser = async (userId: number) => {
    try {
      await adminAPI.unverifyUser(userId)
      toast.success("User unverified successfully")
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unverify user")
    }
  }

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await adminAPI.verifyPayment(paymentId)
      toast.success("Payment verified successfully")
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify payment")
    }
  }

  const handleRejectPayment = async (paymentId: number) => {
    const reason = prompt("Enter rejection reason (optional):")
    try {
      await adminAPI.rejectPayment(paymentId, reason || undefined)
      toast.success("Payment rejected successfully")
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject payment")
    }
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  // Confirm Dialog Component
  const ConfirmDialog = () => {
    if (!confirmOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Action</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{confirmMessage}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
            >
              No
            </button>
            <button
              onClick={async () => {
                if (confirmAction) await confirmAction()
                setConfirmOpen(false)
              }}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage Special FC operations, members, and activities
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.users}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.counts.verified_users}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Verified</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.counts.unverified_users}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <Trophy className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.teams}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Teams</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <Calendar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.counts.matches}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Matches</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <Shield className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.counts.live_matches}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Live</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <CreditCard className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.counts.pending_payments}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending Pay</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card p-4 xl:col-span-1"
            >
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {dashboardData.counts.total_payments}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Pay</p>
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg w-fit">
              {[
                { key: "overview", label: "Overview" },
                { key: "users", label: "User Management" },
                { key: "payments", label: "Payment Verification" },
                { key: "teams", label: "Team Management" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === "overview" && (
                <>
                  {/* Recent Registrations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Registrations</h2>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {dashboardData.recent_registrations.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recent_registrations.slice(0, 5).map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Registered: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {user.is_verified ? (
                                <div className="flex items-center space-x-2">
                                  <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                    <CheckCircle size={16} />
                                    <span className="text-sm">Verified</span>
                                  </span>
                                  <button
                                    onClick={() => handleUnverifyUser(user.id)}
                                    className="btn-secondary px-3 py-1 text-xs"
                                  >
                                    Unverify
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleVerifyUser(user.id)}
                                  className="btn-primary px-3 py-1 text-sm"
                                >
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

                  {/* Live Matches */}
                  {dashboardData?.live_matches?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                      className="card p-6"
                    >
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Live Matches</h2>
                      <div className="space-y-4">
                        {dashboardData.live_matches.map((match, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {match.homeTeam?.name} vs {match.awayTeam?.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Started: {new Date(match.match_date).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {match.home_team_score} - {match.away_team_score}
                              </p>
                              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                                LIVE
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              {activeTab === "users" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="card p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">User Management</h2>
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
                              <button
                                onClick={() => handleUnverifyUser(user.id)}
                                className="btn-secondary px-3 py-1 text-xs"
                              >
                                Unverify
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerifyUser(user.id)}
                                className="btn-primary px-3 py-1 text-sm"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No users found</p>
                  )}
                </motion.div>
              )}

              {activeTab === "payments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="card p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Payment Verification</h2>
                  {dashboardData.pending_payments.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.pending_payments.map((payment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {payment.user.first_name} {payment.user.last_name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  ₦{payment.amount} - {payment.payment_type}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Submitted: {new Date(payment.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {payment.payment_proof && (
                              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                <Eye size={24} />
                              </button>
                            )}
                            <button
                              onClick={() => handleVerifyPayment(payment.id)}
                              className="btn-primary px-3 py-1 text-sm"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No pending payments</p>
                  )}
                </motion.div>
              )}

              {activeTab === "teams" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Team Management</h2>
                    <button
                      onClick={() => setShowCreateTeamModal(true)}
                      className="btn-primary px-4 py-2 flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Create Team</span>
                    </button>
                  </div>

                  {dashboardData.teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dashboardData.teams.map((team) => (
                        <div
                          key={team.id}
                          className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">{team.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Founded: {team.founded_year || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => fetchTeamPlayers(team.id)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="View Players"
                              >
                                <Users size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(team.id, team.name)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete Team"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{team.players_count}</p>
                              <p className="text-gray-600 dark:text-gray-400">Players</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{team.points}</p>
                              <p className="text-gray-600 dark:text-gray-400">Points</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                              <span>W: {team.wins}</span>
                              <span>D: {team.draws}</span>
                              <span>L: {team.losses}</span>
                              <span>GF: {team.goals_for}</span>
                              <span>GA: {team.goals_against}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => fetchTeamPlayers(team.id)}
                            className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <Eye size={14} />
                            <span>View Players ({team.players_count})</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No teams created yet</p>
                      <button onClick={() => setShowCreateTeamModal(true)} className="btn-primary px-6 py-2">
                        Create Your First Team
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Notifications</h3>
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                    {dashboardData.unread_notifications_count} new
                  </span>
                </div>
                {dashboardData?.notifications?.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {dashboardData.notifications.slice(0, 5).map((notification, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          notification.read_at
                            ? "bg-gray-50 dark:bg-dark-700"
                            : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        }`}
                        onClick={() => !notification.read_at && markNotificationAsRead(notification.id)}
                      >
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No notifications</p>
                )}
              </motion.div>

              {/* Top Scorers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Top Scorers</h3>
                {dashboardData.top_scorers.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.top_scorers.slice(0, 5).map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{scorer.username}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{scorer.team}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          <span className="font-bold text-primary-600 dark:text-primary-400">{scorer.goals}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No statistics available</p>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full btn-primary py-2 text-sm flex items-center justify-center space-x-2"
                  >
                    <Users size={16} />
                    <span>Manage Users</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = "/admin/matches")}
                    className="w-full btn-secondary py-2 text-sm flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Match</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = "/admin/reports")}
                    className="w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
                  >
                    <TrendingUp size={16} />
                    <span>View Reports</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Confirm Dialog */}
          <ConfirmDialog />
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 
                  dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 
                  focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Founded ( year of creation )
                </label>
                <input
                  type="number"
                  value={newTeam.founded_year}
                  onChange={(e) =>
                    setNewTeam({
                      ...newTeam,
                      founded_year: Number(e.target.value),
                    })
                  }
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 
                  dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 
                  focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 
                  hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-primary-600 text-white 
                  hover:bg-primary-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Team Players Modal */}
      {showTeamPlayersModal && selectedTeam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedTeam.name} – Players</h2>
              <button
                onClick={() => setShowTeamPlayersModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {selectedTeam.players && selectedTeam.players.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedTeam.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {player.first_name.charAt(0)}
                          {player.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {player.first_name} {player.last_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">@{player.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {player.is_verified ? (
                        <span title="Verified" ><UserCheck className="w-5 h-5 text-green-500"/></span>
                      ) : (
                        <span title="Not Verified" ><AlertTriangle className="w-5 h-5 text-yellow-500" /></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No players found in this team.</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTeamPlayersModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </Layout>
  )
}

export default AdminDashboard
