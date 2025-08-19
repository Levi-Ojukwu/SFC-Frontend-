"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import { Target, Users, AlertTriangle, Hand, Trophy } from "lucide-react"
import { statisticsAPI } from "../lib/api"
import toast from "react-hot-toast"

interface PlayerStat {
  id: number
  username: string
  team: string | null
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  handballs: number
}

type StatType = "goals" | "assists" | "yellow_cards" | "red_cards" | "handballs"

const StatisticsPage: React.FC = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<StatType>("goals")

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await statisticsAPI.getStatistics()
      setPlayerStats(response.data.data)
    } catch (error) {
      toast.error("Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  const getStatValue = (player: PlayerStat, statType: StatType) => {
    return player[statType]
  }

  const getSortedPlayers = (statType: StatType) => {
    return [...playerStats]
      .filter((player) => getStatValue(player, statType) > 0)
      .sort((a, b) => getStatValue(b, statType) - getStatValue(a, statType))
  }

  const statTabs = [
    {
      key: "goals" as StatType,
      label: "Goals",
      icon: Target,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      key: "assists" as StatType,
      label: "Assists",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      key: "yellow_cards" as StatType,
      label: "Yellow Cards",
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      key: "red_cards" as StatType,
      label: "Red Cards",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      key: "handballs" as StatType,
      label: "Handballs",
      icon: Hand,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ]

  const activeTabConfig = statTabs.find((tab) => tab.key === activeTab)!
  const sortedPlayers = getSortedPlayers(activeTab)

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Player Statistics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View detailed statistics for all players across different categories
            </p>
          </motion.div>

          {/* Statistics Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
            transition={{ duration: 0.6, delay: 0.2 }}
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

            <div className="p-6">
              {sortedPlayers.length > 0 ? (
                <div className="space-y-4">
                  {sortedPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-full">
                          {index + 1}
                        </div>

                        {/* Player Info */}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">@{player.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {player.team || "No Team Assigned"}
                          </p>
                        </div>
                      </div>

                      {/* Stat Value */}
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${activeTabConfig.color}`}>
                          {getStatValue(player, activeTab)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {activeTab.replace("_", " ")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <activeTabConfig.icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No {activeTabConfig.label} Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No players have recorded any {activeTabConfig.label.toLowerCase()} yet.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <div className="card p-6 text-center">
              <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Top Performer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedPlayers.length > 0 ? `@${sortedPlayers[0].username}` : "No data"}
              </p>
            </div>

            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Active Players</h3>
              <p className="text-gray-600 dark:text-gray-400">{sortedPlayers.length} players</p>
            </div>

            <div className="card p-6 text-center">
              <Target className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Total {activeTabConfig.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {sortedPlayers.reduce((total, player) => total + getStatValue(player, activeTab), 0)}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default StatisticsPage
