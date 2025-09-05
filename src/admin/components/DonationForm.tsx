import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, QrCode } from "lucide-react";
import kpayQr from "../../assets/KPay.jpg";
import wavepayQr from "../../assets/FoQY.png";
import cbpayQr from "../../assets/CBPay.jpg";
import { CreateDonationDto } from "@/types/Donation";
// import { CreateDonationDto } from "../../types/Donation";

enum DonationType {
  KPay = "KPay",
  WavePay = "WavePay",
  CBPay = "CBPay",
  BankAccount = "BankAccount",
}

const formSchema = z.object({
  donorName: z.string().min(2, "Name must be at least 2 characters"),
  donorContact: z.string().optional(),
  donationType: z.nativeEnum(DonationType),
  amount: z.number().min(1000, "Minimum amount is 1,000 MMK"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  transactionPhoto: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DonationFormProps {
  onAddDonation: (donation: Omit<CreateDonationDto, "id">) => Promise<void>;
  onCancel?: () => void;
}

const presetAmounts = [10000, 30000, 50000, 100000];
const qrImages: Record<DonationType, string | null> = {
  [DonationType.KPay]: kpayQr,
  [DonationType.WavePay]: wavepayQr,
  [DonationType.CBPay]: cbpayQr,
  [DonationType.BankAccount]: null,
};

const DonationForm: React.FC<DonationFormProps> = ({ onAddDonation, onCancel }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorName: "",
      donorContact: "",
      description: "",
      amount: 0,
    },
  });

  const watchedDonationType = form.watch("donationType");

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const numValue = parseInt(value) || 0;
    form.setValue("amount", numValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("transactionPhoto", file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFile(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onAddDonation({
        donorName: data.donorName,
        donorContact: data.donorContact,
        donationType: data.donationType,
        amount: data.amount,
        description: data.description,
        transactionPhoto: data.transactionPhoto,
      });
      toast.success("Donation submitted successfully!");
      form.reset();
      setPreviewFile(null);
      setSelectedAmount(null);
      setCustomAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg border border-orange-500">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Make a Donation</h2>
          <p className="text-gray-600 mt-2">
            Your contribution makes a difference. Please fill out the form below
            to complete your donation.
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Donor Name *
                  </label>
                  <input
                    {...form.register("donorName")}
                    placeholder="Enter your full name"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {form.formState.errors.donorName && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.donorName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Information
                  </label>
                  <input
                    {...form.register("donorContact")}
                    placeholder="Phone or email (optional)"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {form.formState.errors.donorContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.donorContact.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method *
                  </label>
                  <select
                    {...form.register("donationType")}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select payment method
                    </option>
                    {Object.values(DonationType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.donationType && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.donationType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Donation Amount (MMK) *
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`h-10 rounded-md border transition-colors ${
                            selectedAmount === amount
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {amount.toLocaleString()} MMK
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Or enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    {...form.register("description")}
                    placeholder="Please describe the purpose of your donation..."
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                {watchedDonationType &&
                  watchedDonationType !== DonationType.BankAccount && (
                    <div className="bg-white shadow rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                          <QrCode className="h-5 w-5" />
                          {watchedDonationType} QR Code
                        </h3>
                      </div>
                      <div className="p-4 flex justify-center">
                        <img
                          src={
                            qrImages[watchedDonationType as DonationType] || ""
                          }
                          alt={`${watchedDonationType} QR Code`}
                          className="w-48 h-48 object-contain border rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                {watchedDonationType === DonationType.BankAccount && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Bank Account Details
                      </h3>
                    </div>
                    <div className="p-4 space-y-2 text-sm text-gray-700">
                      <div>
                        <strong>Bank:</strong> CB Bank
                      </div>
                      <div>
                        <strong>Account Name:</strong> Donation Fund
                      </div>
                      <div>
                        <strong>Account Number:</strong> 1234567890
                      </div>
                      <div className="text-gray-500 mt-2">
                        Please use your name as reference when making the
                        transfer.
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Transaction Screenshot
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="transaction-photo"
                    />
                    <label
                      htmlFor="transaction-photo"
                      className="cursor-pointer"
                    >
                      {previewFile ? (
                        <img
                          src={previewFile}
                          alt="Transaction preview"
                          className="w-32 h-32 object-cover mx-auto rounded-lg mb-2"
                        />
                      ) : (
                        <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-500">
                        {previewFile
                          ? "Click to change"
                          : "Upload transaction screenshot"}
                      </p>
                    </label>
                  </div>
                  {form.formState.errors.transactionPhoto && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.transactionPhoto.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gray-500 text-white rounded-md text-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 h-12 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Donation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
