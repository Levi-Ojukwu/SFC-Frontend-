"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import { Target, Users, AlertTriangle, Hand, Trophy, Plus, Search, Filter, Info, Eye } from "lucide-react"
import { statisticsAPI, teamsAPI, matchesAPI } from "../../lib/api"
import toast from "react-hot-toast"

interface PlayerStatistic {
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
}

interface Team {
  id: number
  name: string
}

interface Match {
  id: number
  home_team: string
  away_team: string
  match_date: string
  is_played: boolean
}

const AdminStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<PlayerStatistic[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"goals" | "assists" | "yellow_cards" | "red_cards" | "handballs">("goals")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [createForm, setCreateForm] = useState({
    user_id: "",
    match_id: "",
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    handballs: 0,
  })

  useEffect(() => {
    fetchStatistics()
    fetchTeams()
    fetchMatches()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await statisticsAPI.getPlayerStatistics()
      console.log("Statistics response:", response.data)

      const data = response.data.data || response.data || []
      setStatistics(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to load player statistics:", error)
      toast.error("Failed to load player statistics")
      setStatistics([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getTeams()
      const data = response.data.data || response.data || []
      setTeams(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load teams:", error)
      setTeams([])
    }
  }

  const fetchMatches = async () => {
    try {
      const response = await matchesAPI.getMatches()
      const data = response.data.data || response.data || []
      setMatches(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load matches:", error)
      setMatches([])
    }
  }

  const handleCreateStatistic = async () => {
    try {
      if (!createForm.user_id || !createForm.match_id) {
        toast.error("Please select both player and match")
        return
      }

      await statisticsAPI.createStatistic({
        user_id: Number.parseInt(createForm.user_id),
        match_id: Number.parseInt(createForm.match_id),
        goals: createForm.goals,
        assists: createForm.assists,
        yellow_cards: createForm.yellow_cards,
        red_cards: createForm.red_cards,
        handballs: createForm.handballs,
      })

      toast.success("Player statistic created successfully")
      setShowCreateModal(false)
      setCreateForm({
        user_id: "",
        match_id: "",
        goals: 0,
        assists: 0,
        yellow_cards: 0,
        red_cards: 0,
        handballs: 0,
      })
      fetchStatistics()
    } catch (error: any) {
      console.error("Create error:", error)
      toast.error(error.response?.data?.message || "Failed to create statistic")
    }
  }

  const handleViewPlayerDetails = async (playerId: number) => {
    try {
      const response = await statisticsAPI.getPlayerDetail(playerId, true)
      console.log("Player details:", response.data)
      // You can implement a modal to show detailed match-by-match statistics here
      toast("Player details loaded - implement modal to display")
    } catch (error: any) {
      console.error("Failed to load player details:", error)
      toast.error("Failed to load player details")
    }
  }

  const filteredStatistics = statistics.filter((stat) => {
    const matchesSearch =
      stat.player?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.player?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.player?.username?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam =
      filterTeam === "all" ||
      (filterTeam === "unassigned" && !stat.player?.team) ||
      stat.player?.team?.name === filterTeam

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Player Statistics Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View aggregated statistics and create new match-specific records
                </p>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Match Statistic</span>
              </button>
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">About Statistics</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  These are aggregated statistics calculated from individual match records. To modify statistics, create
                  new match-specific records using the "Add Match Statistic" button above.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.4 }}
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
                      <tr key={stat.player.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full text-sm">
                            {index + 1}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {stat.player?.first_name || "N/A"} {stat.player?.last_name || ""}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{stat.player?.username || "N/A"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {stat.player?.team?.name || "Unassigned"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{stat.goals}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{stat.assists}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                            {stat.yellow_cards}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">{stat.red_cards}</span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {stat.handballs}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewPlayerDetails(stat.player.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors"
                            title="View Match Details"
                          >
                            <Eye size={16} />
                          </button>
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

          {/* Create Statistic Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Add Match Statistic</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Player</label>
                    <select
                      value={createForm.user_id}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, user_id: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Player</option>
                      {statistics.map((stat) => (
                        <option key={stat.player.id} value={stat.player.id}>
                          {stat.player.first_name} {stat.player.last_name} (@{stat.player.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Match</label>
                    <select
                      value={createForm.match_id}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, match_id: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Match</option>
                      {matches
                        .filter((match) => match.is_played)
                        .map((match) => (
                          <option key={match.id} value={match.id}>
                            {match.home_team} vs {match.away_team} - {new Date(match.match_date).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goals</label>
                      <input
                        type="number"
                        min="0"
                        value={createForm.goals}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, goals: Number(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assists</label>
                      <input
                        type="number"
                        min="0"
                        value={createForm.assists}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, assists: Number(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Yellow Cards
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        value={createForm.yellow_cards}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, yellow_cards: Number(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Red Cards
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        value={createForm.red_cards}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, red_cards: Number(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Handballs</label>
                    <input
                      type="number"
                      min="0"
                      value={createForm.handballs}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, handballs: Number(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button onClick={handleCreateStatistic} className="flex-1 btn-primary">
                    Create Statistic
                  </button>
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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
