import React, { useEffect, useState } from "react";
import {
  DisasterReportCreateDto,
  SeverityLevel,
} from "../types/DisasterReport";
import { DisasterReportService } from "../services/disasterReportService";
import { DisasterCategory, DisasterTypeDto } from "../types/DisasterType";
import { DisasterTypeService } from "../services/disasterTypeService";
import { ImpactTypeDto } from "../types/ImpactType";
import { ImpactTypeService } from "../services/ImpactTypeService";

interface Props {
  authToken: string;
  onSuccess?: () => void;
}

const ReportImpact: React.FC<Props> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [disasterTypes, setDisasterTypes] = useState<DisasterTypeDto[]>([]);

  const [formData, setFormData] = useState<DisasterReportCreateDto>({
    title: "",
    description: "",
    timestamp: "",
    severity: SeverityLevel.Low,
    disasterCategory: undefined,
    disasterTypeId: 0,
    disasterEventName: "",
    impactDetails: [],
  });

  const [impactDescription, setImpactDescription] = useState("");
  const [selectedImpacts, setSelectedImpacts] = useState<ImpactTypeDto[]>([]);

  const [selectedDisasterTypeName, setSelectedDisasterTypeName] = useState("");

  // New states for "Other"
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [newDisasterTypeName, setNewDisasterTypeName] = useState("");
  const [impactTypes, setImpactTypes] = useState<ImpactTypeDto[]>([]);


  const handleImpactSelect = (impact: ImpactTypeDto) => {
    setSelectedImpacts((prev) =>
      prev.some((i) => i.id === impact.id)
        ? prev.filter((i) => i.id !== impact.id)
        : [...prev, impact]
    );
  };

  const fetchDisasterTypes = async () => {
    try {
      const data = await DisasterTypeService.getAll();
      setDisasterTypes(data);
    } catch (err) {
      console.error("Failed to load disaster types:", err);
    }
  };

  const fetchImpactTypes = async () => {
    try {
      const data = await ImpactTypeService.getAll();
      // Make sure data is always an array
      if (Array.isArray(data)) {
        setImpactTypes(data);
      } else {
        console.error("Impact types response is not an array:", data);
        setImpactTypes([]); // fallback
      }
    } catch (err) {
      console.error("Failed to load impact types:", err);
      setImpactTypes([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchDisasterTypes();
    fetchImpactTypes();
  }, []);

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
      const token = localStorage.getItem("token") || undefined;
      const dto = {
        name: newDisasterTypeName,
        category: formData.disasterCategory,
      };
      await DisasterTypeService.create(dto, token);

      await fetchDisasterTypes();

      // auto-select new type
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

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    try {
      const dto: DisasterReportCreateDto = {
        ...formData,
        impactDetails: selectedImpacts.map((impact) => ({
          impactTypeName: impact.name,
          description: impactDescription,
          severity: formData.severity,
        })),
      };

      await DisasterReportService.create(dto);
      alert("Disaster report submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
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
                
                <button
                  type="button"
                  onClick={() => setShowOtherInput(true)}
                  className="p-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  + Other
                </button>
              </div>
            </div>
          )}

          {showOtherInput && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Disaster Type Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDisasterTypeName}
                  onChange={(e) => setNewDisasterTypeName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter disaster type name"
                />
                <button
                  type="button"
                  onClick={createNewDisasterType}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtherInput(false);
                    setNewDisasterTypeName("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief title for the disaster report"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed description of the disaster"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timestamp *
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp}
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
          <h3 className="text-lg font-semibold mb-4">Impact Assessment</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Impact Types *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impact Description *
            </label>
            <textarea
              value={impactDescription}
              onChange={(e) => setImpactDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the impact in detail"
            />
          </div>

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

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium mb-2">Summary</h4>
            <p><strong>Title:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {selectedDisasterTypeName}</p>
            <p><strong>Severity:</strong> {formData.severity}</p>
            <p><strong>Selected Impacts:</strong> {selectedImpacts.map(i => i.name).join(", ")}</p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportImpact;