"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import { Calendar, Clock, Trophy, Users } from "lucide-react"
import { matchesAPI } from "../lib/api"
import toast from "react-hot-toast"

interface Match {
  id: number
  home_team?: { id: number; name: string }
  away_team?: { id: number; name: string }
  home_team_score: number
  away_team_score: number
  match_date: string
  is_played: boolean
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "played" | "upcoming">("all")

  useEffect(() => {
    fetchMatches()
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

  const filteredMatches = matches.filter((match) => {
    if (filter === "played") return match.is_played
    if (filter === "upcoming") return !match.is_played
    return true
  })

  const getMatchResult = (match: Match) => {
    if (!match.is_played) return "vs"
    return `${match.home_team_score} - ${match.away_team_score}`
  }

  const getMatchStatus = (match: Match) => {
    if (match.is_played) return "Played"
    const matchDate = new Date(match.match_date)
    const now = new Date()
    return matchDate > now ? "Upcoming" : "Live"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Matches</h1>
            <p className="text-gray-600 dark:text-gray-400">View all matches and results</p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg w-fit">
              {[
                { key: "all", label: "All Matches" },
                { key: "played", label: "Results" },
                { key: "upcoming", label: "Fixtures" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Matches Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      {/* Home Team */}
                      <div className="text-center min-w-[120px]">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{match.home_team?.name ?? "Unknown Team"}</p>
                      </div>

                      {/* Score/VS */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {getMatchResult(match)}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.is_played
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {getMatchStatus(match)}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="text-center min-w-[120px]">
                        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{match.away_team?.name ?? "Unknown Team"}</p>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar size={16} />
                        <span className="text-sm">{new Date(match.match_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span className="text-sm">{new Date(match.match_date).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Matches Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === "all"
                    ? "No matches have been scheduled yet."
                    : filter === "played"
                      ? "No matches have been played yet."
                      : "No upcoming matches scheduled."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default MatchesPage
