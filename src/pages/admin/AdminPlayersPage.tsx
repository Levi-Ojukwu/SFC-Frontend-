"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import { Users, Search, Filter, Trophy, Trash2, UserPlus, UserMinus, Shield, AlertTriangle } from "lucide-react"
import { adminAPI, teamsAPI } from "../../lib/api"
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
  created_at: string
  statistics: {
    goals: number
    assists: number
    yellow_cards: number
    red_cards: number
  }
}

interface Team {
  id: number
  name: string
  players_count: number
}

const AdminPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showTeamModal, setShowTeamModal] = useState(false)

  useEffect(() => {
    fetchPlayers()
    fetchTeams()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await adminAPI.getUsers()
      const normalized = response.data.data.map((p: Player) => ({
      ...p,
      statistics: p.statistics || { goals: 0, assists: 0, yellow_cards: 0, red_cards: 0 },
    }))
    setPlayers(normalized)
    } catch (error) {
      toast.error("Failed to load players")
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

  const handleVerifyPlayer = async (playerId: number) => {
    try {
      await adminAPI.verifyUser(playerId)
      toast.success("Player verified successfully")
      fetchPlayers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify player")
    }
  }

  const handleUnverifyPlayer = async (playerId: number) => {
    try {
      await adminAPI.unverifyUser(playerId)
      toast.success("Player unverified successfully")
      fetchPlayers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unverify player")
    }
  }

  const handleAssignToTeam = async (playerId: number, teamId: number) => {
    try {
      await adminAPI.updateUserTeam(playerId, teamId)
      toast.success("Player assigned to team successfully")
      fetchPlayers()
      setShowTeamModal(false)
      setSelectedPlayer(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to assign player to team")
    }
  }

  const handleRemoveFromTeam = async (playerId: number) => {
    try {
      await adminAPI.removeUserFromTeam(playerId)
      toast.success("Player removed from team successfully")
      fetchPlayers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove player from team")
    }
  }

  const handleDeletePlayer = async (playerId: number) => {
    if (window.confirm("Are you sure you want to delete this player? This action cannot be undone.")) {
      try {
        await adminAPI.deleteUser(playerId)
        toast.success("Player deleted successfully")
        fetchPlayers()
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete player")
      }
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.username.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTeam =
      filterTeam === "all" || (filterTeam === "unassigned" && !player.team) || player.team?.name === filterTeam

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && player.is_verified) ||
      (filterStatus === "unverified" && !player.is_verified)

    return matchesSearch && matchesTeam && matchesStatus
  })

  const groupedPlayers = teams.reduce(
    (acc, team) => {
      acc[team.name] = filteredPlayers.filter((player) => player.team?.name === team.name)
      return acc
    },
    {} as Record<string, Player[]>,
  )

  const unassignedPlayers = filteredPlayers.filter((player) => !player.team)

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Player Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all registered players and their team assignments</p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
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

              {/* Status Filter */}
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPlayers.length} of {players.length} players
            </div>
          </motion.div>

          {/* Players by Team */}
          <div className="space-y-8">
            {/* Unassigned Players */}
            {unassignedPlayers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Unassigned Players ({unassignedPlayers.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unassignedPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onVerify={handleVerifyPlayer}
                      onUnverify={handleUnverifyPlayer}
                      onAssignToTeam={(player) => {
                        setSelectedPlayer(player)
                        setShowTeamModal(true)
                      }}
                      onRemoveFromTeam={handleRemoveFromTeam}
                      onDelete={handleDeletePlayer}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Players by Team */}
            {Object.entries(groupedPlayers).map(
              ([teamName, teamPlayers], index) =>
                teamPlayers.length > 0 && (
                  <motion.div
                    key={teamName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Trophy className="w-6 h-6 text-primary-500" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {teamName} ({teamPlayers.length} players)
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamPlayers.map((player) => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          onVerify={handleVerifyPlayer}
                          onUnverify={handleUnverifyPlayer}
                          onAssignToTeam={(player) => {
                            setSelectedPlayer(player)
                            setShowTeamModal(true)
                          }}
                          onRemoveFromTeam={handleRemoveFromTeam}
                          onDelete={handleDeletePlayer}
                        />
                      ))}
                    </div>
                  </motion.div>
                ),
            )}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Players Found</h3>
              <p className="text-gray-600 dark:text-gray-400">No players match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Assignment Modal */}
      {showTeamModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Assign {selectedPlayer.first_name} {selectedPlayer.last_name} to Team
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleAssignToTeam(selectedPlayer.id, team.id)}
                  className="w-full p-3 text-left bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{team.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{team.players_count} players</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowTeamModal(false)
                  setSelectedPlayer(null)
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

// Player Card Component
interface PlayerCardProps {
  player: Player
  onVerify: (id: number) => void
  onUnverify: (id: number) => void
  onAssignToTeam: (player: Player) => void
  onRemoveFromTeam: (id: number) => void
  onDelete: (id: number) => void
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onVerify,
  onUnverify,
  onAssignToTeam,
  onRemoveFromTeam,
  onDelete,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg hover:shadow-md transition-all duration-200">
      {/* Player Info */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-2">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {player.first_name} {player.last_name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">@{player.username}</p>
      </div>

      {/* Status and Team */}
      <div className="space-y-2 mb-4">
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
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Team:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {player.team?.name || "Unassigned"}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="text-center">
          <p className="font-bold text-green-600 dark:text-green-400">{player.statistics.goals}</p>
          <p className="text-gray-600 dark:text-gray-400">Goals</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-blue-600 dark:text-blue-400">{player.statistics.assists}</p>
          <p className="text-gray-600 dark:text-gray-400">Assists</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-yellow-600 dark:text-yellow-400">{player.statistics.yellow_cards}</p>
          <p className="text-gray-600 dark:text-gray-400">Yellow</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-red-600 dark:text-red-400">{player.statistics.red_cards}</p>
          <p className="text-gray-600 dark:text-gray-400">Red</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {/* Verification */}
        <div className="flex space-x-2">
          {player.is_verified ? (
            <button
              onClick={() => onUnverify(player.id)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs transition-colors"
            >
              Unverify
            </button>
          ) : (
            <button
              onClick={() => onVerify(player.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs transition-colors"
            >
              Verify
            </button>
          )}
        </div>

        {/* Team Management */}
        <div className="flex space-x-2">
          <button
            onClick={() => onAssignToTeam(player)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <UserPlus size={12} />
            <span>Assign</span>
          </button>
          {player.team && (
            <button
              onClick={() => onRemoveFromTeam(player.id)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1 px-2 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <UserMinus size={12} />
              <span>Remove</span>
            </button>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(player.id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition-colors flex items-center justify-center space-x-1"
        >
          <Trash2 size={12} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export default AdminPlayersPage
