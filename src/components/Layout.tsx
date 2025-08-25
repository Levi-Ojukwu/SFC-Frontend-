"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import Navbar from "./Navbar"
import { Toaster } from "react-hot-toast"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {user && <Navbar />}
      <main className={user ? "pt-16" : ""}>{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
            border: "1px solid var(--toast-border)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </div>
  )
}

export default Layout


// "use client"

// import type React from "react"
// import type { ReactNode } from "react"
// import Navbar from "./Navbar"
// import { motion } from "framer-motion"

// interface LayoutProps {
//   children: ReactNode
//   showNavbar?: boolean
// }

// const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
//   return (
//     <div className="min-h-screen ai-background">
//       {/* Floating Elements - Behind content */}
//       <div className="floating-elements">
//         <div className="floating-element"></div>
//         <div className="floating-element"></div>
//         <div className="floating-element"></div>
//         <div className="floating-element"></div>
//         <div className="floating-element"></div>
//       </div>
      
//       {/* Mesh Gradient Overlay - Behind content */}
//       <div className="mesh-gradient"></div>
      
//       {/* Interactive Content Layer */}
//       <div className="content-layer">
//         {showNavbar && <Navbar />}
//         <motion.main
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className={showNavbar ? "pt-16" : ""}
//         >
//           {children}
//         </motion.main>
//       </div>
//     </div>
//   )
// }

// export default Layout
