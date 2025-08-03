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
}

// Matches API
export const matchesAPI = {
  getMatches: () => api.get("/matches"),
  getFixtures: () => api.get("/matches/fixtures"),
  getResults: () => api.get("/matches/results"),
  getMatch: (id: number) => api.get(`/matches/${id}`),
  createMatch: (data: any) => api.post("/admin/matches", data),
  updateMatch: (id: number, data: any) => api.put(`/admin/matches/${id}`, data),
  deleteMatch: (id: number) => api.delete(`/admin/matches/${id}`),
}

// Statistics API
export const statisticsAPI = {
  getStatistics: () => api.get("/statistics"),
  createStatistic: (data: any) => api.post("/admin/statistics", data),
  updateStatistic: (id: number, data: any) => api.put(`/admin/statistics/${id}`, data),
  deleteStatistic: (id: number) => api.delete(`/admin/statistics/${id}`),
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
  getUsers: () => api.get("/admin/users"),
  verifyUser: (id: number) => api.put(`/admin/users/${id}/verify`),
  unverifyUser: (id: number) => api.put(`/admin/users/${id}/unverify`),
  updateUserTeam: (id: number, teamId: number) => api.put(`/admin/users/${id}/team`, { team_id: teamId }),
  getPayments: () => api.get("/admin/payments"),
  verifyPayment: (id: number) => api.put(`/admin/payments/${id}/verify`),
  rejectPayment: (id: number) => api.post(`/admin/payments/${id}/reject`),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
}

export default api
