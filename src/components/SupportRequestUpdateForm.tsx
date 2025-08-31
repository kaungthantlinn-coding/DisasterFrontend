import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Send, CheckCircle, X } from "lucide-react";
import { SupportRequestService } from "../services/supportRequestService";
import { SupportRequestUpdateDto } from "../types/supportRequest";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useAuthStore } from "../stores/authStore";

interface SupportRequestFormData {
  fullName: string;
  email: string;
  urgencyLevel: "immediate" | "within_24h" | "within_week" | "non_urgent";
  description: string;
  assistanceTypes: string[];
  otherAssistanceType: string;
  status: "pending" | "in_progress" | "completed";
  reportId?: string;
}

const urgencyLevels = [
  {
    id: "immediate",
    label: "Immediate",
    description: "Life-threatening emergency",
    color: "from-red-500 to-red-600",
  },
  {
    id: "within_24h",
    label: "Within 24 Hours",
    description: "Urgent assistance needed",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "within_week",
    label: "Within a Week",
    description: "Important but not urgent",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "non_urgent",
    label: "Non-Urgent",
    description: "General inquiry or support",
    color: "from-green-500 to-green-600",
  },
];

interface SupportRequestUpdateFormProps {
  onSubmitSuccess?: () => void;
}

const SupportRequestUpdateForm: React.FC<SupportRequestUpdateFormProps> = ({
  onSubmitSuccess,
}) => {
  const { id } = useParams<{ id?: string }>();
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assistanceTypes, setAssistanceTypes] = useState<string[]>([]);
  const [loadingAssistanceTypes, setLoadingAssistanceTypes] = useState(true);
  const [assistanceTypesError, setAssistanceTypesError] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const [formData, setFormData] = useState<SupportRequestFormData>({
    fullName: user?.name || "",
    email: user?.email || "",
    urgencyLevel: "non_urgent",
    description: "",
    assistanceTypes: [],
    otherAssistanceType: "",
    status: "pending",
    reportId: "",
  });

  // Convert id to number
  const numericSupportRequestId = id ? Number(id) : undefined;

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("Rendering SupportRequestUpdateForm for ID:", id, {
      accessToken: !!accessToken,
      user: user
        ? { id: user.userId, name: user.name, email: user.email }
        : null,
    });
  }, [id, accessToken, user]);

  // Debug: Log formData.urgencyLevel changes
  useEffect(() => {
    console.log("Current formData.urgencyLevel:", formData.urgencyLevel);
  }, [formData.urgencyLevel]);

  // 🔹 Validate supportRequestId
  useEffect(() => {
    if (
      !numericSupportRequestId ||
      isNaN(numericSupportRequestId) ||
      numericSupportRequestId <= 0
    ) {
      console.warn("Invalid support request ID:", id);
      setErrors({ fetch: "Invalid support request ID." });
      navigate("/dashboard");
    }
  }, [numericSupportRequestId, navigate, id]);

  // 🔹 Fetch Assistance Types
  useEffect(() => {
    const fetchAssistanceTypes = async () => {
      try {
        setLoadingAssistanceTypes(true);
        const types = await SupportRequestService.getAllSupportType();
        console.log("Fetched Assistance Types (Raw):", types);
        const normalizedTypes = types.map((t: string) =>
          t.toLowerCase().trim()
        );
        setAssistanceTypes(normalizedTypes);
        console.log("Normalized Assistance Types:", normalizedTypes);
        setAssistanceTypesError(null);
      } catch (error) {
        console.error("Failed to fetch assistance types:", error);
        setAssistanceTypesError(
          "Failed to load assistance types. Please try again later."
        );
      } finally {
        setLoadingAssistanceTypes(false);
      }
    };

    fetchAssistanceTypes();
  }, []);

  // 🔹 Fetch Existing Support Request
  useEffect(() => {
    if (
      numericSupportRequestId &&
      !isNaN(numericSupportRequestId) &&
      numericSupportRequestId > 0 &&
      !isFormTouched
    ) {
      console.log("Fetching support request for ID:", numericSupportRequestId);
      const fetchSupportRequest = async () => {
        try {
          setIsLoading(true);
          const request = await SupportRequestService.getById(
            numericSupportRequestId,
          
          );
          console.log("Fetched Support Request (Raw):", request);
          console.log("Raw urgencyLevel from API:", request.urgencyLevel);

          const validUrgencyLevels = [
            "immediate",
            "within_24h",
            "within_week",
            "non_urgent",
          ];
          // Enhanced normalization to handle API inconsistencies
          const urgencyMapFromApi: {
            [key: string]: SupportRequestFormData["urgencyLevel"];
          } = {
            immediate: "immediate",
            within_24h: "within_24h",
            within24h: "within_24h",
            "within 24 hours": "within_24h",
            within_week: "within_week",
            withinweek: "within_week",
            "within a week": "within_week",
            non_urgent: "non_urgent",
            nonurgent: "non_urgent",
            "non-urgent": "non_urgent",
            "1": "immediate",
            "2": "within_24h",
            "3": "within_week",
            "4": "non_urgent",
          };
          const rawUrgency = request.urgencyLevel
            ? String(request.urgencyLevel).toLowerCase().trim()
            : "";
          const urgencyLevel = urgencyMapFromApi[rawUrgency] || "non_urgent";
          console.log("Normalized urgencyLevel:", urgencyLevel);

          const validStatuses: SupportRequestFormData["status"][] = [
            "pending",
            "in_progress",
            "completed",
          ];
          const status = validStatuses.includes(request.status)
            ? request.status
            : "pending";

          // Normalize assistance types
          const normalizedAssistanceTypes = Array.isArray(
            request.supportTypeNames
          )
            ? request.supportTypeNames.map((type: string) =>
                type.toLowerCase().trim()
              )
            : Array.isArray(request.assistanceTypes)
            ? request.assistanceTypes.map((type: string) =>
                type.toLowerCase().trim()
              )
            : request.supportTypeName
            ? request.supportTypeName
                .split(",")
                .map((type: string) => type.toLowerCase().trim())
            : [];

          console.log(
            "Normalized Assistance Types:",
            normalizedAssistanceTypes
          );
          console.log("Available Assistance Types:", assistanceTypes);

          // Determine known types and custom types
          const knownAssistanceTypes = normalizedAssistanceTypes.filter(
            (type) => assistanceTypes.includes(type)
          );
          const hasOther = normalizedAssistanceTypes.some(
            (type) => !assistanceTypes.includes(type)
          );
          const otherAssistanceType = normalizedAssistanceTypes
            .filter((type) => !assistanceTypes.includes(type))
            .join(", ");

          const finalAssistanceTypes = hasOther
            ? [...knownAssistanceTypes, "other"]
            : knownAssistanceTypes;

          console.log("Known Assistance Types:", knownAssistanceTypes);
          console.log("Has Other Type:", hasOther);
          console.log("Other Assistance Type:", otherAssistanceType);
          console.log("Final Assistance Types for Form:", finalAssistanceTypes);

          setFormData({
            fullName: request.fullName || user?.name || "",
            email: request.email || user?.email || "",
            urgencyLevel,
            description: request.description || "",
            assistanceTypes: finalAssistanceTypes,
            otherAssistanceType,
            status,
            reportId: request.reportId || "",
          });
        } catch (error: any) {
          console.error("Failed to fetch support request:", {
            supportRequestId: numericSupportRequestId,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
          setErrors({
            fetch:
              error.response?.status === 404
                ? "Support request not found."
                : error.response?.data?.message ||
                  "Failed to load support request. Please try again.",
          });
          navigate("/dashboard");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSupportRequest();
    }
  }, [
    numericSupportRequestId,
    user,
    accessToken,
    navigate,
    assistanceTypes,
    isFormTouched,
  ]);

  // 🔹 Step Validation
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};
      switch (step) {
        case 1:
          if (!formData.fullName.trim())
            newErrors.fullName = "Full name is required";
          if (!formData.email.trim()) newErrors.email = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Please enter a valid email";
          break;
        case 2:
          if (!formData.urgencyLevel)
            newErrors.urgencyLevel = "Please select urgency level";
          if (!formData.description.trim())
            newErrors.description = "Description is required";
          else if (formData.description.length < 20)
            newErrors.description =
              "Description must be at least 20 characters";
          if (
            formData.assistanceTypes.length === 0 &&
            !formData.otherAssistanceType.trim()
          )
            newErrors.assistanceTypes =
              "Please select at least one assistance type or specify other";
          if (
            formData.assistanceTypes.includes("other") &&
            !formData.otherAssistanceType.trim()
          ) {
            newErrors.otherAssistanceType =
              "Please specify the type of assistance needed";
          }
          break;
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // 🔹 Navigation Between Steps
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 🔹 Handle Urgency Change
  const handleUrgencyChange = (
    value: SupportRequestFormData["urgencyLevel"]
  ) => {
    console.log("Selected urgencyLevel:", value);
    setIsFormTouched(true);
    setFormData((prev) => ({
      ...prev,
      urgencyLevel: value,
    }));
  };

  // 🔹 Submit Handler
  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);

    try {
      if (!accessToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const assistanceTypesToSubmit = formData.assistanceTypes.includes("other")
        ? [
            ...formData.assistanceTypes.filter((type) => type !== "other"),
            formData.otherAssistanceType.trim(),
          ]
        : formData.assistanceTypes;

      const urgencyMap: { [key: string]: number } = {
        immediate: 1,
        within_24h: 2,
        within_week: 3,
        non_urgent: 4,
      };

      const updateDto: SupportRequestUpdateDto = {
        Description: formData.description,
        Urgency: urgencyMap[formData.urgencyLevel] || 4,
        SupportTypeName: assistanceTypesToSubmit.join(", "),
        UpdateAt: new Date().toISOString(),
        SupportTypeIds: assistanceTypesToSubmit.map((type) =>
          assistanceTypes.includes(type)
            ? assistanceTypes.indexOf(type) + 1
            : assistanceTypes.length + 1
        ),
      };

      console.log("Submitting updateDto:", updateDto);

      if (!numericSupportRequestId) {
        throw new Error("Support request ID is required for updating.");
      }

      await SupportRequestService.updateRequest(
        numericSupportRequestId,
        updateDto,
        accessToken
      );

      setSubmitSuccess(true);
      onSubmitSuccess?.();

      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        } else {
          navigate(`/reports/${formData.reportId || ""}`);
        }
      }, 3000);
    } catch (error: any) {
      console.error("Failed to update support request:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setErrors({
        submit:
          error.response?.status === 403
            ? "You are not authorized to update this request."
            : error.response?.data?.message ||
              error.message ||
              "Failed to update support request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateStep,
    navigate,
    onSubmitSuccess,
    formData,
    numericSupportRequestId,
    accessToken,
    assistanceTypes,
  ]);

  // 🔹 Handle Assistance Types
  const handleAssistanceTypeChange = (assistanceId: string) => {
    setIsFormTouched(true);
    setFormData((prev) => ({
      ...prev,
      assistanceTypes: prev.assistanceTypes.includes(assistanceId)
        ? prev.assistanceTypes.filter((id) => id !== assistanceId)
        : [...prev.assistanceTypes, assistanceId],
    }));
  };

  const stepTitles = ["Personal Information", "Request Details"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="navbar-spacing">
          <div className="py-16 flex items-center justify-center">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">
                Loading support request...
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="navbar-spacing">
          <div className="py-16 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Request Updated Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your support request has been updated. Our team will review it.
              </p>
              <div className="text-sm text-gray-500">
                <p>Reference ID: SR-{numericSupportRequestId}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="navbar-spacing">
          <div className="py-16 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto text-center">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Error</h2>
              <p className="text-red-700 mb-6">{errors.fetch}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="navbar-spacing">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                Update Support Request
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Update support request {numericSupportRequestId}
              </p>
            </div>

            <div className="flex items-center justify-center mb-16">
              <div className="flex items-center space-x-8">
                {stepTitles.map((title, index) => {
                  const stepNumber = index + 1;
                  const isActive = currentStep === stepNumber;
                  const isCompleted = currentStep > stepNumber;
                  return (
                    <div key={stepNumber} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            isCompleted
                              ? "bg-blue-600 text-white shadow-lg"
                              : isActive
                              ? "bg-blue-600 text-white shadow-lg scale-110"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? <CheckCircle size={20} /> : stepNumber}
                        </div>
                        <span
                          className={`mt-3 text-sm font-medium text-center ${
                            isActive
                              ? "text-blue-600"
                              : isCompleted
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {title}
                        </span>
                      </div>
                      {index < 1 && (
                        <div
                          className={`w-16 h-0.5 mx-6 transition-colors duration-300 ${
                            isCompleted ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User
                          size={20}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setIsFormTouched(true);
                            setFormData((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }));
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setIsFormTouched(true);
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Request Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Request ID
                    </label>
                    <input
                      type="text"
                      value={numericSupportRequestId}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Urgency Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {urgencyLevels.map((level) => (
                        <label key={level.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="urgencyLevel"
                            value={level.id}
                            checked={formData.urgencyLevel === level.id}
                            onChange={(e) => {
                              console.log(
                                `Radio clicked: value=${e.target.value}, checked=${e.target.checked}`
                              );
                              handleUrgencyChange(
                                e.target
                                  .value as SupportRequestFormData["urgencyLevel"]
                              );
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              formData.urgencyLevel === level.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center`}
                              ></div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {level.label}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {level.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.urgencyLevel && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.urgencyLevel}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Type of Assistance Needed * (Select all that apply)
                    </label>
                    {loadingAssistanceTypes && (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-gray-600">
                          Loading assistance types...
                        </span>
                      </div>
                    )}
                    {assistanceTypesError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-700">{assistanceTypesError}</p>
                      </div>
                    )}
                    {!loadingAssistanceTypes && !assistanceTypesError && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[...assistanceTypes, "other"].map((type) => {
                          const isOther = type.toLowerCase() === "other";
                          const isSelected = isOther
                            ? formData.assistanceTypes.includes("other") ||
                              formData.otherAssistanceType.trim() !== ""
                            : formData.assistanceTypes.includes(
                                type.toLowerCase()
                              );
                          return (
                            <label key={type} className="cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleAssistanceTypeChange(
                                    isOther ? "other" : type.toLowerCase()
                                  )
                                }
                                className="sr-only"
                              />
                              <div
                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                }`}
                              >
                                <span className="text-sm font-medium">
                                  {type}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {errors.assistanceTypes && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.assistanceTypes}
                      </p>
                    )}
                    {(formData.assistanceTypes.includes("other") ||
                      formData.otherAssistanceType.trim()) && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please specify the type of assistance needed *
                        </label>
                        <input
                          type="text"
                          value={formData.otherAssistanceType}
                          onChange={(e) => {
                            setIsFormTouched(true);
                            setFormData((prev) => ({
                              ...prev,
                              otherAssistanceType: e.target.value,
                            }));
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter the type of assistance you need"
                        />
                        {errors.otherAssistanceType && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.otherAssistanceType}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        setIsFormTouched(true);
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                      rows={6}
                      maxLength={1000}
                      placeholder="Urgent help needed for flood victims in downtown area. Multiple families trapped."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && (
                        <p className="text-sm text-red-600">
                          {errors.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 ml-auto">
                        {formData.description.length}/1000 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <X size={20} className="mr-2" /> Previous
                </button>
                {currentStep < 2 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Next <Send size={20} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        Update Request
                        <Send size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {(errors.submit || errors.fetch) && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700">
                    {errors.submit || errors.fetch}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportRequestUpdateForm;
