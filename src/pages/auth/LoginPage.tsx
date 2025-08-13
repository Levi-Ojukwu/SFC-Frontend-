// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { motion } from "framer-motion"
// import { useAuth } from "../../contexts/AuthContext"
// import { useTheme } from "../../contexts/ThemeContext"
// import { Eye, EyeOff, LogIn, Sun, Moon, ArrowLeft } from "lucide-react"
// import toast from "react-hot-toast"

// const LoginPage: React.FC = () => {
//   const { login, user } = useAuth()
//   const { theme, toggleTheme } = useTheme()
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.username || !formData.password) {
//       toast.error("Please fill in all fields")
//       return
//     }

//     setLoading(true)
//     try {
//       await login(formData.username, formData.password)
//     } catch (error) {
//       // Error is handled in the AuthContext
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 ai-background flex items-center justify-center p-4">
//       {/* Header */}
//       <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
//         <Link
//           to="/welcome"
//           className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
//         >
//           <ArrowLeft size={20} />
//           <span>Back to Welcome</span>
//         </Link>

//         <button
//           onClick={toggleTheme}
//           className="p-2 rounded-lg bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-700 transition-colors"
//         >
//           {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//         </button>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-md"
//       >
//         <div className="card p-8">
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <motion.img
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               src="/logo.png"
//               alt="Special FC"
//               className="w-20 h-20 mx-auto mb-4"
//             />
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
//             <p className="text-gray-600 dark:text-gray-400">Sign in to your Special FC account</p>
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="input-field pr-12"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <Link
//                 to="/reset-password"
//                 className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="loading-spinner"></div>
//               ) : (
//                 <>
//                   <LogIn size={20} />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Register Link */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-600 dark:text-gray-400">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
//               >
//                 Register here
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Additional Links */}
//         <div className="mt-6 text-center">
//           <Link
//             to="/landing"
//             className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//           >
//             Learn more about Special FC
//           </Link>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default LoginPage


"use client"

import type React from "react"
import { useState } from "react" // Removed useEffect import
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import { Eye, EyeOff, LogIn, Sun, Moon, ArrowLeft } from 'lucide-react'
import toast from "react-hot-toast"

const LoginPage: React.FC = () => {
  const { login } = useAuth() // Removed 'user' from destructuring
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await login(formData.username, formData.password)
      // The navigation is now handled inside AuthContext.tsx
    } catch (error) {
      // Error is handled in the AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 ai-background flex items-center justify-center p-4">
      {/* Header */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        <Link
          to="/welcome"
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Welcome</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-700 transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              src="/logo.png"
              alt="Special FC"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your Special FC account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/reset-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <Link
            to="/landing"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Learn more about Special FC
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
