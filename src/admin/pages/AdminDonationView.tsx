import { useEffect, useState } from "react";

import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { DonationDto, PendingDonationDto } from "@/types/Donation";
import SmartImage from "../components/SmartImage";
import { AdminDonationService } from "@/services/AdminDonationService";

const BACKEND_URL = "http://localhost:5057";

export default function AdminDonationView() {
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");

  // Pending
  const [pending, setPending] = useState<PendingDonationDto[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  // Verified
  const [verified, setVerified] = useState<DonationDto[]>([]);
  const [loadingVerified, setLoadingVerified] = useState(false);

  // Filters
  const [pendingFilters, setPendingFilters] = useState({
    search: "",
    donationType: "",
    dateFrom: "",
    dateTo: "",
    hasPhoto: "",
  });

  const [verifiedFilters, setVerifiedFilters] = useState({
    search: "",
    donationType: "",
    dateFrom: "",
    dateTo: "",
  });

  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token = useAuthStore((s) => s.accessToken);

  // ===== Fetchers =====
  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const data = await AdminDonationService.getPending();
      setPending(data);
    } catch (error) {
      console.error("Failed to load pending donations:", error);
      toast.error("Failed to load pending donations");
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchVerified = async () => {
    try {
      setLoadingVerified(true);
      const data = await AdminDonationService.getVerified();
      setVerified(data);
    } catch {
      toast.error("Failed to load verified donations");
    } finally {
      setLoadingVerified(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") fetchPending();
    if (activeTab === "verified") fetchVerified();
  }, [activeTab]);

  // ===== Handlers =====
  const handleVerify = async (id: number) => {
    try {
      setVerifyingId(id);
      await AdminDonationService.verifyDonation(id);
      toast.success("Donation verified successfully!");
      fetchPending();
    } catch {
      toast.error("Failed to verify donation");
    } finally {
      setVerifyingId(null);
    }
  };

  const openModal = (url: string) => {
    setPreviewPhotoUrl(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setPreviewPhotoUrl(null), 300);
  };

  const getFullUrl = (url: string | null) => {
    if (!url) return "";

    // If it's already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Handle different possible URL formats from backend
    let cleanUrl = url;

    // If URL doesn't start with /, add it
    if (!cleanUrl.startsWith("/")) {
      cleanUrl = `/${cleanUrl}`;
    }

    // Return the direct path (this should work now that backend is configured)
    return `${BACKEND_URL}${cleanUrl}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US").format(amount) + " MMK";
  };

  // ====== UI ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Donation Management
          </h2>
          <p className="text-gray-600">
            Manage and monitor all donation activities
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: "pending", label: "⏳ Pending", color: "bg-amber-500" },
            { key: "verified", label: "✅ Verified", color: "bg-emerald-500" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.key
                  ? `${tab.color} text-white shadow-lg`
                  : "bg-white text-gray-700 shadow-md hover:shadow-lg"
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">
                      Pending
                    </p>
                    <p className="text-3xl font-bold">{pending.length}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        pending.reduce((sum, d) => sum + (d.amount || 0), 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-8a7 7 0 1114 0 7 7 0 01-14 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">
                      With Photos
                    </p>
                    <p className="text-3xl font-bold">
                      {pending.filter((d) => d.transactionPhotoUrl).length}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Pending Donations
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Review and verify donation submissions
                    </p>
                  </div>
                  <button
                    onClick={fetchPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingPending ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pending.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-gray-500 text-xl font-semibold">
                    No pending donations
                  </p>
                  <p className="text-gray-400 mt-2">
                    All donations have been processed
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Proof
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pending.map((d, index) => (
                        <tr
                          key={d.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {d.donorName}
                              </div>
                              {d.description && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {d.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(d?.amount ?? 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {d.donationType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(d.receivedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {d.transactionPhotoUrl ? (
                              <div
                                className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200"
                                onClick={() =>
                                  openModal(
                                    getFullUrl(d.transactionPhotoUrl ?? "")
                                  )
                                }
                              >
                                <SmartImage
                                  src={getFullUrl(d.transactionPhotoUrl)}
                                  className="w-full h-full object-cover"
                                  alt="Transaction proof"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleVerify(d.id)}
                              disabled={verifyingId === d.id}
                            >
                              {verifyingId === d.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Verify
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verified Tab */}
        {activeTab === "verified" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">
                      Verified
                    </p>
                    <p className="text-3xl font-bold">{verified.length}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        verified.reduce((sum, d) => sum + (d.amount || 0), 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-8a7 7 0 1114 0 7 7 0 01-14 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">
                      This Month
                    </p>
                    <p className="text-3xl font-bold">
                      {
                        verified.filter((d) => {
                          const donationDate = new Date(d.receivedAt);
                          const currentDate = new Date();
                          return (
                            donationDate.getMonth() ===
                              currentDate.getMonth() &&
                            donationDate.getFullYear() ===
                              currentDate.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Verified Donations
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Successfully processed donations
                    </p>
                  </div>
                  <button
                    onClick={fetchVerified}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingVerified ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : verified.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-gray-500 text-xl font-semibold">
                    No verified donations yet
                  </p>
                  <p className="text-gray-400 mt-2">
                    Verified donations will appear here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Donor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {verified.map((d, index) => (
                        <tr
                          key={d.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {d.donorName}
                              </div>
                              {d.description && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {d.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-emerald-600">
                              {formatCurrency(d?.amount ?? 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {d.donationType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(d.receivedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div className="bg-white rounded-xl max-w-3xl w-full mx-4 overflow-hidden transform transition-transform duration-300 scale-100">
            <div className="flex justify-between items-center p-4 border-b">
              <h5 className="font-bold text-lg">Transaction Proof</h5>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-auto">
              <img
                src={previewPhotoUrl || ""}
                className="w-full object-contain rounded-lg"
                alt="Transaction proof"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
