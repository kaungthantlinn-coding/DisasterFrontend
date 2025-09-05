import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DisasterReportCreateDto,
  DisasterReportDto,
  SeverityLevel,
} from "../types/DisasterReport";
import { DisasterCategory, DisasterTypeDto } from "../types/DisasterType";
import { DisasterTypeService } from "../services/disasterTypeService";
import { ImpactTypeDto } from "../types/ImpactType";
import { ImpactTypeService } from "../services/ImpactTypeService";
import { Camera, MapPin, X, CheckCircle, User, Mail, Send } from "lucide-react";
import { LocationPicker } from "../components/Map";
import {
  createDisasterReport,
  getById,
  update as updateDisasterReport,
} from "../services/disasterReportService";
import { useAuthStore } from "../stores/authStore";
import ReportMap from "../components/ReportMap";
import { NotificationAPI } from "../services/Notification";
import { NotificationType } from "../types/Notification";
import { Footer, Header } from "@/components/Layout";
import { DisasterEventSelector } from "@/components/Common";

interface ReportImpactFormData {
  // Personal Information
  fullName: string;
  email: string;

  // Disaster Details
  title: string;
  disasterCategory: DisasterCategory | undefined;
  disasterTypeId: number | undefined;
  newDisasterTypeName: string;
  disasterEventName: string;
  severity: SeverityLevel;
  timestamp: string;
  description: string;

  // Location & Impact
  latitude: number;
  longitude: number;
  address: string;
  impactTypes: ImpactTypeDto[];
  impactDescription: string;
  impactSeverity: SeverityLevel;
  photos: File[];
}

interface Props {
  authToken: string;
  onSuccess?: () => void;
}

