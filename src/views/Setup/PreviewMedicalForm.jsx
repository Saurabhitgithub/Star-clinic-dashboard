import React, { useEffect, useState } from "react";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import { getFormTemplateById } from "../../services/formTemplateManagement";
import { loader } from "../../utils";
import { Button } from "../../components/Buttons/Button";

const PreviewMedicalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const fetchFormTemplateData = async () => {
    try {
      loader.start();
      const response = await getFormTemplateById(id);
      console.log("API Response:", response);
      setFormData(response?.data || null);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    if (id) {
      fetchFormTemplateData();
    }
  }, [id]);

  const onCancel = () => {
    navigate("/medical-form");
  };

  if (!formData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading form preview...
      </div>
    );
  }

  const consent = formData?.consent;

  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title=" Medical Form"
      >
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg border border-gray-200 rounded-lg print:p-0 print:shadow-none print:border-0">
          <h2 className="text-2xl font-bold text-center mb-4">
            {formData?.formName || "Medical Form"}
          </h2>
          <hr className="mb-6" />

          {formData?.formType === "consent" && (
            <div className="space-y-4 text-gray-800 text-sm leading-6">
              <p>
                <strong>Patient Name:</strong>{" "}
                {formData.consent?.patientFullName || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(formData.consent?.dateOfBirth).toLocaleDateString() ||
                  "N/A"}
              </p>
              <p>
                <strong>Service Details:</strong>
                <br />
                {formData.serviceUsedFor || "N/A"}
              </p>
              <p>
                <strong>Treatment Details:</strong>
                <br />
                {formData.consent?.treatmentDetails || "N/A"}
              </p>
              <p>
                <strong>Risks and Complications:</strong>
                <br />
                {formData.consent?.risksAndComplications || "N/A"}
              </p>
              <p>
                <strong>Risk Acceptance:</strong>{" "}
                {formData.consent?.riskAcceptance ? "Yes" : "No"}
              </p>
              <p>
                <strong>Patient Signature:</strong>{" "}
                {formData.consent?.patientSignature || "N/A"}
              </p>
              <p>
                <strong>Signed Date:</strong>{" "}
                {new Date(formData.consent?.signedDate).toLocaleDateString() ||
                  "N/A"}
              </p>
            </div>
          )}

          {formData?.formType === "treatment" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Patient Name</p>
                <p>{formData.treatment?.patientName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Date of Birth</p>
                <p>
                  {new Date(
                    formData.treatment?.dateOfBirth
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Treatment Name</p>
                <p>{formData.treatment?.treatmentName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Treatment Date</p>
                <p>
                  {new Date(
                    formData.treatment?.treatmentDate
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Treatment Area</p>
                <p>{formData.treatment?.treatmentArea || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Products Used</p>
                <p>{formData.treatment?.productsUsed || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Dosage Units</p>
                <p>{formData.treatment?.dosageUnits || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Provider Name</p>
                <p>{formData.treatment?.providerName || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">Service Details</p>
                <p>{formData.serviceUsedFor || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">Procedure Notes</p>
                <p>{formData.treatment?.procedureNotes || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">
                  Post-treatment Instructions
                </p>
                <p>{formData.treatment?.postTreatmentInstructions || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Instructions Received
                </p>
                <p>{formData.treatment?.receivedInstructions ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  Agreed to Treatment
                </p>
                <p>{formData.treatment?.agreedToTreatment ? "Yes" : "No"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Patient Signature</p>
                <p>{formData.treatment?.patientSignature || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Signed Date</p>
                <p>
                  {new Date(
                    formData.treatment?.patientSignedDate
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Provider Signature
                </p>
                <p>{formData.treatment?.providerSignature || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">
                  Provider Signed Date
                </p>
                <p>
                  {new Date(
                    formData.treatment?.providerSignedDate
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>
            </div>
          )}

          {formData?.formType === "registration" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Full Name</p>
                <p>{formData.registration?.fullName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Date of Birth</p>
                <p>
                  {new Date(
                    formData.registration?.dateOfBirth
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Gender</p>
                <p>{formData.registration?.gender || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Contact Number</p>
                <p>{formData.registration?.contactNumber || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Email Address</p>
                <p>{formData.registration?.emailAddress || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">Home Address</p>
                <p>{formData.registration?.homeAddress || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Service Details</p>
                <p>{formData.serviceUsedFor || "N/A"}</p>
              </div>

              <div className="sm:col-span-2 mt-4">
                <p className="text-base font-semibold text-gray-900">
                  Emergency Contact
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Name</p>
                    <p>
                      {formData.registration?.emergencyContactName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">
                      Contact Number
                    </p>
                    <p>
                      {formData.registration?.emergencyContactNumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Relationship</p>
                    <p>
                      {formData.registration?.emergencyContactRelationship ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData?.formType === "lab" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Patient Full Name</p>
                <p>{formData.lab?.patientFullName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Date of Birth</p>
                <p>
                  {new Date(formData.lab?.dateOfBirth).toLocaleDateString() ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Test Requested</p>
                <p>{formData.lab?.testRequested || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Reason for Test</p>
                <p>{formData.lab?.reasonForTest || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Requested By</p>
                <p>{formData.lab?.requestedBy || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Request Date</p>
                <p>
                  {new Date(formData.lab?.requestDate).toLocaleDateString() ||
                    "N/A"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">Additional Notes</p>
                <p>{formData.lab?.additionalNotes || "N/A"}</p>
              </div>

              <div className="sm:col-span-2 border-t pt-4 mt-2">
                <p className="text-base font-semibold text-gray-900">
                  General Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Form Name</p>
                    <p>{formData.formName || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">
                      Service Used For
                    </p>
                    <p>{formData.serviceUsedFor || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Created At</p>
                    <p>
                      {new Date(formData.createdAt).toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData?.formType === "prescription" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Patient Full Name</p>
                <p>{formData.prescription?.patientFullName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Date of Birth</p>
                <p>
                  {new Date(
                    formData.prescription?.dateOfBirth
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Prescription Date</p>
                <p>
                  {new Date(
                    formData.prescription?.prescriptionDate
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Medication Name</p>
                <p>{formData.prescription?.medicationName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Dosage Instructions
                </p>
                <p>{formData.prescription?.dosageInstructions || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Duration</p>
                <p>{formData.prescription?.duration || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Refills</p>
                <p>{formData.prescription?.refills ?? "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Prescriber Name</p>
                <p>{formData.prescription?.prescriberName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Prescriber Signature
                </p>
                <p>{formData.prescription?.prescriberSignature || "N/A"}</p>
              </div>

              <div className="sm:col-span-2 border-t pt-4 mt-2">
                <p className="text-base font-semibold text-gray-900">
                  General Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Form Name</p>
                    <p>{formData.formName || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">
                      Service Used For
                    </p>
                    <p>{formData.serviceUsedFor || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Created At</p>
                    <p>
                      {new Date(formData.createdAt).toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData?.formType === "medical" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Patient Full Name</p>
                <p>{formData.medical?.patientFullName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Date of Birth</p>
                <p>
                  {new Date(
                    formData.medical?.dateOfBirth
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">
                  Current Medications
                </p>
                <p>{formData.medical?.currentMedications || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Allergies</p>
                <p>{formData.medical?.allergies || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Past Surgeries / Hospitalizations
                </p>
                <p>
                  {formData.medical?.pastSurgeriesOrHospitalizations || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Chronic Conditions
                </p>
                <p>{formData.medical?.chronicConditions || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Family Medical History
                </p>
                <p>{formData.medical?.familyMedicalHistory || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">
                  Lifestyle Information
                </p>
                <p>{formData.medical?.lifestyleInformation || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Emergency Contact Name
                </p>
                <p>{formData.medical?.emergencyContactName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Emergency Contact Phone
                </p>
                <p>{formData.medical?.emergencyContactPhone || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Patient Signature</p>
                <p>{formData.medical?.patientSignature || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Signed Date</p>
                <p>
                  {new Date(
                    formData.medical?.signedDate
                  ).toLocaleDateString() || "N/A"}
                </p>
              </div>

              <div className="sm:col-span-2 border-t pt-4 mt-2">
                <p className="text-base font-semibold text-gray-900">
                  General Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Form Name</p>
                    <p>{formData.formName || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">
                      Service Used For
                    </p>
                    <p>{formData.serviceUsedFor || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Created At</p>
                    <p>
                      {new Date(formData.createdAt).toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData?.formType === "intake" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm leading-6">
              <div>
                <p className="font-semibold text-gray-700">Patient Full Name</p>
                <p>{formData.intake?.patientFullName || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Reason for Visit</p>
                <p>{formData.intake?.reasonForVisit || "N/A"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="font-semibold text-gray-700">Current Symptoms</p>
                <p>{formData.intake?.currentSymptoms || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Symptom Start Date
                </p>
                <p>
                  {formData.intake?.symptomStartDate
                    ? new Date(
                        formData.intake.symptomStartDate
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Current Medications
                </p>
                <p>{formData.intake?.currentMedications || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Allergies</p>
                <p>{formData.intake?.allergies || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Substance Use</p>
                <p>{formData.intake?.substanceUse || "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Referral Source</p>
                <p>{formData.intake?.referralSource || "N/A"}</p>
              </div>

              <div className="sm:col-span-2 border-t pt-4 mt-2">
                <p className="text-base font-semibold text-gray-900">
                  General Information
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-semibold text-gray-700">Form Name</p>
                    <p>{formData.formName || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">
                      Service Used For
                    </p>
                    <p>{formData.serviceUsedFor || "N/A"}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700">Created At</p>
                    <p>
                      {formData.createdAt
                        ? new Date(formData.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* You can add more sections like intake, prescription, etc. in the same pattern */}

          <div className="mt-8 text-center print:hidden">
            <Button primary onClick={() => window.print()}>
              🖨 Print / Save as PDF
            </Button>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default PreviewMedicalForm;
