"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import { Users, Search, Filter, Trophy, Target, Award } from "lucide-react"
import { usersAPI } from "../lib/api"
import toast from "react-hot-toast"

interface Player {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
  is_verified: boolean
  team: {
    id: number
    name: string
  } | null
}

const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTeam, setFilterTeam] = useState<string>("all")

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await usersAPI.getPlayers()
      setPlayers(response.data.data)
    } catch (error) {
      toast.error("Failed to load players")
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.username.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam = filterTeam === "all" || player.team?.name === filterTeam

    return matchesSearch && matchesTeam
  })

  const uniqueTeams = Array.from(new Set(players.map((player) => player.team?.name).filter(Boolean)))

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Players</h1>
            <p className="text-gray-600 dark:text-gray-400">All registered players across Special FC teams</p>
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
                  {uniqueTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPlayers.length} of {players.length} players
            </div>
          </motion.div>

          {/* Players Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card p-6 hover:shadow-lg transition-all duration-200"
                >
                  {/* Player Avatar */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {player.first_name} {player.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{player.username}</p>
                  </div>

                  {/* Player Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Team:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {player.team?.name || "Not Assigned"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          player.is_verified
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {player.is_verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Team Badge */}
                  {player.team && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">{player.team.name}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Players Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filterTeam !== "all"
                    ? "No players match your search criteria."
                    : "No players have been registered yet."}
                </p>
              </div>
            )}
          </motion.div>

          {/* Statistics Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
          >
            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{players.length}</h3>
              <p className="text-gray-600 dark:text-gray-400">Total Players</p>
            </div>

            <div className="card p-6 text-center">
              <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {players.filter((p) => p.is_verified).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Verified Players</p>
            </div>

            <div className="card p-6 text-center">
              <Trophy className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{uniqueTeams.length}</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Teams</p>
            </div>

            <div className="card p-6 text-center">
              <Target className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {players.filter((p) => !p.is_verified).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Pending Verification</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default PlayersPage
