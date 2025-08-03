"use client"

import type React from "react"
import type { ReactNode } from "react"
import Navbar from "./Navbar"
import { motion } from "framer-motion"

interface LayoutProps {
  children: ReactNode
  showNavbar?: boolean
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={showNavbar ? "pt-16" : ""}
      >
        {children}
      </motion.main>
    </div>
  )
}

export default Layout
