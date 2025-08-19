"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "../components/Layout"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { teamsAPI } from "../lib/api"
import toast from "react-hot-toast"

interface Team {
  id: number
  name: string
  matches_played: number
  matches_won: number
  matches_drawn: number
  matches_lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

const TablePage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getTeams()
      setTeams(response.data.data)
    } catch (error) {
      toast.error("Failed to load league table")
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (position <= 2) return <TrendingUp className="w-5 h-5 text-green-500" />
    if (position >= teams.length - 1) return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500"
    if (position <= 2) return "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
    if (position >= teams.length - 1) return "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
    return "bg-white dark:bg-dark-800"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">League Table</h1>
            <p className="text-gray-600 dark:text-gray-400">Current standings for all Special FC teams</p>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-4 mb-6"
          >
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Champion</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Top Positions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Bottom Positions</span>
              </div>
            </div>
          </motion.div>

          {/* League Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card overflow-hidden"
          >
            {/* Table Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4">
              <div className="grid grid-cols-12 gap-4 font-semibold text-sm">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3">Team</div>
                <div className="col-span-1 text-center">MP</div>
                <div className="col-span-1 text-center">W</div>
                <div className="col-span-1 text-center">D</div>
                <div className="col-span-1 text-center">L</div>
                <div className="col-span-1 text-center">GF</div>
                <div className="col-span-1 text-center">GA</div>
                <div className="col-span-1 text-center">GD</div>
                <div className="col-span-1 text-center">Pts</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {teams.length > 0 ? (
                teams.map((team, index) => {
                  const position = index + 1
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${getPositionColor(position)}`}
                    >
                      {/* Position */}
                      <div className="col-span-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 dark:text-gray-100">{position}</span>
                          {getPositionIcon(position)}
                        </div>
                      </div>

                      {/* Team Name */}
                      <div className="col-span-3 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{team.name}</span>
                      </div>

                      {/* Matches Played */}
                      <div className="col-span-1 text-center text-gray-900 dark:text-gray-100">
                        {team.matches_played}
                      </div>

                      {/* Wins */}
                      <div className="col-span-1 text-center text-green-600 dark:text-green-400 font-semibold">
                        {team.matches_won}
                      </div>

                      {/* Draws */}
                      <div className="col-span-1 text-center text-yellow-600 dark:text-yellow-400 font-semibold">
                        {team.matches_drawn}
                      </div>

                      {/* Losses */}
                      <div className="col-span-1 text-center text-red-600 dark:text-red-400 font-semibold">
                        {team.matches_lost}
                      </div>

                      {/* Goals For */}
                      <div className="col-span-1 text-center text-gray-900 dark:text-gray-100">{team.goals_for}</div>

                      {/* Goals Against */}
                      <div className="col-span-1 text-center text-gray-900 dark:text-gray-100">
                        {team.goals_against}
                      </div>

                      {/* Goal Difference */}
                      <div
                        className={`col-span-1 text-center font-semibold ${
                          team.goal_difference > 0
                            ? "text-green-600 dark:text-green-400"
                            : team.goal_difference < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {team.goal_difference > 0 ? "+" : ""}
                        {team.goal_difference}
                      </div>

                      {/* Points */}
                      <div className="col-span-1 text-center">
                        <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{team.points}</span>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Teams Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">No teams have been added to the league yet.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Table Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <strong>MP:</strong> Matches Played
              </div>
              <div>
                <strong>W:</strong> Wins
              </div>
              <div>
                <strong>D:</strong> Draws
              </div>
              <div>
                <strong>L:</strong> Losses
              </div>
              <div>
                <strong>GF:</strong> Goals For
              </div>
              <div>
                <strong>GA:</strong> Goals Against
              </div>
              <div>
                <strong>GD:</strong> Goal Difference
              </div>
              <div>
                <strong>Pts:</strong> Points
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default TablePage