const ReportImpact: React.FC<Props> = ({ authToken, onSuccess }) => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const editMode = Boolean(editId);
  const [prefillDone, setPrefillDone] = useState(false);
  const [reportDataFetched, setReportDataFetched] = useState(false);
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterTypeDto[]>([]);
  const [impactDescription, setImpactDescription] = useState("");
  const [selectedImpacts, setSelectedImpacts] = useState<ImpactTypeDto[]>([]);
  const [selectedDisasterTypeName, setSelectedDisasterTypeName] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [impactTypes, setImpactTypes] = useState<ImpactTypeDto[]>([]);
  const [showImpactOtherInput, setShowImpactOtherInput] = useState(false);
  const [newImpactTypeName, setNewImpactTypeName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [impactSeverities, setImpactSeverities] = useState<
    Record<number, SeverityLevel>
  >({ 0: SeverityLevel.Low });
  const [success, setSuccess] = useState<{ open: boolean; id?: string }>({
    open: false,
    id: undefined,
  });

  const toLocalInput = (iso?: string) => {
    try {
      return iso ? new Date(iso).toISOString().slice(0, 16) : "";
    } catch {
      return "";
    }
  };

  const getToken = () => {
    const token = accessToken || localStorage.getItem("token") || authToken;
    console.log("Auth token:", token);
    return token;
  };

  const [formData, setFormData] = useState<DisasterReportCreateDto>({
    title: "",
    description: "",
    timestamp: "",
    severity: SeverityLevel.Low,
    disasterCategory: undefined,
    disasterTypeId: undefined,
    newDisasterTypeName: "",
    disasterEventName: "",
    latitude: 0,
    longitude: 0,
    address: "",
    coordinatePrecision: 0.001,
    impactDetails: [],
    photos: [],
    photoUrls: [],
  });

  const resetForm = () => {
    setStep(1);
    setSelectedDisasterTypeName("");
    setShowOtherInput(false);
    setSelectedImpacts([]);
    setShowImpactOtherInput(false);
    setNewImpactTypeName("");
    setImpactDescription("");
    setImpactSeverities({ 0: SeverityLevel.Low });
    setErrors({});
    setFormData({
      title: "",
      description: "",
      timestamp: "",
      severity: SeverityLevel.Low,
      disasterCategory: undefined,
      disasterTypeId: undefined,
      newDisasterTypeName: "",
      disasterEventName: "",
      latitude: 0,
      longitude: 0,
      address: "",
      coordinatePrecision: 0.001,
      impactDetails: [],
      photos: [],
      photoUrls: [],
    });
    setPrefillDone(false);
    setReportDataFetched(false);
  };

  const fetchDisasterTypes = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found for fetching disaster types");
        setErrors((prev) => ({
          ...prev,
          auth: "Please log in to fetch disaster types",
        }));
        return;
      }
      const data = await DisasterTypeService.getAll(token);
      console.log("Fetched disaster types:", data);
      const normalizedData = data.map((dt: any) => ({
        ...dt,
        category:
          typeof dt.category === "string"
            ? dt.category === "Natural"
              ? DisasterCategory.Natural
              : DisasterCategory.NonNatural
            : dt.category,
      }));
      setDisasterTypes(normalizedData || []);
    } catch (err) {
      console.error("Failed to load disaster types:", err);
      setDisasterTypes([]);
      setErrors((prev) => ({
        ...prev,
        disasterTypes: "Failed to load disaster types",
      }));
    }
  };

  const fetchImpactTypes = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found for fetching impact types");
        return;
      }
      const data = await ImpactTypeService.getAll(token);
      console.log("Fetched impact types:", data);
      setImpactTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load impact types:", err);
      setImpactTypes([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated && getToken()) {
      fetchDisasterTypes();
      fetchImpactTypes();
    } else {
      console.log("User not authenticated, redirecting to login...");
      navigate("/login");
    }
  }, [isAuthenticated, accessToken, authToken, navigate]);

  useEffect(() => {
    if (!editMode || !editId || prefillDone) return;
    const token = getToken();
    if (!token) return;

    (async () => {
      try {
        console.log("Fetching report for edit, ID:", editId);
        const report: DisasterReportDto = await getById(editId, token);
        console.log("Fetched report data:", report);

        // Set form data
        setFormData((prev) => ({
          ...prev,
          title: report.title || "",
          description: report.description || "",
          timestamp: toLocalInput(report.timestamp),
          severity: report.severity || SeverityLevel.Low,
          disasterCategory:
            report.disasterCategory !== undefined &&
            report.disasterCategory !== null
              ? typeof report.disasterCategory === "string"
                ? report.disasterCategory === "Natural"
                  ? DisasterCategory.Natural
                  : DisasterCategory.NonNatural
                : typeof report.disasterCategory === "number"
                ? report.disasterCategory === 0
                  ? DisasterCategory.Natural
                  : DisasterCategory.NonNatural
                : report.disasterCategory
              : undefined,
          disasterTypeId: report.disasterTypeId || undefined,
          newDisasterTypeName: "",
          disasterEventName: report.disasterEventName || "",
          latitude: report.latitude ?? 0,
          longitude: report.longitude ?? 0,
          address: report.address || "",
          coordinatePrecision: report.coordinatePrecision ?? 0.001,
          photos: [],
          impactDetails:
            report.impactDetails?.map((detail) => ({
              impactTypeIds: detail.impactTypeIds || [],
              description: detail.description || "",
              severity: detail.severity || SeverityLevel.Low,
            })) || [],
        }));

        // Set disaster type name
        setSelectedDisasterTypeName(report.disasterTypeName || "");

        // Process impact details once impactTypes are loaded
        if (impactTypes.length > 0) {
          const collectedImpacts: ImpactTypeDto[] = [];
          const impactSeverityMap: Record<number, SeverityLevel> = {};
          if (report.impactDetails && Array.isArray(report.impactDetails)) {
            report.impactDetails.forEach((detail, index) => {
              if (detail.impactTypeIds && Array.isArray(detail.impactTypeIds)) {
                detail.impactTypeIds.forEach((impactId: number) => {
                  const found = impactTypes.find((it) => it.id === impactId);
                  if (found) collectedImpacts.push(found);
                });
              }
              impactSeverityMap[index] = detail.severity || SeverityLevel.Low;
            });
            setImpactDescription(report.impactDetails[0]?.description || "");
          }

          // Remove duplicates from collected impacts
          const uniqueImpacts = Array.from(
            new Map(collectedImpacts.map((i) => [i.id, i])).values()
          );
          setSelectedImpacts(uniqueImpacts);

          // Set impact severities
          // Set impact severities
          setImpactSeverities(impactSeverityMap);

          console.log("Prefilled data:", {
            formData: { ...formData },
            selectedDisasterTypeName,
            selectedImpacts: uniqueImpacts,
            impactSeverities,
            photoUrls: report.photoUrls,
          });

          setReportDataFetched(true);
          // Only set prefillDone to true if impactTypes are already loaded
          if (impactTypes.length > 0) {
            setPrefillDone(true);
          }
        }
      } catch (e) {
        console.error("Failed to prefill report for edit:", e);
        setErrors((prev) => ({
          ...prev,
          prefill: "Failed to load report data for editing",
        }));
      }
    })();
  }, [editMode, editId, prefillDone, impactTypes]);

  useEffect(() => {
    if (
      !editMode ||
      !editId ||
      !reportDataFetched ||
      prefillDone ||
      impactTypes.length === 0
    )
      return;

    // Process impact details
    const collectedImpacts: ImpactTypeDto[] = [];
    const impactSeverityMap: Record<number, SeverityLevel> = {};

    if (formData.impactDetails && formData.impactDetails.length > 0) {
      formData.impactDetails.forEach((detail, index) => {
        if (detail.impactTypeIds && Array.isArray(detail.impactTypeIds)) {
          detail.impactTypeIds.forEach((impactId: number) => {
            const found = impactTypes.find((it) => it.id === impactId);
            if (found) collectedImpacts.push(found);
          });
        }
        impactSeverityMap[index] = detail.severity || SeverityLevel.Low;
      });

      setImpactDescription(formData.impactDetails[0]?.description || "");
    }

    // Remove duplicates from collected impacts
    const uniqueImpacts = Array.from(
      new Map(collectedImpacts.map((i) => [i.id, i])).values()
    );
    setSelectedImpacts(uniqueImpacts);

    // Set impact severities
    setImpactSeverities(impactSeverityMap);

    setPrefillDone(true);
  }, [
    editMode,
    editId,
    reportDataFetched,
    prefillDone,
    impactTypes,
    formData.impactDetails,
  ]);

  const handleCategorySelect = (category: DisasterCategory) => {
    console.log("Selected category:", category, typeof category);
    const defaultType = disasterTypes.find((dt) => dt.category === category);
    setFormData((f) => ({
      ...f,
      disasterCategory: category,
      disasterTypeId: defaultType ? defaultType.id : undefined,
    }));
    setShowOtherInput(false);
    setSelectedDisasterTypeName("");
  };

  const handleTypeSelect = (typeId: number) => {
    console.log("Selected disaster type ID:", typeId);
    const type = disasterTypes.find((t) => t.id === typeId);
    setFormData((prev) => ({
      ...prev,
      disasterTypeId: typeId,
    }));
    setSelectedDisasterTypeName(type ? type.name : "");
    setShowOtherInput(false);
  };

  const createNewDisasterType = async () => {
    if (
      !formData.newDisasterTypeName?.trim() ||
      formData.disasterCategory === undefined ||
      formData.disasterCategory === null
    )
      return;
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }
      const dto = {
        name: formData.newDisasterTypeName,
        category: formData.disasterCategory,
      };
      await DisasterTypeService.create(dto, token);
      await fetchDisasterTypes();
      setFormData((prev) => ({ ...prev, newDisasterTypeName: "" }));
      setShowOtherInput(false);
    } catch (err) {
      console.error("Failed to create new type:", err);
      setErrors((prev) => ({
        ...prev,
        newDisasterType: "Failed to create new disaster type",
      }));
    }
  };

  const createNewImpactType = async () => {
    if (!newImpactTypeName.trim()) return;
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }
      await ImpactTypeService.create({ name: newImpactTypeName }, token);
      await fetchImpactTypes();
      setNewImpactTypeName("");
      setShowImpactOtherInput(false);
    } catch (err) {
      console.error("Failed to create new impact type:", err);
      setErrors((prev) => ({
        ...prev,
        newImpactType: "Failed to create new impact type",
      }));
    }
  };

  const handleImpactSelect = (impact: ImpactTypeDto) => {
    setShowImpactOtherInput(false);
    setNewImpactTypeName("");
    setSelectedImpacts((prev) =>
      prev.some((i) => i.id === impact.id)
        ? prev.filter((i) => i.id !== impact.id)
        : [...prev, impact]
    );
  };

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    console.log("📸 Photo upload started");
    const filesArray = Array.from(e.target.files);
    const maxPhotosAllowed = 10;
    const currentCount = formData.photos.length;
    const availableSlots = maxPhotosAllowed - currentCount;
    const filesToAdd = filesArray.slice(0, availableSlots);
    const filteredFiles = filesToAdd.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    if (filteredFiles.length < filesToAdd.length) {
      setErrors((prev) => ({
        ...prev,
        photos: "Some files were skipped because they exceed 10MB size limit.",
      }));
    }
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...filteredFiles],
    }));
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return {
        ...prev,
        photos: newPhotos,
      };
    });
  };

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address,
      }));
    },
    []
  );

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    console.log(`🔍 Validating step ${step}...`);
    if (step === 1) {
      if (!formData.title) {
        newErrors.title = "Please insert a disaster title";
      }
      if (
        formData.disasterCategory === undefined ||
        formData.disasterCategory === null
      ) {
        newErrors.disasterCategory = "Please select a disaster category";
      }
      if (!formData.disasterTypeId && !showOtherInput) {
        newErrors.disasterType = "Please select a disaster type";
      }
      if (formData.severity === undefined || formData.severity === null) {
        newErrors.severity = "Please select severity level";
      }
      if (!formData.timestamp) {
        newErrors.timestamp = "Please select date and time";
      }
      if (!formData.description) {
        newErrors.description = "Please insert description";
      }
    }
    if (step === 2) {
      if (!formData.latitude || !formData.longitude || !formData.address) {
        newErrors.location = "Please select a location";
      }
      if (selectedImpacts.length === 0) {
        newErrors.impact = "Please select at least one impact type";
      }
      if (showImpactOtherInput && !newImpactTypeName.trim()) {
        newErrors.newImpactType = "Please enter a new impact type";
      }
      if (selectedImpacts.length > 0 && !impactDescription) {
        newErrors.impactDescription = "Please insert impact's description";
      }
      if (impactSeverities[0] === undefined) {
        newErrors.impactSeverity = "Please select an impact severity level";
      }
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    if (!step1Valid) {
      setStep(1);
      return;
    }
    if (!step2Valid) {
      setStep(2);
      return;
    }
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setErrors((prev) => ({
          ...prev,
          submit: "Please login to submit a report",
        }));
        setIsLoading(false);
        return;
      }
      const impactDetails = selectedImpacts.map((impact) => ({
        impactTypeIds: [impact.id],
        description: impactDescription || "Impact description",
        severity: impactSeverities[0] || SeverityLevel.Low,
      }));
      const submissionFormData = new FormData();
      submissionFormData.append(
        "Title",
        formData.title || `${selectedDisasterTypeName} Disaster Report`
      );
      submissionFormData.append(
        "Description",
        formData.description || impactDescription || "Disaster impact report"
      );
      submissionFormData.append("Timestamp", formData.timestamp);
      submissionFormData.append("Severity", formData.severity.toString());
      if (formData.disasterCategory !== undefined) {
        submissionFormData.append(
          "DisasterCategory",
          formData.disasterCategory.toString()
        );
      }
      if (formData.disasterTypeId !== undefined) {
        submissionFormData.append(
          "DisasterTypeId",
          formData.disasterTypeId.toString()
        );
      }
      submissionFormData.append(
        "NewDisasterTypeName",
        formData.newDisasterTypeName || ""
      );
      submissionFormData.append(
        "DisasterEventName",
        formData.disasterEventName || ""
      );
      submissionFormData.append("Latitude", formData.latitude.toString());
      submissionFormData.append("Longitude", formData.longitude.toString());
      submissionFormData.append("Address", formData.address);
      submissionFormData.append(
        "CoordinatePrecision",
        formData.coordinatePrecision?.toString() || "0.001"
      );
      impactDetails.forEach((impact, i) => {
        submissionFormData.append(
          `ImpactDetails[${i}].Description`,
          impact.description
        );
        submissionFormData.append(
          `ImpactDetails[${i}].Severity`,
          impact.severity.toString()
        );
        impact.impactTypeIds.forEach((id, j) => {
          submissionFormData.append(
            `ImpactDetails[${i}].ImpactTypeIds[${j}]`,
            id.toString()
          );
        });
      });
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          submissionFormData.append("Photos", photo);
        }
      });
      const createdReport = await createDisasterReport(
        submissionFormData,
        token
      );
      try {
        await NotificationAPI.createNotification(
          {
            title: "New disaster report submitted",
            message: `${user?.name || "A user"} submitted "${
              formData.title || selectedDisasterTypeName || "Disaster Report"
            }"`,
            type: NotificationType.ReportSubmitted,
            userId: user?.userId || "",
            disasterReportId: (createdReport as any)?.id || "",
          },
          token
        );
      } catch (notifyErr) {
        console.warn(
          "Failed to create admin notification (non-blocking):",
          notifyErr
        );
      }
      setSuccess({ open: true, id: (createdReport as any)?.id || "" });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit report. Please try again.";
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editMode || !editId) return;
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    if (!step1Valid) {
      setStep(1);
      return;
    }
    if (!step2Valid) {
      setStep(2);
      return;
    }
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setErrors((prev) => ({
          ...prev,
          submit: "Please login to update a report",
        }));
        setIsLoading(false);
        return;
      }
      const impactDetails = selectedImpacts.map((impact) => ({
        impactTypeIds: [impact.id],
        description: impactDescription || "Impact description",
        severity: impactSeverities[0] || SeverityLevel.Low,
      }));
      const submissionFormData = new FormData();
      submissionFormData.append(
        "Title",
        formData.title || selectedDisasterTypeName || "Disaster Report"
      );
      submissionFormData.append(
        "Description",
        formData.description || impactDescription || "Disaster impact report"
      );
      submissionFormData.append("Timestamp", formData.timestamp);
      submissionFormData.append("Severity", formData.severity.toString());
      if (formData.disasterCategory !== undefined) {
        submissionFormData.append(
          "DisasterCategory",
          formData.disasterCategory.toString()
        );
      }
      if (formData.disasterTypeId !== undefined) {
        submissionFormData.append(
          "DisasterTypeId",
          formData.disasterTypeId.toString()
        );
      }
      submissionFormData.append(
        "NewDisasterTypeName",
        formData.newDisasterTypeName || ""
      );
      submissionFormData.append(
        "DisasterEventName",
        formData.disasterEventName || ""
      );
      submissionFormData.append("Latitude", formData.latitude.toString());
      submissionFormData.append("Longitude", formData.longitude.toString());
      submissionFormData.append("Address", formData.address);
      submissionFormData.append(
        "CoordinatePrecision",
        formData.coordinatePrecision?.toString() || "0.001"
      );
      impactDetails.forEach((impact, i) => {
        submissionFormData.append(
          `ImpactDetails[${i}].Description`,
          impact.description
        );
        submissionFormData.append(
          `ImpactDetails[${i}].Severity`,
          impact.severity.toString()
        );
        impact.impactTypeIds.forEach((id, j) => {
          submissionFormData.append(
            `ImpactDetails[${i}].ImpactTypeIds[${j}]`,
            id.toString()
          );
        });
      });
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          submissionFormData.append("Photos", photo);
        }
      });
      await updateDisasterReport(editId, submissionFormData, token);
      try {
        await NotificationAPI.createNotification(
          {
            title: "Disaster report updated",
            message: `${user?.name || "A user"} updated "${
              formData.title || selectedDisasterTypeName || "Disaster Report"
            }"`,
            type: NotificationType.ReportSubmitted, // Replace with NotificationType.ReportUpdated if available
            userId: user?.userId || "",
            disasterReportId: editId,
          },
          token
        );
      } catch (notifyErr) {
        console.warn(
          "Failed to create update notification (non-blocking):",
          notifyErr
        );
      }
      console.log("✅ Report Updated successfully!");
      setSuccess({ open: true, id: editId });
      navigate(-1);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("❌ Update error:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update report. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getDisasterCategoryString = (
    category: DisasterCategory | undefined
  ) => {
    switch (category) {
      case DisasterCategory.Natural:
        return "Natural Disasters";
      case DisasterCategory.NonNatural:
        return "Non-Natural Disasters";
      default:
        return "Not specified";
    }
  };

  const getSeverityString = (severity: SeverityLevel | undefined) => {
    switch (severity) {
      case SeverityLevel.Low:
        return "Low";
      case SeverityLevel.Medium:
        return "Medium";
      case SeverityLevel.High:
        return "High";
      case SeverityLevel.Critical:
        return "Critical";
      default:
        return "Not specified";
    }
  };

  return (
    <div className="py-8">
      <Header/>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <main>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {editMode ? "Update Disaster Report" : "Report Disaster Impact"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {editMode
              ? "Update your disaster report with the latest information"
              : "Help us respond effectively by providing accurate disaster information"
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center space-x-8">
            {[
              { number: 1, title: "Personal Info" },
              { number: 2, title: "Disaster Details" },
              { number: 3, title: "Review & Submit" },
            ].map((stepInfo, index) => {
              const stepNumber = stepInfo.number;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;

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
                      {stepInfo.title}
                    </span>
                  </div>
                  {index < 2 && (
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

        {/* Success Modal */}
        {success.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {editMode
                  ? "Report Updated Successfully"
                  : "Report Submitted Successfully"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your disaster report has been{" "}
                {editMode ? "updated" : "submitted"}. Our team will review it
                shortly.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50"
                  type="button"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    if (success.id) navigate(`/reports/${success.id}`);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  type="button"
                >
                  View Report
                </button>
                <button
                  onClick={() => {
                    setSuccess({ open: false, id: undefined });
                    resetForm();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="sm:col-span-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  type="button"
                >
                  Create Another Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {editMode ? "Edit Disaster Report" : "Report a Disaster Impact"}
            </h2>
          </div>

          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Disaster Information
              </h3>
              <div>
                <label className="block mb-2 font-medium text-gray-700 mb-2">
                  Title{" "}
                  {errors.title && (
                    <span className="text-red-500 text-sm">
                      - {errors.title}
                    </span>
                  )}
                </label>
                <textarea
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disaster Category *{" "}
                {errors.disasterCategory && (
                  <span className="text-red-500 text-sm">
                    - {errors.disasterCategory}
                  </span>
                )}
              </label>

              <div className="flex gap-4 mb-4">
                {[
                  {
                    label: "Natural Disasters",
                    value: DisasterCategory.Natural,
                  },
                  {
                    label: "Non-Natural Disasters",
                    value: DisasterCategory.NonNatural,
                  },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                  ${
                    formData.disasterCategory === cat.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border ${
                        formData.disasterCategory === cat.value
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}
                    />
                    {cat.label}
                  </button>
                ))}
              </div>

              {formData.disasterCategory !== undefined && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Specific Type *{" "}
                    {errors.disasterType && (
                      <span className="text-red-500 text-sm">
                        - {errors.disasterType}
                      </span>
                    )}
                  </label>
                  {disasterTypes.length > 0 ? (
                    disasterTypes.filter(
                      (dt) => dt.category === formData.disasterCategory
                    ).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {disasterTypes
                          .filter(
                            (dt) => dt.category === formData.disasterCategory
                          )
                          .map((dt) => (
                            <button
                              key={dt.id}
                              type="button"
                              onClick={() => handleTypeSelect(dt.id)}
                              className={`p-3 border rounded-xl text-sm transition-all duration-200
                            ${
                              formData.disasterTypeId === dt.id
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                            >
                              {dt.name}
                            </button>
                          ))}
                        <button
                          type="button"
                          onClick={() => {
                            setShowOtherInput(true);
                            setFormData((prev) => ({
                              ...prev,
                              disasterTypeId: undefined,
                            }));
                          }}
                          className={`p-3 border rounded-xl text-sm transition-all duration-200
                        ${
                          showOtherInput
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        >
                          + Other
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No disaster types available for this category.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500">
                      Loading disaster types...
                    </p>
                  )}
                  {showOtherInput && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Disaster Type{" "}
                        {errors.newDisasterType && (
                          <span className="text-red-500 text-sm">
                            - {errors.newDisasterType}
                          </span>
                        )}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter new disaster type"
                          className="border p-2 rounded-lg flex-1"
                          value={formData.newDisasterTypeName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              newDisasterTypeName: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg"
                          onClick={createNewDisasterType}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(formData.disasterTypeId !== undefined || showOtherInput) && (
                <DisasterEventSelector
                  value={formData.disasterEventName || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      disasterEventName: value,
                    }))
                  }
                  error={errors.disasterEventName}
                />
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Severity Level *{" "}
                  {errors.severity && (
                    <span className="text-red-500 text-sm">
                      - {errors.severity}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      value: SeverityLevel.Low,
                      label: "Low",
                      color: "bg-green-500",
                    },
                    {
                      value: SeverityLevel.Medium,
                      label: "Medium",
                      color: "bg-yellow-500",
                    },
                    {
                      value: SeverityLevel.High,
                      label: "High",
                      color: "bg-orange-500",
                    },
                    {
                      value: SeverityLevel.Critical,
                      label: "Critical",
                      color: "bg-red-500",
                    },
                  ].map((severity) => (
                    <button
                      key={severity.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          severity: severity.value as SeverityLevel,
                        }))
                      }
                      className={`p-3 border rounded-xl flex flex-col items-center transition-all duration-200
                    ${
                      formData.severity === severity.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${severity.color} mb-2`}
                      />
                      <span className="text-sm font-medium">
                        {severity.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="dateTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  When did this occur? *{" "}
                  {errors.timestamp && (
                    <span className="text-red-500 text-sm">
                      - {errors.timestamp}
                    </span>
                  )}
                </label>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded-lg mb-4"
                  value={formData.timestamp}
                  max={new Date().toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, timestamp: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 mb-2">
                  Detailed Description{" "}
                  {errors.description && (
                    <span className="text-red-500 text-sm">
                      - {errors.description}
                    </span>
                  )}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed information about what happened, current situation, and any immediate concerns..."
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (validateStep(1)) handleNext();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Location *{" "}
                  {errors.location && (
                    <span className="text-red-500 text-sm">
                      - {errors.location}
                    </span>
                  )}
                </label>
                <div className="border border-gray-200 rounded-xl relative">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={
                      formData.latitude && formData.longitude
                        ? {
                            lat: formData.latitude,
                            lng: formData.longitude,
                            address: formData.address || "",
                          }
                        : null
                    }
                    height="450px"
                  />
                </div>
                {formData.address && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center">
                    <MapPin size={16} className="text-green-600 mr-2" />
                    <span className="text-sm text-green-800">
                      {formData.address}
                    </span>
                  </div>
                )}
              </div>

              <label className="block mb-2 font-medium">
                Type of Impact *{" "}
                {errors.impact && (
                  <span className="text-red-500 text-sm">
                    - {errors.impact}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Array.isArray(impactTypes) && impactTypes.length > 0 ? (
                  <>
                    {impactTypes.map((impact) => (
                      <label
                        key={impact.id}
                        className="flex items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedImpacts.some(
                            (i) => i.id === impact.id
                          )}
                          onChange={() => handleImpactSelect(impact)}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{impact.name}</span>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowImpactOtherInput(true);
                        setSelectedImpacts([]);
                      }}
                      className={`p-3 border text-left rounded-xl text-sm transition-all duration-200
                    ${
                      showImpactOtherInput
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    >
                      + Other
                    </button>
                    {showImpactOtherInput && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Impact Type{" "}
                          {errors.newImpactType && (
                            <span className="text-red-500 text-sm">
                              - {errors.newImpactType}
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter new impact type"
                            className="border p-2 rounded-lg flex-1"
                            value={newImpactTypeName}
                            onChange={(e) =>
                              setNewImpactTypeName(e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            onClick={createNewImpactType}
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No impact types found.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Impact Severity Level *{" "}
                  {errors.impactSeverity && (
                    <span className="text-red-500 text-sm">
                      - {errors.impactSeverity}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      value: SeverityLevel.Low,
                      label: "Low",
                      color: "bg-green-500",
                    },
                    {
                      value: SeverityLevel.Medium,
                      label: "Medium",
                      color: "bg-yellow-500",
                    },
                    {
                      value: SeverityLevel.High,
                      label: "High",
                      color: "bg-orange-500",
                    },
                    {
                      value: SeverityLevel.Critical,
                      label: "Critical",
                      color: "bg-red-500",
                    },
                  ].map((severity) => (
                    <button
                      key={severity.value}
                      type="button"
                      onClick={() =>
                        setImpactSeverities((prev) => ({
                          ...prev,
                          [0]: severity.value as SeverityLevel,
                        }))
                      }
                      className={`p-3 border rounded-xl flex flex-col items-center transition-all duration-200
                    ${
                      impactSeverities[0] === severity.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${severity.color} mb-2`}
                      />
                      <span className="text-sm font-medium">
                        {severity.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="block mb-2 font-medium">
                Detailed Impact Description{" "}
                {errors.impactDescription && (
                  <span className="text-red-500 text-sm">
                    - {errors.impactDescription}
                  </span>
                )}
              </label>
              <textarea
                className="w-full border p-2 rounded-lg mb-4"
                rows={3}
                value={impactDescription}
                onChange={(e) => setImpactDescription(e.target.value)}
              />

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Photos (Optional - Max 10 photos, 10MB each){" "}
                  {errors.photos && (
                    <span className="text-red-500 text-sm">
                      - {errors.photos}
                    </span>
                  )}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload photos</p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </label>
                </div>
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={
                            photo instanceof File
                              ? URL.createObjectURL(photo)
                              : photo.url
                          }
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  type="button"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (validateStep(2)) handleNext();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-3">Review & Submit</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Disaster Details
                </h4>
                <div className="space-y-2 pl-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Disaster Category:
                    </label>
                    <p className="text-sm text-gray-600">
                      {getDisasterCategoryString(formData.disasterCategory)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Disaster Type:
                    </label>
                    <p className="text-sm text-gray-600">
                      {selectedDisasterTypeName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Disaster Event Name:
                    </label>
                    <p className="text-sm text-gray-600">
                      {formData.disasterEventName || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Description:
                    </label>
                    <p className="text-sm text-gray-600">
                      {formData.description || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Severity:
                    </label>
                    <p className="text-sm text-gray-600">
                      {getSeverityString(formData.severity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-black w-32">
                      Timestamp:
                    </label>
                    <p className="text-sm text-gray-600">
                      {formData.timestamp || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-black mb-3">
                    Location
                  </h4>
                  {formData.latitude !== 0 && formData.longitude !== 0 ? (
                    <ReportMap
                      lat={formData.latitude}
                      lng={formData.longitude}
                      address={formData.address}
                    />
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg text-gray-500">
                      📍 No location available
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Impact Information
                  </h4>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-black w-32">
                        Impact Details:
                      </label>
                      <p className="text-sm text-gray-600">
                        {selectedImpacts
                          .map((impact) => impact.name)
                          .join(", ") || "Not specified"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-black w-32">
                        Impact Description:
                      </label>
                      <p className="text-sm text-gray-600">
                        {impactDescription || "Not specified"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-black w-32">
                        Impact Severity:
                      </label>
                      <p className="text-sm text-gray-600">
                        {getSeverityString(impactSeverities[0])}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Media
                  </h4>
                  <div className="space-y-3 pl-2">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Photos
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.photos.length} photos
                      </p>
                      {formData.photos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={
                                  photo instanceof File
                                    ? URL.createObjectURL(photo)
                                    : photo.url
                                }
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    type="button"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Back
                    </button>
                    {isLoading ? (
                      <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg flex items-center"
                        disabled
                      >
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editMode ? "Saving..." : "Submitting..."}
                      </button>
                    ) : (
                      <button
                        onClick={editMode ? handleUpdate : handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        {editMode ? "Save" : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
                {errors.submit && (
                  <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-lg">
                    {errors.submit}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Important Notice</h3>
                <p className="text-sm text-gray-600">
                  Your report will be reviewed by our emergency response team.
                  Please provide accurate information to ensure timely
                  assistance.
                </p>
              </div>
            </div>
          )}
        </div>
        </main>
        </div>
      <Footer />
    </div>
    
  );
};

export default ReportImpact;
