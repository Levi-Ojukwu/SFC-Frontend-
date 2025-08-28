import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) => api.post("/login", credentials),
  register: (data: any) => api.post("/register", data),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
  resetPassword: (email: string) => api.post("/reset-password", { email }),
}

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get("/dashboard"),
  getAdminDashboard: () => api.get("/admin/dashboard"),
  getStatistics: () => api.get("/dashboard/statistics"),
  getActivities: () => api.get("/dashboard/activities"),
}

// Teams API
export const teamsAPI = {
  getTeams: () => api.get("/teams"),
  getTeam: (id: number) => api.get(`/teams/${id}`),
  createTeam: (data: any) => api.post("/admin/teams/create", data),
  updateTeam: (id: number, data: any) => api.put(`/admin/teams/${id}`, data),
  deleteTeam: (id: number) => api.delete(`/admin/teams/${id}`),
  getTeamPlayers: (id: number) => api.get(`/admin/teams/${id}/players`),
}

// Matches API
export const matchesAPI = {
  getMatches: () => api.get("/matches"),
  getFixtures: () => api.get("/matches/fixtures"),
  getResults: () => api.get("/matches/results"),
  getMatch: (id: number) => api.get(`/matches/${id}`),
  createMatch: (data: any) => api.post("/admin/matches", data),
  startMatch: (id: number) => api.patch(`/admin/matches/${id}/start`),
  updateMatch: (id: number, data: any) => api.put(`/admin/matches/${id}`, data),
  updateMatchScore: (id: number, data: any) => api.put(`/admin/matches/${id}/score`, data),
  deleteMatch: (id: number) => api.delete(`/admin/matches/${id}`),
  getLiveMatches: () => api.get("/matches/live"),
}

// Statistics API - FIXED TO WORK WITH YOUR LARAVEL CONTROLLER
export const statisticsAPI = {
  getStatistics: () => api.get("/statistics"),
  // Get aggregated player statistics (read-only)
  getPlayerStatistics: () => api.get("/admin/statistics"),
  // Create new match-specific statistics (requires user_id and match_id)
  createStatistic: (data: any) => api.post("/admin/statistics", data),
  // Update existing match-specific statistics by ID
  updateStatistic: (id: number, data: any) => api.put(`/admin/statistics/${id}`, data),
  // Delete specific statistics record
  deleteStatistic: (id: number) => api.delete(`/admin/statistics/${id}`),
  // Get individual player details with match breakdown
  getPlayerDetail: (playerId: number, withMatches = false) =>
    api.get(`/admin/statistics/player/${playerId}${withMatches ? "?with_matches=true" : ""}`),
}

// Users API
export const usersAPI = {
  getPlayers: () => api.get("/user/players"),
  updateProfile: (data: any) => api.put("/user/profile", data),
  uploadPayment: (data: FormData) =>
    api.post("/user/upload-payment", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
}

// Admin API
export const adminAPI = {
  //User Management
  getUsers: () => api.get("/admin/users"),
  getUsersByTeam: () => api.get("/admin/users/by-team"),
  verifyUser: (id: number) => api.put(`/admin/users/${id}/verify`),
  unverifyUser: (id: number) => api.put(`/admin/users/${id}/unverify`),
  updateUserTeam: (id: number, teamId: number | null) => api.put(`/admin/users/${id}/team`, { team_id: teamId }),
  removeUserFromTeam: (id: number) => api.delete(`/admin/users/${id}/team`),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),

  //Payment Management
  getPayments: () => api.get("/admin/payments"),
  verifyPayment: (id: number) => api.put(`/admin/payments/${id}/verify`),
  rejectPayment: (id: number, reason?: string) => api.post(`/admin/payments/${id}/reject`, { reason }),

  //Dashboard Stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  // Player Dashboard Control - Admin can update any player's dashboard
  updatePlayerDashboard: (playerId: number, data: any) => api.put(`/admin/players/${playerId}/dashboard`, data),
  getPlayerDashboard: (playerId: number) => api.get(`/admin/players/${playerId}/dashboard`),

  // Teams Management
  getTeams: () => teamsAPI.getTeams(),
  getTeamPlayers: (id: number) => teamsAPI.getTeamPlayers(id),
  createTeam: (data: any) => teamsAPI.createTeam(data),
  updateTeam: (id: number, data: any) => teamsAPI.updateTeam(id, data),
  deleteTeam: (id: number) => teamsAPI.deleteTeam(id),

  //Statistics Management
  getPlayerStatistics: () => api.get("/admin/statistics"),

  // Notification Management
  sendNotificationToUser: (userId: number, data: any) => api.post(`/admin/notifications/user/${userId}`, data),
  sendNotificationToTeam: (teamId: number, data: any) => api.post(`/admin/notifications/team/${teamId}`, data),
  sendBroadcastNotification: (data: any) => api.post("/admin/notifications/broadcast", data),
  getSystemNotifications: () => api.get("/admin/notifications/system"),

  // Advanced Controls
  updateUserStatistics: (userId: number, data: any) => api.put(`/admin/users/${userId}/statistics`, data),
  resetUserPassword: (userId: number) => api.post(`/admin/users/${userId}/reset-password`),
  suspendUser: (userId: number, reason: string) => api.post(`/admin/users/${userId}/suspend`, { reason }),
  unsuspendUser: (userId: number) => api.post(`/admin/users/${userId}/unsuspend`),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
}

export default api
