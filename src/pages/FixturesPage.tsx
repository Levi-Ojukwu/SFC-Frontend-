/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Calendar, Clock, Trophy, MapPin } from "lucide-react";
import { matchesAPI } from "../lib/api";
import toast from "react-hot-toast";

interface Fixture {
	id: number;
	homeTeam?: { id: number; name: string };
	awayTeam?: { id: number; name: string };
	match_date: string;
	is_played: boolean;
}

const FixturesPage: React.FC = () => {
	const [fixtures, setFixtures] = useState<Fixture[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFixtures();
	}, []);

	const fetchFixtures = async () => {
		try {
			const response = await matchesAPI.getFixtures();
			setFixtures(response.data.data);
		} catch (error) {
			toast.error("Failed to load fixtures");
		} finally {
			setLoading(false);
		}
	};

	const groupFixturesByDate = (fixtures: Fixture[]) => {
		const grouped: { [key: string]: Fixture[] } = {};
		fixtures.forEach((fixture) => {
			if (!fixture.match_date) return;
			const date = new Date(fixture.match_date).toDateString();
			grouped[date] = grouped[date] || [];
			grouped[date].push(fixture);
		});
		return grouped;
	};

	const groupedFixtures = groupFixturesByDate(fixtures);

	const isToday = (date: string) => {
		return new Date(date).toDateString() === new Date().toDateString();
	};

	const isTomorrow = (date: string) => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return new Date(date).toDateString() === tomorrow.toDateString();
	};

	const formatDateHeader = (dateString: string) => {
		if (isToday(dateString)) return "Today";
		if (isTomorrow(dateString)) return "Tomorrow";
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
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
						<h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
							Match Fixtures
						</h1>
						<p className='text-gray-600 dark:text-gray-400'>
							Upcoming matches scheduled for Special FC teams
						</p>
					</motion.div>

					{/* Fixtures */}
					{Object.keys(groupedFixtures).length > 0 ? (
						<div className='space-y-8'>
							{Object.entries(groupedFixtures)
								.sort(
									([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
								)
								.map(([date, dateFixtures], dateIndex) => (
									<motion.div
										key={date}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: dateIndex * 0.1 }}>
										{/* Date Header */}
										<div className='flex items-center space-x-4 mb-6'>
											<div className='flex items-center space-x-2'>
												<Calendar className='w-6 h-6 text-primary-600 dark:text-primary-400' />
												<h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
													{formatDateHeader(date)}
												</h2>
											</div>
											<div className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></div>
										</div>

										{/* Fixtures for this date */}
										<div className='grid gap-4'>
											{dateFixtures.map((fixture, index) => (
												<motion.div
													key={fixture.id}
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.4, delay: index * 0.1 }}
													className='card p-6 hover:shadow-lg transition-all duration-200'>
													<div className='flex items-center justify-between'>
														<div className='flex items-center space-x-8'>
															{/* Home Team */}
															<div className='text-center min-w-[120px]'>
																<div className='w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-2'>
																	<Trophy className='w-6 h-6 text-white' />
																</div>
																<p className='font-semibold text-gray-900 dark:text-gray-100'>
																	{fixture.homeTeam?.name ?? "Unknown Team"}
																</p>
																<p className='text-sm text-gray-600 dark:text-gray-400'>
																	Home
																</p>
															</div>

															{/* VS */}
															<div className='text-center'>
																<div className='text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2'>
																	VS
																</div>
																<div className='px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium'>
																	Upcoming
																</div>
															</div>

															{/* Away Team */}
															<div className='text-center min-w-[120px]'>
																<div className='w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-2'>
																	<Trophy className='w-6 h-6 text-white' />
																</div>
																<p className='font-semibold text-gray-900 dark:text-gray-100'>
																	{fixture.awayTeam?.name ?? "Unknown Team"}
																</p>
																<p className='text-sm text-gray-600 dark:text-gray-400'>
																	Away
																</p>
															</div>
														</div>

														{/* Match Details */}
														<div className='text-right space-y-2'>
															<div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
																<Clock size={16} />
																<span className='text-sm font-medium'>
																	{new Date(
																		fixture.match_date,
																	).toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
																</span>
															</div>
															<div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
																<MapPin size={16} />
																<span className='text-sm'>
																	Special FC Ground
																</span>
															</div>
														</div>
													</div>
												</motion.div>
											))}
										</div>
									</motion.div>
								))}
						</div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='text-center py-12'>
							<Calendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
							<h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
								No Upcoming Fixtures
							</h3>
							<p className='text-gray-600 dark:text-gray-400'>
								No matches have been scheduled yet. Check back later for
								updates.
							</p>
						</motion.div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default FixturesPage;
