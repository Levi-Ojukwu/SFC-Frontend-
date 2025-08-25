/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import Layout from "../../components/Layout";
import {
	Users,
	Trophy,
	Calendar,
	CreditCard,
	CheckCircle,
	XCircle,
	TrendingUp,
	UserCheck,
	Bell,
	Plus,
	Eye,
	AlertTriangle,
	Target,
	Shield,
} from "lucide-react";
import { dashboardAPI, adminAPI, notificationsAPI } from "../../lib/api";
import toast from "react-hot-toast";

// Define a more specific Match interface for AdminDashboard
// interface Match {
// 	id: number;
// 	homeTeam: { id: number; name: string } | null; // Allow null for safety
// 	awayTeam: { id: number; name: string } | null; // Allow null for safety
// 	home_team_score: number;
// 	away_team_score: number;
// 	match_date: string;
// 	is_played: boolean;
// }

interface AdminDashboardData {
	counts: {
		users: number;
		verified_users: number;
		unverified_users: number;
		teams: number;
		matches: number;
		pending_payments: number;
		total_payments: number;
		live_matches: number;
	};
	recent_registrations: any[];
	pending_payments: any[];
	verified_payments: any[];
	upcoming_matches: any[];
	live_matches: any[];
	recent_matches: any[];
	notifications: any[];
	unread_notifications_count: number;
	top_scorers: any[];
}

const AdminDashboard: React.FC = () => {
	const { user } = useAuth();
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
	});
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"overview" | "users" | "payments" | "matches"
	>("overview");

	useEffect(() => {
		fetchDashboardData();
		fetchNotifications();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const response = await adminAPI.getDashboardStats();
			setDashboardData(response.data.data);
		} catch (error: any) {
			console.error("Failed to load admin dashboard data:", error);
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const fetchNotifications = async () => {
		try {
			const response = await notificationsAPI.getNotifications();
			if (dashboardData) {
				setDashboardData((prev) => ({
					...prev!,
					notifications: response.data.data,
				}));
			}
		} catch (error) {
			console.error("Failed to load notifications:", error);
		}
	};

	const handleVerifyUser = async (userId: number) => {
		try {
			await adminAPI.verifyUser(userId);
			toast.success("User verified successfully");
			fetchDashboardData();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to verify user");
		}
	};

	const handleUnverifyUser = async (userId: number) => {
		try {
			await adminAPI.unverifyUser(userId);
			toast.success("User unverified successfully");
			fetchDashboardData();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to unverify user");
		}
	};

	const handleVerifyPayment = async (paymentId: number) => {
		try {
			await adminAPI.verifyPayment(paymentId);
			toast.success("Payment verified successfully");
			fetchDashboardData();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to verify payment");
		}
	};

	const handleRejectPayment = async (paymentId: number) => {
		const reason = prompt("Enter rejection reason (optional):");
		try {
			await adminAPI.rejectPayment(paymentId, reason || undefined);
			toast.success("Payment rejected successfully");
			fetchDashboardData();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to reject payment");
		}
	};

	const markNotificationAsRead = async (notificationId: number) => {
		try {
			await notificationsAPI.markAsRead(notificationId);
			fetchNotifications();
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
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

	return (
		<Layout>
			<div className='min-h-screen p-6'>
				<div className='max-w-7xl mx-auto'>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='mb-8'>
						<div className='flex items-center justify-between'>
							<div>
								<h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
									Admin Dashboard
								</h1>
								<p className='text-gray-600 dark:text-gray-400'>
									Manage Special FC operations, members, and activities
								</p>
							</div>

							{/* Notifications */}
							{/* <div className="relative">
                <button className="p-3 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 relative">
                  <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  {dashboardData.unread_notifications_count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {dashboardData.unread_notifications_count}
                    </span>
                  )}
                </button>
              </div> */}
						</div>
					</motion.div>

					{/* Stats Cards */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<Users className='w-8 h-8 text-primary-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.users}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Total Users
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<UserCheck className='w-8 h-8 text-green-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.verified_users}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Verified
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<AlertTriangle className='w-8 h-8 text-yellow-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.unverified_users}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Pending
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<Trophy className='w-8 h-8 text-secondary-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.teams}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Teams
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<Calendar className='w-8 h-8 text-primary-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.matches}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Matches
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<Shield className='w-8 h-8 text-red-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.live_matches}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>Live</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.7 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<CreditCard className='w-8 h-8 text-yellow-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.pending_payments}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Pending Pay
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
							className='card p-4 xl:col-span-1'>
							<div className='text-center'>
								<CheckCircle className='w-8 h-8 text-green-500 mx-auto mb-2' />
								<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
									{dashboardData.counts.total_payments}
								</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>
									Total Pay
								</p>
							</div>
						</motion.div>
					</div>

					{/* Tab Navigation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.9 }}
						className='mb-8'>
						<div className='flex space-x-1 bg-gray-100 dark:bg-dark-800 p-1 rounded-lg w-fit'>
							{[
								{ key: "overview", label: "Overview" },
								{ key: "users", label: "User Management" },
								{ key: "payments", label: "Payment Verification" },
								{ key: "matches", label: "Match Management" },
							].map((tab) => (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key as any)}
									className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
										activeTab === tab.key
											? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
											: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
									}`}>
									{tab.label}
								</button>
							))}
						</div>
					</motion.div>

					{/* Tab Content */}
					<div className='grid lg:grid-cols-3 gap-8'>
						{/* Main Content */}
						<div className='lg:col-span-2 space-y-8'>
							{activeTab === "overview" && (
								<>
									{/* Recent Registrations */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 1.0 }}
										className='card p-6'>
										<div className='flex items-center justify-between mb-4'>
											<h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
												Recent Registrations
											</h2>
											<button
												onClick={() => setActiveTab("users")}
												className='text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium'>
												View All
											</button>
										</div>
										{dashboardData.recent_registrations.length > 0 ? (
											<div className='space-y-4'>
												{dashboardData.recent_registrations
													.slice(0, 5)
													.map((user, index) => (
														<div
															key={index}
															className='flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg'>
															<div>
																<p className='font-medium text-gray-900 dark:text-gray-100'>
																	{user.first_name} {user.last_name}
																</p>
																<p className='text-sm text-gray-600 dark:text-gray-400'>
																	@{user.username}
																</p>
																<p className='text-xs text-gray-500 dark:text-gray-500'>
																	Registered:{" "}
																	{new Date(
																		user.created_at,
																	).toLocaleDateString()}
																</p>
															</div>
															<div className='flex items-center space-x-2'>
																{user.is_verified ? (
																	<div className='flex items-center space-x-2'>
																		<span className='flex items-center space-x-1 text-green-600 dark:text-green-400'>
																			<CheckCircle size={16} />
																			<span className='text-sm'>Verified</span>
																		</span>
																		<button
																			onClick={() =>
																				handleUnverifyUser(user.id)
																			}
																			className='btn-secondary px-3 py-1 text-xs'>
																			Unverify
																		</button>
																	</div>
																) : (
																	<button
																		onClick={() => handleVerifyUser(user.id)}
																		className='btn-primary px-3 py-1 text-sm'>
																		Verify
																	</button>
																)}
															</div>
														</div>
													))}
											</div>
										) : (
											<p className='text-gray-600 dark:text-gray-400 text-center py-8'>
												No recent registrations
											</p>
										)}
									</motion.div>

									{/* Live Matches */}
									{dashboardData?.live_matches?.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.6, delay: 1.1 }}
											className='card p-6'>
											<h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
												Live Matches
											</h2>
											<div className='space-y-4'>
												{dashboardData.live_matches.map((match, index) => (
													<div
														key={index}
														className='flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
														<div className='flex items-center space-x-4'>
															<div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
															<div>
																<p className='font-medium text-gray-900 dark:text-gray-100'>
																	{match.homeTeam?.name} vs{" "}
																	{match.awayTeam?.name}
																</p>
																<p className='text-sm text-gray-600 dark:text-gray-400'>
																	Started:{" "}
																	{new Date(
																		match.match_date,
																	).toLocaleTimeString()}
																</p>
															</div>
														</div>
														<div className='text-center'>
															<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
																{match.home_team_score} -{" "}
																{match.away_team_score}
															</p>
															<span className='text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full'>
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
									className='card p-6'>
									<h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
										User Management
									</h2>
									{dashboardData.recent_registrations.length > 0 ? (
										<div className='space-y-4'>
											{dashboardData.recent_registrations.map((user, index) => (
												<div
													key={index}
													className='flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg'>
													<div>
														<p className='font-medium text-gray-900 dark:text-gray-100'>
															{user.first_name} {user.last_name}
														</p>
														<p className='text-sm text-gray-600 dark:text-gray-400'>
															@{user.username}
														</p>
													</div>
													<div className='flex items-center space-x-2'>
														{user.is_verified ? (
															<button
																onClick={() => handleUnverifyUser(user.id)}
																className='btn-secondary px-3 py-1 text-xs'>
																Unverify
															</button>
														) : (
															<button
																onClick={() => handleVerifyUser(user.id)}
																className='btn-primary px-3 py-1 text-sm'>
																Verify
															</button>
														)}
													</div>
												</div>
											))}
										</div>
									) : (
										<p className='text-gray-600 dark:text-gray-400 text-center py-8'>
											No users found
										</p>
									)}
								</motion.div>
							)}

							{activeTab === "payments" && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 1.0 }}
									className='card p-6'>
									<h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
										Payment Verification
									</h2>
									{dashboardData.pending_payments.length > 0 ? (
										<div className='space-y-4'>
											{dashboardData.pending_payments.map((payment, index) => (
												<div
													key={index}
													className='flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg'>
													<div className='flex-1'>
														<div className='flex items-center space-x-4'>
															<div>
																<p className='font-medium text-gray-900 dark:text-gray-100'>
																	{payment.user.first_name}{" "}
																	{payment.user.last_name}
																</p>
																<p className='text-sm text-gray-600 dark:text-gray-400'>
																	₦{payment.amount} - {payment.payment_type}
																</p>
																<p className='text-xs text-gray-500 dark:text-gray-500'>
																	Submitted:{" "}
																	{new Date(
																		payment.created_at,
																	).toLocaleDateString()}
																</p>
															</div>
														</div>
													</div>
													<div className='flex items-center space-x-2'>
														{payment.payment_proof && (
															<button className='p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'>
																<Eye size={16} />
															</button>
														)}
														<button
															onClick={() => handleVerifyPayment(payment.id)}
															className='btn-primary px-3 py-1 text-sm'>
															Verify
														</button>
														<button
															onClick={() => handleRejectPayment(payment.id)}
															className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'>
															Reject
														</button>
													</div>
												</div>
											))}
										</div>
									) : (
										<p className='text-gray-600 dark:text-gray-400 text-center py-8'>
											No pending payments
										</p>
									)}
								</motion.div>
							)}

							{activeTab === "matches" && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 1.0 }}
									className='card p-6'>
									<h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
										Match Management
									</h2>
									{dashboardData.recent_matches.length > 0 ? (
										<div className='space-y-4'>
											{dashboardData.recent_matches.map((match, index) => (
												<div
													key={index}
													className='flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg'>
													<p className='font-medium text-gray-900 dark:text-gray-100'>
														{match.homeTeam?.name} vs {match.awayTeam?.name}
													</p>
													<p className='text-sm text-gray-600 dark:text-gray-400'>
														{new Date(match.match_date).toLocaleDateString()}
													</p>
												</div>
											))}
										</div>
									) : (
										<p className='text-gray-600 dark:text-gray-400 text-center py-8'>
											No matches available
										</p>
									)}
								</motion.div>
							)}
						</div>

						{/* Sidebar */}
						<div className='space-y-6'>
							{/* Notifications */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 1.2 }}
								className='card p-6'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
										Recent Notifications
									</h3>
									<span className='bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full'>
										{dashboardData.unread_notifications_count} new
									</span>
								</div>
								{dashboardData?.notifications?.length > 0 ? (
									<div className='space-y-3 max-h-64 overflow-y-auto'>
										{dashboardData.notifications
											.slice(0, 5)
											.map((notification, index) => (
												<div
													key={index}
													className={`p-3 rounded-lg cursor-pointer transition-colors ${
														notification.read_at
															? "bg-gray-50 dark:bg-dark-700"
															: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
													}`}
													onClick={() =>
														!notification.read_at &&
														markNotificationAsRead(notification.id)
													}>
													<p className='font-medium text-gray-900 dark:text-gray-100 text-sm'>
														{notification.title}
													</p>
													<p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
														{notification.message}
													</p>
													<p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
														{new Date(
															notification.created_at,
														).toLocaleDateString()}
													</p>
												</div>
											))}
									</div>
								) : (
									<p className='text-gray-600 dark:text-gray-400 text-sm'>
										No notifications
									</p>
								)}
							</motion.div>

							{/* Top Scorers */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 1.3 }}
								className='card p-6'>
								<h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-4'>
									Top Scorers
								</h3>
								{dashboardData.top_scorers.length > 0 ? (
									<div className='space-y-3'>
										{dashboardData.top_scorers
											.slice(0, 5)
											.map((scorer, index) => (
												<div
													key={index}
													className='flex items-center justify-between'>
													<div className='flex items-center space-x-3'>
														<div className='w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
															{index + 1}
														</div>
														<div>
															<p className='font-medium text-gray-900 dark:text-gray-100 text-sm'>
																{scorer.name}
															</p>
															<p className='text-xs text-gray-600 dark:text-gray-400'>
																{scorer.team}
															</p>
														</div>
													</div>
													<div className='flex items-center space-x-2'>
														<Target className='w-4 h-4 text-primary-600 dark:text-primary-400' />
														<span className='font-bold text-primary-600 dark:text-primary-400'>
															{scorer.goals}
														</span>
													</div>
												</div>
											))}
									</div>
								) : (
									<p className='text-gray-600 dark:text-gray-400 text-sm'>
										No statistics available
									</p>
								)}
							</motion.div>

							{/* Quick Actions */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6, delay: 1.4 }}
								className='card p-6'>
								<h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-4'>
									Quick Actions
								</h3>
								<div className='space-y-3'>
									<button
										onClick={() => setActiveTab("users")}
										className='w-full btn-primary py-2 text-sm flex items-center justify-center space-x-2'>
										<Users size={16} />
										<span>Manage Users</span>
									</button>
									<button
										onClick={() => (window.location.href = "/admin/matches")}
										className='w-full btn-secondary py-2 text-sm flex items-center justify-center space-x-2'>
										<Plus size={16} />
										<span>Add Match</span>
									</button>
									<button
										onClick={() => (window.location.href = "/admin/reports")}
										className='w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors'>
										<TrendingUp size={16} />
										<span>View Reports</span>
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

export default AdminDashboard;
