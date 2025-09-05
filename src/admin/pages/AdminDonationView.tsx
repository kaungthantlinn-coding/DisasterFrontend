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

import { DonationDto, PendingDonationDto } from "../../types/Donation";
import { AdminDonationService } from "../../services/AdminDonationService";

const BACKEND_URL = "http://localhost:5057";

export default function AdminDonationView() {
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "dashboard">("pending");

  // Pending
  const [pending, setPending] = useState<PendingDonationDto[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  // Verified
  const [verified, setVerified] = useState<DonationDto[]>([]);
  const [loadingVerified, setLoadingVerified] = useState(false);

  // Dashboard
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token = useAuthStore((s) => s.accessToken);

  // ===== Fetchers =====
  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const data = await AdminDonationService.getPending();
      setPending(data);
    } catch {
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

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await AdminDonationService.getDashboardSummary();
      setSummary(data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pending") fetchPending();
    if (activeTab === "verified") fetchVerified();
    if (activeTab === "dashboard") fetchSummary();
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

  const getFullUrl = (url: string | null) => (url ? `${BACKEND_URL}${url}` : "");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + " MMK";
  };

  // ====== UI ======
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Donation Management
          </h2>
          <p className="text-gray-600">Manage and monitor all donation activities</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: "pending", label: "⏳ Pending", color: "bg-amber-500" },
            { key: "verified", label: "✅ Verified", color: "bg-emerald-500" },
            { key: "dashboard", label: "📊 Dashboard", color: "bg-blue-500" }
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
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Pending Donations</h3>
              <button 
                onClick={fetchPending}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                ↻ Refresh
              </button>
            </div>
            
            {loadingPending ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : pending.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-gray-500 text-xl">No pending donations</p>
                <p className="text-gray-400">All donations have been processed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pending.map((d) => (
                  <div key={d.id} className="border border-gray-200 rounded-xl p-5 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{d.donorName}</h4>
                        <p className="text-2xl font-bold text-blue-600 my-2">{formatCurrency(d?.amount ?? 0)}</p>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          {d.donationType}
                        </span>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(d.receivedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3">
                        {d.transactionPhotoUrl && (
                          <div 
                            className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer shadow-md transition hover:shadow-lg"
                            onClick={() => openModal(getFullUrl(d.transactionPhotoUrl ?? ''))}
                          >
                            <img
                              src={getFullUrl(d.transactionPhotoUrl)}
                              className="w-full h-full object-cover"
                              alt="Transaction proof"
                            />
                          </div>
                        )}
                        <button
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-50"
                          onClick={() => handleVerify(d.id)}
                          disabled={verifyingId === d.id}
                        >
                          {verifyingId === d.id ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Verifying...
                            </span>
                          ) : "Verify"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verified Tab */}
        {activeTab === "verified" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Verified Donations</h3>
              <button 
                onClick={fetchVerified}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                ↻ Refresh
              </button>
            </div>
            
            {loadingVerified ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : verified.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-gray-500 text-xl">No verified donations yet</p>
                <p className="text-gray-400">Verified donations will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-4 font-semibold text-gray-700 rounded-tl-xl">Donor</th>
                      <th className="p-4 font-semibold text-gray-700">Amount</th>
                      <th className="p-4 font-semibold text-gray-700">Type</th>
                      <th className="p-4 font-semibold text-gray-700 rounded-tr-xl">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verified.map((d, index) => (
                      <tr 
                        key={d.id} 
                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                      >
                        <td className="p-4 font-medium text-gray-800">{d.donorName}</td>
                        <td className="p-4 font-bold text-blue-600">{formatCurrency(d?.amount ?? 0)}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {d.donationType}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{new Date(d.receivedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Donation Dashboard</h3>
              <button 
                onClick={fetchSummary}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                ↻ Refresh
              </button>
            </div>
            
            {loadingSummary ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : summary ? (
              <div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <h4 className="text-lg font-semibold mb-2">Total Donations</h4>
                    <p className="text-3xl font-bold">{summary.totalDonations}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <h4 className="text-lg font-semibold mb-2">Total Amount</h4>
                    <p className="text-3xl font-bold">{formatCurrency(summary.totalAmount)}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <h4 className="text-lg font-semibold mb-2">Average Donation</h4>
                    <p className="text-3xl font-bold">
                      {formatCurrency(summary.totalAmount / summary.totalDonations)}
                    </p>
                  </div>
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Donations by Type</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={summary.byType}
                            dataKey="Amount"
                            nameKey="Type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {summary.byType.map((_: any, idx: number) => (
                              <Cell
                                key={idx}
                                fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), 'Amount']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Line Chart */}
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Monthly Donations</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summary.monthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="Month" />
                          <YAxis tickFormatter={(value) => `${value/1000}k`} />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), 'Amount']}
                          />
                          <Bar
                            dataKey="Amount"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-xl">No dashboard data available</p>
                <p className="text-gray-400">Data will appear here once donations are processed</p>
              </div>
            )}
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
                src={previewPhotoUrl || ''} 
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