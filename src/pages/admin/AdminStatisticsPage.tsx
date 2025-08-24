"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import { Target, Users, AlertTriangle, Hand, Trophy, Edit, Save, X, Search, Filter } from "lucide-react"
import { statisticsAPI, teamsAPI } from "../../lib/api"
import toast from "react-hot-toast"

interface PlayerStatistic {
  id: number
  player_id: number
  player: {
    id: number
    first_name: string
    last_name: string
    username: string
    team: {
      id: number
      name: string
    } | null
  }
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  handballs: number
  matches_played: number
}

interface Team {
  id: number
  name: string
}

const AdminStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<PlayerStatistic[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"goals" | "assists" | "yellow_cards" | "red_cards" | "handballs">("goals")

  const [editForm, setEditForm] = useState({
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    handballs: 0,
    matches_played: 0,
  })

  useEffect(() => {
    fetchStatistics()
    fetchTeams()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await statisticsAPI.getPlayerStatistics()
      setStatistics(response.data.data)
    } catch (error) {
      toast.error("Failed to load player statistics")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getTeams()
      setTeams(response.data.data)
    } catch (error) {
      console.error("Failed to load teams:", error)
    }
  }

  const handleEditPlayer = (player: PlayerStatistic) => {
    setEditingPlayer(player.player_id)
    setEditForm({
      goals: player.goals,
      assists: player.assists,
      yellow_cards: player.yellow_cards,
      red_cards: player.red_cards,
      handballs: player.handballs,
      matches_played: player.matches_played,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingPlayer) return

    try {
      await statisticsAPI.updatePlayerStatistic(editingPlayer, editForm)
      toast.success("Player statistics updated successfully")
      setEditingPlayer(null)
      fetchStatistics()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update statistics")
    }
  }

  const handleCancelEdit = () => {
    setEditingPlayer(null)
    setEditForm({
      goals: 0,
      assists: 0,
      yellow_cards: 0,
      red_cards: 0,
      handballs: 0,
      matches_played: 0,
    })
  }

  const filteredStatistics = statistics.filter((stat) => {
    const matchesSearch =
      stat.player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.player.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.player.username.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam =
      filterTeam === "all" ||
      (filterTeam === "unassigned" && !stat.player.team) ||
      stat.player.team?.name === filterTeam

    return matchesSearch && matchesTeam
  })

  const sortedStatistics = [...filteredStatistics].sort((a, b) => {
    return b[activeTab] - a[activeTab]
  })

  const statTabs = [
    {
      key: "goals" as const,
      label: "Goals",
      icon: Target,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      key: "assists" as const,
      label: "Assists",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      key: "yellow_cards" as const,
      label: "Yellow Cards",
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      key: "red_cards" as const,
      label: "Red Cards",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      key: "handballs" as const,
      label: "Handballs",
      icon: Hand,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ]

  const activeTabConfig = statTabs.find((tab) => tab.key === activeTab)!

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Player Statistics Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update and manage detailed statistics for all players across different categories
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search players by name or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Team Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 min-w-[200px]"
                >
                  <option value="all">All Teams</option>
                  <option value="unassigned">Unassigned</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedStatistics.length} of {statistics.length} players
            </div>
          </motion.div>

          {/* Statistics Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-dark-800 p-2 rounded-lg">
              {statTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? `${tab.bgColor} ${tab.color} shadow-sm`
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-700"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Statistics Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card overflow-hidden"
          >
            <div className={`p-6 ${activeTabConfig.bgColor} border-b border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center space-x-3">
                <activeTabConfig.icon className={`w-8 h-8 ${activeTabConfig.color}`} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeTabConfig.label}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Players ranked by {activeTabConfig.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {sortedStatistics.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        MP
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Goals
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Assists
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Yellow
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Red
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Handballs
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedStatistics.map((stat, index) => (
                      <tr key={stat.player_id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full text-sm">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {stat.player.first_name} {stat.player.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">@{stat.player.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {stat.player.team?.name || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.matches_played}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, matches_played: Number(e.target.value) }))
                              }
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm text-gray-900 dark:text-gray-100">{stat.matches_played}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.goals}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, goals: Number(e.target.value) }))}
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">{stat.goals}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.assists}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, assists: Number(e.target.value) }))}
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{stat.assists}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.yellow_cards}
                              onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, yellow_cards: Number(e.target.value) }))
                              }
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                              {stat.yellow_cards}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.red_cards}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, red_cards: Number(e.target.value) }))}
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">{stat.red_cards}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <input
                              type="number"
                              min="0"
                              value={editForm.handballs}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, handballs: Number(e.target.value) }))}
                              className="w-16 p-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                            />
                          ) : (
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                              {stat.handballs}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {editingPlayer === stat.player_id ? (
                            <div className="flex space-x-2 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditPlayer(stat)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <activeTabConfig.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Statistics Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">No player statistics match your search criteria.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="card p-6 text-center">
              <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Top Performer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedStatistics.length > 0
                  ? `${sortedStatistics[0].player.first_name} ${sortedStatistics[0].player.last_name}`
                  : "No data"}
              </p>
            </div>

            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Active Players</h3>
              <p className="text-gray-600 dark:text-gray-400">{statistics.length} players</p>
            </div>

            <div className="card p-6 text-center">
              <Target className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Total {activeTabConfig.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedStatistics.reduce((total, stat) => total + stat[activeTab], 0)}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminStatisticsPage
