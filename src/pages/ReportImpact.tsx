import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DisasterReportCreateDto,
  SeverityLevel,
} from "../types/DisasterReport";

import { DisasterCategory, DisasterTypeDto } from "../types/DisasterType";
import { DisasterTypeService } from "../services/disasterTypeService";
import { ImpactTypeDto } from "../types/ImpactType";
import { ImpactTypeService } from "../services/ImpactTypeService";
import { Camera, MapPin, X } from "lucide-react";
import { LocationPicker } from "../components/Map";
import { createDisasterReport } from "../services/disasterReportService";
import { useAuthStore } from "../stores/authStore";

interface Props {
  authToken?: string;
  onSuccess?: () => void;
}

const ReportImpact: React.FC<Props> = ({ authToken, onSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuthStore();
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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

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

  const getToken = () => {
    return accessToken || localStorage.getItem("token") || authToken;
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

  const fetchDisasterTypes = async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      const data = await DisasterTypeService.getAll(token);
      setDisasterTypes(data);
    } catch (err) {
      console.error("Failed to load disaster types:", err);
    }
  };

  const fetchImpactTypes = async () => {
    try {
      const token = getToken();
      if (!token) return;
      
      console.log("Auth token:", token);
      const data = await ImpactTypeService.getAll(token);
      // ✅ Make sure data is always an array
      if (Array.isArray(data)) {
        setImpactTypes(data);
      } else {
        setImpactTypes([]);
      }
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
      console.log("User not authenticated, skipping data fetch");
    }
  }, [isAuthenticated, accessToken, authToken]);

  const handleCategorySelect = (category: DisasterCategory) => {
    const defaultType = disasterTypes.find((dt) => dt.category === category);
    setFormData((f) => ({
      ...f,
      disasterCategory: category,
      disasterTypeId: defaultType ? defaultType.id : 0,
    }));
    setShowOtherInput(false);
  };

  const handleTypeSelect = (typeId: number) => {
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
        console.log("No token found");
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
        console.log("No token found");
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
      setLocation({ lat, lng });
    },
    []
  );

  // Validate current step before proceeding
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

      // Check if disaster type is selected or "Other" input is shown
      if (formData.disasterTypeId === 0 && !showOtherInput) {
        newErrors.disasterType = "Please select a disaster type";
        console.log("❌ Disaster type validation failed");
      } else {
        console.log("✅ Disaster type validation passed");
      }

      // Check if severity is set (0 is valid for "Low")
      if (formData.severity === undefined || formData.severity === null) {
        newErrors.severity = "Please select severity level";
        console.log("❌ Severity validation failed");
      } else {
        console.log("✅ Severity validation passed");
      }

      // Check if timestamp is set
      if (!formData.timestamp) {
        newErrors.timestamp = "Please select date and time";
        console.log("❌ Timestamp validation failed");
      } else {
        console.log("✅ Timestamp validation passed");
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
      } else {
        console.log("✅ Location validation passed");
      }

      if (selectedImpacts.length === 0) {
        newErrors.impact = "Please select at least one impact type";
        console.log("❌ Impact validation failed");
      } else {
        console.log("✅ Impact validation passed");
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

    // Validate all steps before submitting
    console.log("🔍 Validating step 1...");
    const step1Valid = validateStep(1);
    console.log("🔍 Validating step 2...");
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

      // Properly structure impact details for backend
      console.log("📦 Preparing impact details...");
      const impactDetails = selectedImpacts.map((impact) => ({
        impactTypeNames: [impact.name],
        description: impactDescription || "Impact description",
        severity: impactSeverities[impact.id] || SeverityLevel.Low,
        impactTypeIds: [impact.id],
      }));
      console.log("📦 Impact details prepared:", impactDetails);

      // Create FormData in the format backend expects
      console.log("📂 Creating FormData...");
      const submissionFormData = new FormData();

      // Append all fields separately
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

      // Append impact details as a single JSON array
      impactDetails.forEach((impact, i) => {
        submissionFormData.append(
          `ImpactDetails[${i}].Description`,
          impact.description
        );
        submissionFormData.append(
          `ImpactDetails[${i}].Severity`,
          impact.severity.toString()
        );
        submissionFormData.append(
          `ImpactDetails[${i}].ImpactTypeIds`,
          impact.impactTypeIds[0].toString()
        );
      });

      // Append photos
      console.log("📸 Appending photos...");
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          console.log(`📸 Adding photo ${index + 1}:`, photo.name);
          submissionFormData.append("Photos", photo);
        }
      });

      // Debug FormData contents
      console.log("🔍 === DEBUGGING SUBMISSION DATA ===");
      console.log("📋 FormData contents:");
      for (let [key, value] of submissionFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log("🔍 === DEBUGGING SUBMISSION DATA ===");

      console.log("🚀 Sending request to API...");
      await createDisasterReport(submissionFormData, token);
      console.log("✅ Report submitted successfully!");
      alert("Disaster report submitted successfully!");
      navigate("/dashboard");
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

      // Show alert to user in case the error display is not visible
      alert(`Error submitting report: ${errorMessage}`);
    } finally {
      console.log("🔄 Resetting loading state");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Report a Disaster Impact
      </h2>

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

                {/* Other Button */}
                <button
                  type="button"
                  onClick={() => setShowOtherInput(true)}
                  className={`p-3 border rounded-xl text-sm transition-all duration-200
                    ${
                      showOtherInput
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  + Other
                </button>
              </div>
              
              {/* Show input when Other selected */}
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
            </div>
          )}

          {/* ✅ Show Disaster Event Name input if type selected */}
          {formData.disasterTypeId !== 0 && (
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
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
                      severity: severity.value, // ✅ Enum number
                    }))
                  }
                  className={`p-3 border rounded-xl flex flex-col items-center transition-all duration-200
          ${
            formData.severity === severity.value
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }
        `}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${severity.color} mb-2`}
                  />
                  <span className="text-sm font-medium">{severity.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="mb-6">
            <label
              htmlFor="dateTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              When did this occur? *
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp}
              max={new Date().toISOString().slice(0, 16)} // ✅ today until current minute
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, timestamp: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level *
            </label>
            <select
              value={formData.severity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  severity: parseInt(e.target.value) as SeverityLevel,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={SeverityLevel.Low}>Low</option>
              <option value={SeverityLevel.Medium}>Medium</option>
              <option value={SeverityLevel.High}>High</option>
              <option value={SeverityLevel.Critical}>Critical</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-2 font-medium">Type of Impact *</label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Array.isArray(impactTypes) && impactTypes.length > 0 ? (
              impactTypes.map((impact) => (
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
              ))
            ) : (
              <p className="text-sm text-gray-500">No impact types found.</p>
            )}
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

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
          <pre className="bg-gray-100 p-2 text-sm mb-4 rounded-lg">
            {JSON.stringify(formData, null, 2)}
          </pre>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportImpact;
