



import React, { useEffect, useMemo, useState } from "react";
import { DonateService } from "@/services/DonationService";
import { CreateDonationDto, DonationDto, DonationType } from "../types/Donation";
import QRCodeSection from "./QRCodeSectiion";

export default function Donate() {
  // ---------------- Form State ----------------
  const [formData, setFormData] = useState<CreateDonationDto>({
    donorName: "",
    donorContact: "",
    donationType: DonationType.KPay,
    amount: undefined,
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // ---------------- List State ----------------
  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI filters
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Verified">("All");
  const [query, setQuery] = useState("");

  // Image preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ---------------- Data Fetch ----------------
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await DonateService.getByOrganization(6);
      setDonations(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // ---------------- Handlers ----------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);
    try {
      const payload: CreateDonationDto = {
        ...formData,
        transactionPhoto: selectedFile || undefined,
      };
      await DonateService.createDonation(payload);
      setToast({ type: "success", msg: "Donation created! Waiting for admin verification." });
      // reset form
      setFormData({
        donorName: "",
        donorContact: "",
        donationType: DonationType.KPay,
        amount: undefined,
        description: "",
      });
      setSelectedFile(null);
      await fetchDonations();
    } catch (err) {
      console.error("Donation error", err);
      setToast({ type: "error", msg: "Failed to create donation. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Derived ----------------
  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const statusOk = statusFilter === "All" || d.status === statusFilter;
      const q = query.trim().toLowerCase();
      const qOk = !q || d.donorName.toLowerCase().includes(q) || (d.donorContact ?? "").toLowerCase().includes(q);
      return statusOk && qOk;
    });
  }, [donations, statusFilter, query]);

  // ---------------- UI ----------------
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-800">Our Disaster Donate</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your generous donation helps us provide urgent relief and long‑term support to those in need.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Section - Placed on the side */}
        <div className="lg:col-span-1">
          <QRCodeSection />
        </div>

        {/* Main Content - Donate Form and List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Donate Form */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Make a Donation</h2>
              <button
                onClick={fetchDonations}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            {toast && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm border ${toast.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
                  }`}
              >
                {toast.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left side */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donor Name *</label>
                  <input
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 px-4 py-3"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact (optional)</label>
                  <input
                    name="donorContact"
                    value={formData.donorContact}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 px-4 py-3"
                    placeholder="Phone or email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type *</label>
                  <select
                    name="donationType"
                    value={formData.donationType}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 px-4 py-3"
                  >
                    <option value={DonationType.KPay}>KPay</option>
                    <option value={DonationType.WavePay}>WavePay</option>
                    <option value={DonationType.CBPay}>CBPay</option>
                    <option value={DonationType.BankAccount}>Bank Account</option>
                  </select>
                </div>
              </div>

              {/* Right side */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (MMK)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">MMK</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount ?? ""}
                      min={0}
                      step="0.01"
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 pl-14 pr-4 py-3"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 px-4 py-3"
                    placeholder="What is this donation for?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Proof</label>
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <span className="text-sm text-gray-600">Upload screenshot / photo</span>
                  </label>
                  {selectedFile && (
                    <p className="text-xs text-green-700 mt-2">Selected: {selectedFile.name}</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <span className="animate-spin h-5 w-5 border-2 border-white rounded-full"></span>}
                  {isSubmitting ? "Processing..." : "Donate Now"}
                </button>
              </div>
            </form>
          </section>

          {/* Donations List */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Recent Donations</h3>
                <p className="text-sm text-gray-500">Total: <span className="font-semibold text-indigo-600">{donations.length}</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-gray-100 rounded-xl p-1 inline-flex">
                  {["All", "Pending", "Verified"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab as any)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${statusFilter === tab ? "bg-white shadow text-gray-900" : "text-gray-600"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search donor or contact"
                  className="rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 px-4 py-2 w-full sm:w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-2xl p-4 h-48"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10 bg-red-50 rounded-xl border border-red-200 text-red-700">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No donations match your filters.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((d) => (
                  <div key={d.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                          {d.donorName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{d.donorName}</p>
                          <p className="text-xs text-gray-500">{d.donorContact || "N/A"}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                        }`}>
                        {d.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Type:</span><span className="text-sm font-medium text-gray-800">{d.donationType}</span></div>
                      <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Amount:</span><span className="text-base font-semibold text-gray-900">{d.amount ? `MMK ${d.amount.toLocaleString()}` : "N/A"}</span></div>
                      <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Date:</span><span className="text-sm text-gray-800">{new Date(d.receivedAt).toLocaleDateString()}</span></div>
                    </div>

                    {d.transactionPhotoUrl && (
                      <button
                        onClick={() =>
                          setPreviewUrl(`http://localhost:5057${d.transactionPhotoUrl}`)
                        }
                        className="mt-4 w-full rounded-xl border border-gray-200 hover:border-gray-300 py-2 text-sm text-gray-700"
                      >
                        View Transaction Photo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h5 className="font-semibold">Transaction Proof</h5>
              <button
                onClick={() => setPreviewUrl(null)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <img
              src={previewUrl}
              alt="Transaction proof"
              className="max-h-[70vh] w-full object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}