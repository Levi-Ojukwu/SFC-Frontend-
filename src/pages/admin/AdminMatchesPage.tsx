"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../../components/Layout"
import { Calendar, Plus, Edit, Trash2, Trophy, AlertTriangle, Clock, Play } from "lucide-react"
import { matchesAPI, teamsAPI } from "../../lib/api"
import toast from "react-hot-toast"

interface Match {
  id: number
  homeTeam: { id: number; name: string }
  awayTeam: { id: number; name: string }
  home_team_score: number
  away_team_score: number
  match_date: string
  is_played: boolean
  is_live: boolean
  created_at: string
}

interface Team {
  id: number
  name: string
}

interface MatchFormData {
  home_team_id: number | null
  away_team_id: number | null
  match_date: string
  match_time: string
}

interface ScoreUpdateData {
  home_team_score: number
  away_team_score: number
  goal_scorers: Array<{
    player_id: number
    team_id: number
    goals: number
  }>
  assists: Array<{
    player_id: number
    team_id: number
    assists: number
  }>
  yellow_cards: Array<{
    player_id: number
    team_id: number
    count: number
  }>
  red_cards: Array<{
    player_id: number
    team_id: number
    count: number
  }>
  handballs: Array<{
    player_id: number
    team_id: number
    count: number
  }>
}

const AdminMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "live" | "completed">("all")

  const [matchForm, setMatchForm] = useState<MatchFormData>({
    home_team_id: null,
    away_team_id: null,
    match_date: new Date().toISOString().split("T")[0],
    match_time: "15:00",
  })

  const [scoreForm, setScoreForm] = useState<ScoreUpdateData>({
    home_team_score: 0,
    away_team_score: 0,
    goal_scorers: [],
    assists: [],
    yellow_cards: [],
    red_cards: [],
    handballs: [],
  })

  useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await matchesAPI.getMatches()
      setMatches(response.data.data)
    } catch (error) {
      toast.error("Failed to load matches")
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

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!matchForm.home_team_id || !matchForm.away_team_id) {
      toast.error("Please select both teams")
      return
    }

    if (matchForm.home_team_id === matchForm.away_team_id) {
      toast.error("Home and away teams must be different")
      return
    }

    try {
      const matchDateTime = `${matchForm.match_date} ${matchForm.match_time}:00`
      await matchesAPI.createMatch({
        home_team_id: matchForm.home_team_id,
        away_team_id: matchForm.away_team_id,
        match_date: matchDateTime,
      })

      toast.success("Match created successfully")
      setShowCreateModal(false)
      setMatchForm({
        home_team_id: null,
        away_team_id: null,
        match_date: new Date().toISOString().split("T")[0],
        match_time: "15:00",
      })
      fetchMatches()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create match")
    }
  }

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMatch) return

    try {
      await matchesAPI.updateMatchScore(selectedMatch.id, {
        home_team_score: scoreForm.home_team_score,
        away_team_score: scoreForm.away_team_score,
        is_played: true,
        statistics: {
          goal_scorers: scoreForm.goal_scorers,
          assists: scoreForm.assists,
          yellow_cards: scoreForm.yellow_cards,
          red_cards: scoreForm.red_cards,
          handballs: scoreForm.handballs,
        },
      })

      toast.success("Match score updated successfully! League table will be automatically updated.")
      setShowScoreModal(false)
      setSelectedMatch(null)
      setScoreForm({
        home_team_score: 0,
        away_team_score: 0,
        goal_scorers: [],
        assists: [],
        yellow_cards: [],
        red_cards: [],
        handballs: [],
      })
      fetchMatches()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update match score")
    }
  }

  const handleDeleteMatch = async (matchId: number) => {
    if (window.confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      try {
        await matchesAPI.deleteMatch(matchId)
        toast.success("Match deleted successfully")
        fetchMatches()
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete match")
      }
    }
  }

  const filteredMatches = matches.filter((match) => {
    if (activeTab === "upcoming") return !match.is_played && !match.is_live
    if (activeTab === "live") return match.is_live
    if (activeTab === "completed") return match.is_played
    return true
  })

  const openScoreModal = (match: Match) => {
    setSelectedMatch(match)
    setScoreForm({
      home_team_score: match.home_team_score || 0,
      away_team_score: match.away_team_score || 0,
      goal_scorers: [],
      assists: [],
      yellow_cards: [],
      red_cards: [],
      handballs: [],
    })
    setShowScoreModal(true)
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Match Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create fixtures, update scores, and manage match statistics
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-6 py-3 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Match</span>
              </button>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg w-fit">
              {[
                { key: "all", label: "All Matches", count: matches.length },
                { key: "upcoming", label: "Upcoming", count: matches.filter((m) => !m.is_played && !m.is_live).length },
                { key: "live", label: "Live", count: matches.filter((m) => m.is_live).length },
                { key: "completed", label: "Completed", count: matches.filter((m) => m.is_played).length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Matches List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match, index) => (
                <div
                  key={match.id}
                  className={`card p-6 hover:shadow-lg transition-all duration-200 ${
                    match.is_live ? "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      {/* Home Team */}
                      <div className="text-center min-w-[120px]">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{match.homeTeam.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Home</p>
                      </div>

                      {/* Score/VS */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {match.is_played || match.is_live
                            ? `${match.home_team_score} - ${match.away_team_score}`
                            : "VS"}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.is_live
                              ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 animate-pulse"
                              : match.is_played
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {match.is_live ? "LIVE" : match.is_played ? "Completed" : "Upcoming"}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="text-center min-w-[120px]">
                        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{match.awayTeam.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Away</p>
                      </div>
                    </div>

                    {/* Match Details and Actions */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar size={16} />
                        <span className="text-sm">{new Date(match.match_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                        <Clock size={16} />
                        <span className="text-sm">{new Date(match.match_date).toLocaleTimeString()}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {!match.is_played && (
                          <button
                            onClick={() => openScoreModal(match)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                          >
                            <Play size={14} />
                            <span>{match.is_live ? "Update" : "Start"}</span>
                          </button>
                        )}
                        <button
                          onClick={() => openScoreModal(match)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMatch(match.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Matches Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === "all" ? "No matches have been created yet." : `No ${activeTab} matches found.`}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Create Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Create New Match</h3>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Home Team</label>
                <select
                  value={matchForm.home_team_id || ""}
                  onChange={(e) => setMatchForm((prev) => ({ ...prev, home_team_id: Number(e.target.value) || null }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Select Home Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Away Team</label>
                <select
                  value={matchForm.away_team_id || ""}
                  onChange={(e) => setMatchForm((prev) => ({ ...prev, away_team_id: Number(e.target.value) || null }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Select Away Team</option>
                  {teams
                    .filter((team) => team.id !== matchForm.home_team_id)
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Match Date</label>
                <input
                  type="date"
                  value={matchForm.match_date}
                  onChange={(e) => setMatchForm((prev) => ({ ...prev, match_date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Match Time</label>
                <input
                  type="time"
                  value={matchForm.match_time}
                  onChange={(e) => setMatchForm((prev) => ({ ...prev, match_time: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-2 px-4">
                  Create Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Score Update Modal */}
      {showScoreModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl mx-4 my-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Update Match Score: {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
            </h3>
            <form onSubmit={handleUpdateScore} className="space-y-6">
              {/* Score Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {selectedMatch.homeTeam.name} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scoreForm.home_team_score}
                    onChange={(e) => setScoreForm((prev) => ({ ...prev, home_team_score: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {selectedMatch.awayTeam.name} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scoreForm.away_team_score}
                    onChange={(e) => setScoreForm((prev) => ({ ...prev, away_team_score: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">Important:</p>
                    <p>When you update this match score, the system will automatically:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Update the league table standings</li>
                      <li>Calculate points, goal difference, and match statistics</li>
                      <li>Update team records (wins, draws, losses)</li>
                      <li>Send notifications to relevant players</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowScoreModal(false)
                    setSelectedMatch(null)
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-2 px-4">
                  Update Score & Statistics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default AdminMatchesPage
