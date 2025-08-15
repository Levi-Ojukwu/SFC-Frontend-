"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import { CreditCard, Upload, CheckCircle, AlertCircle, ArrowLeft, Copy } from "lucide-react"
import { usersAPI } from "../lib/api"
import toast from "react-hot-toast"

const PaymentPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "1000",
    payment_type: "monthly_dues",
    payment_date: new Date().toISOString().split("T")[0],
    payment_proof: null as File | null,
  })

  const bankDetails = {
    bankName: "Opay",
    accountName: "Ferdinand Emeka Onyaeocha",
    accountNumber: "9063664279",
    zipCode: "900108",
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB")
        return
      }

      setFormData((prev) => ({
        ...prev,
        payment_proof: file,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.payment_proof) {
      toast.error("Please upload payment proof")
      return
    }

    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append("amount", formData.amount)
      submitData.append("payment_type", formData.payment_type)
      submitData.append("payment_date", formData.payment_date)
      submitData.append("payment_proof", formData.payment_proof)

      await usersAPI.uploadPayment(submitData)
      toast.success("Payment proof uploaded successfully! Awaiting admin verification.")
      navigate("/dashboard")
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to upload payment proof"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Monthly Dues Payment</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Make your monthly payment of ₦1,000 to maintain your membership
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bank Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bank Details</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bank Name</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{bankDetails.bankName}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankDetails.bankName)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Name</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{bankDetails.accountName}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountName)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Account Number</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{bankDetails.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Zip Code: (Kubwa)</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{bankDetails.zipCode}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankDetails.zipCode)}
                      className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Payment Instructions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Transfer exactly ₦1,000 to the account above</li>
                      <li>Use your username as the payment reference</li>
                      <li>Take a screenshot of the successful transaction</li>
                      <li>Upload the screenshot using the form on the right</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Upload className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Upload Payment Proof</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="input-field"
                    min="1000"
                    step="1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="payment_type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Payment Type
                  </label>
                  <select
                    id="payment_type"
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="monthly_dues">Monthly Dues</option>
                    <option value="registration">Registration Fee</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="payment_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Payment Date
                  </label>
                  <input
                    type="date"
                    id="payment_date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="payment_proof"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Payment Receipt/Screenshot
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="payment_proof"
                          className="relative cursor-pointer bg-white dark:bg-dark-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="payment_proof"
                            name="payment_proof"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                  {formData.payment_proof && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle size={16} />
                      <span>File selected: {formData.payment_proof.name}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.payment_proof}
                  className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Submit Payment Proof</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <p className="font-medium mb-1">What happens next?</p>
                    <p>
                      Once you submit your payment proof, our admin team will verify your payment within 24 hours.
                      You'll receive a notification once it's approved.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PaymentPage
