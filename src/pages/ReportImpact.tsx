import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DisasterReportCreateDto,
  SeverityLevel,
} from "../types/DisasterReport";
import { DisasterCategory, DisasterTypeDto } from "../types/DisasterType";
import { DisasterTypeService } from "../services/disasterTypeService";
import { ImpactTypeDto } from "../types/ImpactType";
import { ImpactTypeService } from "../services/ImpactTypeService";
import { Camera, MapPin, X, CheckCircle } from "lucide-react";
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

interface Props {
  authToken: string;
  onSuccess?: () => void;
}

const ReportImpact: React.FC<Props> = ({ authToken, onSuccess }) => {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const editMode = Boolean(editId);
  const [prefillDone, setPrefillDone] = useState(false);
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterTypeDto[]>([]);
  const [impactDescription, setImpactDescription] = useState("");
  const [selectedImpacts, setSelectedImpacts] = useState<ImpactTypeDto[]>([]);
  const [selectedDisasterTypeName, setSelectedDisasterTypeName] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [newDisasterTypeName, setNewDisasterTypeName] = useState("");
  const [impactTypes, setImpactTypes] = useState<ImpactTypeDto[]>([]);
  const [showImpactOtherInput, setShowImpactOtherInput] = useState(false);
  const [newImpactTypeName, setNewImpactTypeName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [impactSeverities, setImpactSeverities] = useState<
    Record<number, SeverityLevel>
  >({});
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
    disasterTypeId: 0,
    newDisasterTypeName: "",
    disasterEventName: "",
    latitude: 0,
    longitude: 0,
    address: "",
    coordinatePrecision: 0.001,
    impactDetails: [],
    photos: [],
  });

  const resetForm = () => {
    setStep(1);
    setSelectedDisasterTypeName("");
    setShowOtherInput(false);
    setNewDisasterTypeName("");
    setSelectedImpacts([]);
    setShowImpactOtherInput(false);
    setNewImpactTypeName("");
    setImpactDescription("");
    setImpactSeverities({});
    setErrors({});
    setFormData({
      title: "",
      description: "",
      timestamp: "",
      severity: SeverityLevel.Low,
      disasterCategory: undefined,
      disasterTypeId: 0,
      newDisasterTypeName: "",
      disasterEventName: "",
      latitude: 0,
      longitude: 0,
      address: "",
      coordinatePrecision: 0.001,
      impactDetails: [],
      photos: [],
    });
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
      // Normalize category to number if API returns strings
      const normalizedData = data.map((dt: any) => ({
        ...dt,
        category:
          typeof dt.category === "string"
            ? dt.category === "Natural"
              ? 0
              : 1
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
        const r = await getById(editId, token);
        setFormData((prev) => ({
          ...prev,
          title: r.title || "",
          description: r.description || "",
          timestamp: toLocalInput(r.timestamp),
          severity: r.severity,
          disasterTypeId: r.disasterTypeId || 0,
          disasterEventName: prev.disasterEventName || "",
          latitude: r.latitude ?? 0,
          longitude: r.longitude ?? 0,
          address: r.address || "",
        }));
        setSelectedDisasterTypeName(r.disasterTypeName || "");
        const collected: ImpactTypeDto[] = [];
        (r.impactDetails || []).forEach((d: any) => {
          if (Array.isArray(d.impactTypes) && d.impactTypes.length > 0) {
            d.impactTypes.forEach((t: any) => {
              if (t && typeof t.id === "number") {
                collected.push({ id: t.id, name: t.name } as ImpactTypeDto);
              }
            });
          } else if (
            Array.isArray(d.impactTypeIds) &&
            d.impactTypeIds.length > 0
          ) {
            d.impactTypeIds.forEach((iid: number) => {
              const found = (impactTypes || []).find((it) => it.id === iid);
              if (found) collected.push(found);
            });
          }
        });
        const unique = Array.from(
          new Map(collected.map((i) => [i.id, i])).values()
        );
        setSelectedImpacts(unique);
        if (
          r.impactDetails &&
          r.impactDetails[0] &&
          typeof (r.impactDetails[0] as any).severity === "number"
        ) {
          setImpactSeverities((prev) => ({
            ...prev,
            0: (r.impactDetails[0] as any).severity,
          }));
        }
        setPrefillDone(true);
      } catch (e) {
        console.error("Failed to prefill report for edit:", e);
      }
    })();
  }, [editMode, editId, prefillDone, impactTypes]);

  const handleCategorySelect = (category: DisasterCategory) => {
    console.log("Selected category:", category);
    console.log("Current disaster types:", disasterTypes);
    const defaultType = disasterTypes.find((dt) => dt.category === category);
    console.log("Default type for category:", defaultType);
    setFormData((f) => ({
      ...f,
      disasterCategory: category,
      disasterTypeId: defaultType ? defaultType.id : f.disasterTypeId, // Preserve existing disasterTypeId if no default
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
    if (!newDisasterTypeName.trim() || formData.disasterCategory == null)
      return;
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }
      const dto = {
        name: newDisasterTypeName,
        category: formData.disasterCategory,
      };
      await DisasterTypeService.create(dto, token);
      await fetchDisasterTypes();
      const created = disasterTypes.find(
        (t) =>
          t.name.toLowerCase() === newDisasterTypeName.toLowerCase() &&
          t.category === formData.disasterCategory
      );
      if (created) handleTypeSelect(created.id);
      setNewDisasterTypeName("");
      setShowOtherInput(false);
    } catch (err) {
      console.error("Failed to create new type:", err);
      alert("Failed to create new disaster type");
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
      const created = impactTypes.find(
        (i) => i.name.toLowerCase() === newImpactTypeName.toLowerCase()
      );
      if (created) {
        setSelectedImpacts((prev) => [...prev, created]);
      }
      setNewImpactTypeName("");
      setShowImpactOtherInput(false);
    } catch (err) {
      console.error("Failed to create new impact type:", err);
      alert("Failed to create new impact type");
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
    console.log("Files selected:", e.target.files.length);
    const filesArray = Array.from(e.target.files);
    const maxPhotosAllowed = 10;
    const currentCount = formData.photos.length;
    const availableSlots = maxPhotosAllowed - currentCount;
    const filesToAdd = filesArray.slice(0, availableSlots);
    const filteredFiles = filesToAdd.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    console.log("Current photos count:", currentCount);
    console.log("Files to add:", filesToAdd.length);
    console.log("Filtered files:", filteredFiles.length);
    if (filteredFiles.length < filesToAdd.length) {
      alert("Some files were skipped because they exceed 10MB size limit.");
    }
    setFormData((prev) => {
      const newPhotos = [...prev.photos, ...filteredFiles];
      console.log("Updated photos array:", newPhotos.length);
      return {
        ...prev,
        photos: newPhotos,
      };
    });
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
      console.log("📋 Step 1 form data:", {
        disasterTypeId: formData.disasterTypeId,
        showOtherInput: showOtherInput,
        severity: formData.severity,
        timestamp: formData.timestamp,
      });
      if (formData.disasterTypeId === 0 && !showOtherInput) {
        newErrors.disasterType = "Please select a disaster type";
        console.log("❌ Disaster type validation failed");
      }
      if (formData.severity === undefined || formData.severity === null) {
        newErrors.severity = "Please select severity level";
        console.log("❌ Severity validation failed");
      }
      if (!formData.timestamp) {
        newErrors.timestamp = "Please select date and time";
        console.log("❌ Timestamp validation failed");
      }
    }
    if (step === 2) {
      console.log("📋 Step 2 form data:", {
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        selectedImpactsLength: selectedImpacts.length,
      });
      if (!formData.latitude || !formData.longitude || !formData.address) {
        newErrors.location = "Please select a location";
        console.log("❌ Location validation failed");
      }
      if (selectedImpacts.length === 0) {
        newErrors.impact = "Please select at least one impact type";
        console.log("❌ Impact validation failed");
      }
    }
    console.log("📝 Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("🚀 Submit button clicked");
    console.log("📋 Current form data:", formData);
    console.log("📋 Current state:", { showOtherInput, selectedImpacts });
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    console.log("✅ Step 1 valid:", step1Valid);
    console.log("✅ Step 2 valid:", step2Valid);
    if (!step1Valid || !step2Valid) {
      console.log("❌ Validation failed, stopping submission");
      alert("Please check all required fields in all steps before submitting.");
      return;
    }
    try {
      setIsLoading(true);
      console.log("🔄 Setting loading state to true");
      const token = getToken();
      console.log("🔑 Token:", token ? "Available" : "Not available");
      if (!token) {
        alert("Please login to submit a report");
        setIsLoading(false);
        return;
      }
      const impactDetails = selectedImpacts.map((impact) => ({
        impactTypeNames: [impact.name],
        description: impactDescription || "Impact description",
        severity: impactSeverities[0] || SeverityLevel.Low,
        impactTypeIds: [impact.id],
      }));
      console.log("📦 Impact details prepared:", impactDetails);
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
      submissionFormData.append(
        "DisasterTypeId",
        (formData.disasterTypeId || 0).toString()
      );
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
      submissionFormData.append("CoordinatePrecision", "0.001");
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
      console.log("📸 Appending photos...");
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          console.log(`📸 Adding photo ${index + 1}:`, photo.name);
          submissionFormData.append("Photos", photo);
        }
      });
      console.log("🔍 === DEBUGGING SUBMISSION DATA ===");
      for (let [key, value] of submissionFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log("🔍 === DEBUGGING SUBMISSION DATA ===");
      console.log("🚀 Sending request to API...");
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
            disasterReportId: createdReport.id,
          },
          token
        );
      } catch (notifyErr) {
        console.warn(
          "Failed to create admin notification (non-blocking):",
          notifyErr
        );
      }
      console.log("✅ Report submitted successfully!");
      setSuccess({ open: true, id: createdReport.id });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("❌ Submit error:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit report. Please try again.";
      setErrors({
        submit: errorMessage,
      });
      alert(`Error submitting report: ${errorMessage}`);
    } finally {
      console.log("🔄 Resetting loading state");
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editMode || !editId) return;
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    if (!step1Valid || !step2Valid) {
      alert("Please check all required fields in all steps before saving.");
      return;
    }
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        alert("Please login to update a report");
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
          String(formData.disasterCategory)
        );
      }
      submissionFormData.append(
        "DisasterTypeId",
        String(formData.disasterTypeId || 0)
      );
      submissionFormData.append(
        "NewDisasterTypeName",
        formData.newDisasterTypeName || ""
      );
      submissionFormData.append(
        "DisasterEventName",
        formData.disasterEventName || ""
      );
      submissionFormData.append("Latitude", String(formData.latitude));
      submissionFormData.append("Longitude", String(formData.longitude));
      submissionFormData.append("Address", formData.address);
      submissionFormData.append("CoordinatePrecision", "0.001");
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
      alert("Report updated successfully!");
      navigate(-1);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("❌ Update error:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update report. Please try again.";
      setErrors({ submit: errorMessage });
      alert(`Error updating report: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {success.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Report Submitted Successfully
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your disaster report has been submitted. Our team will review it
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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {editMode ? "Edit Disaster Report" : "Report a Disaster Impact"}
        </h2>
        {editMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              type="button"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Disaster Information</h3>
          <div>
            <label className="block mb-2 font-medium text-gray-700 mb-2">
              Title
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
            Disaster Type
          </label>

          <div className="flex gap-4 mb-4">
            {[
              { label: "Natural Disasters", value: DisasterCategory.Natural },
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
                Specific Type *
              </label>
              {disasterTypes.length > 0 ? (
                disasterTypes.filter(
                  (dt) => dt.category === formData.disasterCategory
                ).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {disasterTypes
                      .filter((dt) => dt.category === formData.disasterCategory)
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
                        setFormData((prev) => ({ ...prev, disasterTypeId: 0 }));
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
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new disaster type"
                    className="border p-2 rounded-lg flex-1"
                    value={newDisasterTypeName}
                    onChange={(e) => setNewDisasterTypeName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={createNewDisasterType}
                  >
                    Create
                  </button>
                </div>
              )}
              {errors.disasterTypes && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.disasterTypes}
                </p>
              )}
            </div>
          )}

          {(formData.disasterTypeId !== 0 || showOtherInput) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disaster Event Name
              </label>
              <input
                type="text"
                placeholder="e.g. Cyclone Mocha, 2025 Monsoon Flood"
                className="border p-2 rounded-lg w-full"
                value={formData.disasterEventName || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    disasterEventName: e.target.value,
                  }))
                }
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 0, label: "Low", color: "bg-green-500" },
                { value: 1, label: "Medium", color: "bg-yellow-500" },
                { value: 2, label: "High", color: "bg-orange-500" },
                { value: 3, label: "Critical", color: "bg-red-500" },
              ].map((severity) => (
                <button
                  key={severity.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: severity.value,
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
                  <span className="text-sm font-medium">{severity.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="dateTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              When did this occur? *
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
              Detailed Description
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

          <div className="flex justify-end">
            <button
              onClick={handleNext}
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
              Location *
            </label>
            <div className="border border-gray-200 rounded-xl relative">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
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

          <label className="block mb-2 font-medium">Type of Impact *</label>
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
                      checked={selectedImpacts.some((i) => i.id === impact.id)}
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
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new impact type"
                      className="border p-2 rounded-lg flex-1"
                      value={newImpactTypeName}
                      onChange={(e) => setNewImpactTypeName(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      onClick={createNewImpactType}
                    >
                      Create
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">No impact types found.</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Impact Severity Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 0, label: "Low", color: "bg-green-500" },
                { value: 1, label: "Medium", color: "bg-yellow-500" },
                { value: 2, label: "High", color: "bg-orange-500" },
                { value: 3, label: "Critical", color: "bg-red-500" },
              ].map((severity) => (
                <button
                  key={severity.value}
                  type="button"
                  onClick={() =>
                    setImpactSeverities((prev) => ({
                      ...prev,
                      [0]: severity.value,
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
                  <span className="text-sm font-medium">{severity.label}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="block mb-2 font-medium">
            Detailed Impact Description
          </label>
          <textarea
            className="w-full border p-2 rounded-lg mb-4"
            rows={3}
            value={impactDescription}
            onChange={(e) => setImpactDescription(e.target.value)}
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Photos (Optional - Max 10 photos, 10MB each)
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
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
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
            <div className="space-y-3 pl-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disaster Category
                </label>
                <p className="text-sm text-gray-600">
                  {formData.disasterCategory}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disaster Type
                </label>
                <p className="text-sm text-gray-600">
                  {selectedDisasterTypeName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disaster Event Name
                </label>
                <p className="text-sm text-gray-600">
                  {formData.disasterEventName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-600">{formData.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <p className="text-sm text-gray-600">{formData.severity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp
                </label>
                <p className="text-sm text-gray-600">{formData.timestamp}</p>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Location</h2>
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
              <div className="space-y-3 pl-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Details
                  </label>
                  <p className="text-sm text-gray-600">
                    {selectedImpacts.map((impact) => impact.name).join(", ")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Description
                  </label>
                  <p className="text-sm text-gray-600">
                    {impactDescription || "No description provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Severity
                  </label>
                  <p className="text-sm text-gray-600">
                    {Object.values(impactSeverities)[0] !== undefined
                      ? Object.values(impactSeverities)[0]
                      : "Not specified"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  Submitting...
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Submit
                </button>
              )}
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
              Please provide accurate information to ensure timely assistance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportImpact;
