/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import Layout from "../../components/Layout";
import {
	Trophy,
	Calendar,
	Target,
	Users,
	CreditCard,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Clock,
	Activity,
} from "lucide-react";
import { dashboardAPI } from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define a more specific Match interface
// interface Match {
// 	id: number;
// 	homeTeam: { id: number; name: string } | null; // Allow null for safety
// 	awayTeam: { id: number; name: string } | null; // Allow null for safety
// 	home_team_score: number;
// 	away_team_score: number;
// 	match_date: string;
// 	is_played: boolean;
// }

interface UserDashboardData {
  user_stats: {
    goals: number
    assists: number
    yellow_cards: number
    red_cards: number
    matches_played: number
    team_position: number | null
  }
  team_info: {
    id: number
    name: string
    position: number
    points: number
    matches_played: number
    wins: number
    draws: number
    losses: number
    goals_for: number
    goals_against: number
    goal_difference: number
  } | null
  upcoming_matches: Array<{
    id: number
    homeTeam: { name: string }
    awayTeam: { name: string }
    match_date: string
    is_home: boolean
  }>
  recent_matches: Array<{
    id: number
    homeTeam: { name: string }
    awayTeam: { name: string }
    home_team_score: number
    away_team_score: number
    match_date: string
    is_home: boolean
    result: "win" | "draw" | "loss"
  }>
  payment_status: {
    registration_paid: boolean
    monthly_dues_current: boolean
    pending_payments: number
    total_paid: number
  }
  notifications: Array<{
    id: number
    title: string
    message: string
    type: string
    read_at: string | null
    created_at: string
  }>
  league_top_scorers: Array<{
    name: string
    team: string
    goals: number
  }>
}

const UserDashboard: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const response = await dashboardAPI.getDashboard();
			setDashboardData(response.data.data);
		} catch (error: any) {
			console.error("Failed to load dashboard data:", error); // Log the error for debugging
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<Layout>
				<div className='min-h-screen flex items-center justify-center'>
					<div className='loading-spinner'></div>
				</div>
			</Layout>
		);
	}

	if (!dashboardData) {
		return (
			<Layout>
				<div className='min-h-screen flex items-center justify-center'>
					<div className='text-center'>
						<XCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
						<h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
							Failed to Load Dashboard
						</h2>
						<button
							onClick={fetchDashboardData}
							className='btn-primary'>
							Try Again
						</button>
					</div>
				</div>
			</Layout>
		);
	}

	const getProgressColor = (percentage: number) => {
		if (percentage <= 25) return "bg-green-500";
		if (percentage <= 50) return "bg-yellow-500";
		if (percentage <= 75) return "bg-orange-500";
		return "bg-red-500";
	};

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
                  Welcome back, {user?.first_name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {dashboardData.team_info
                    ? `${dashboardData.team_info.name} • Position ${dashboardData.team_info.position} in league`
                    : "Not assigned to a team yet"}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.is_verified
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  {user?.is_verified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified Player
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-1" />
                      Verification Pending
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goals Scored</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {dashboardData.user_stats.goals}
                  </p>
                </div>
                <Target className="w-12 h-12 text-green-500" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assists</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {dashboardData.user_stats.assists}
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matches Played</p>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {dashboardData.user_stats.matches_played}
                  </p>
                </div>
                <Activity className="w-12 h-12 text-primary-500" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yellow Cards</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {dashboardData.user_stats.yellow_cards}
                  </p>
                </div>
                <AlertTriangle className="w-12 h-12 text-yellow-500" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Red Cards</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {dashboardData.user_stats.red_cards}
                  </p>
                </div>
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Team Performance */}
              {dashboardData.team_info && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="card p-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Trophy className="w-6 h-6 text-primary-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {dashboardData.team_info.name} Performance
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {dashboardData.team_info.position}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">League Position</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {dashboardData.team_info.points}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {dashboardData.team_info.wins}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Wins</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                        {dashboardData.team_info.goal_difference > 0 ? "+" : ""}
                        {dashboardData.team_info.goal_difference}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Goal Diff</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recent Matches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Matches</h2>
                {dashboardData.recent_matches.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_matches.slice(0, 5).map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              match.result === "win"
                                ? "bg-green-500"
                                : match.result === "draw"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {match.homeTeam.name} vs {match.awayTeam.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(match.match_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            {match.home_team_score} - {match.away_team_score}
                          </p>
                          <p
                            className={`text-sm font-medium capitalize ${
                              match.result === "win"
                                ? "text-green-600 dark:text-green-400"
                                : match.result === "draw"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {match.result}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No recent matches</p>
                )}
              </motion.div>

              {/* Payment Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Payment Status</h2>
                  <CreditCard className="w-6 h-6 text-primary-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Registration Fee</span>
                      {dashboardData.payment_status.registration_paid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {dashboardData.payment_status.registration_paid ? "Paid" : "Pending"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Dues</span>
                      {dashboardData.payment_status.monthly_dues_current ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {dashboardData.payment_status.monthly_dues_current ? "Current" : "Due"}
                    </p>
                  </div>
                </div>
                {dashboardData.payment_status.pending_payments > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You have {dashboardData.payment_status.pending_payments} pending payment
                      {dashboardData.payment_status.pending_payments !== 1 ? "s" : ""} awaiting verification.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(match.match_date).toLocaleDateString()} at{" "}
                          {new Date(match.match_date).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                          {match.is_home ? "Home" : "Away"} match
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No upcoming matches</p>
                )}
              </motion.div>

              {/* League Top Scorers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">League Top Scorers</h3>
                {dashboardData?.league_top_scorers && dashboardData.league_top_scorers.length > 0 ?(
                  <div className="space-y-3">
                    {dashboardData.league_top_scorers.slice(0, 5).map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{scorer.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{scorer.team}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="font-bold text-green-600 dark:text-green-400 text-sm">{scorer.goals}</span>
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
                transition={{ duration: 0.6, delay: 1.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/payment")}
                    className="w-full btn-primary py-2 text-sm flex items-center justify-center space-x-2"
                  >
                    <CreditCard size={16} />
                    <span>Make Payment</span>
                  </button>
                  <button
                    onClick={() => navigate("/matches")}
                    className="w-full btn-secondary py-2 text-sm flex items-center justify-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>View Matches</span>
                  </button>
                  <button
                    onClick={() => navigate("/table")}
                    className="w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Trophy size={16} />
                    <span>League Table</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>

	);
};

export default UserDashboard;
