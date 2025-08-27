import React, { useState, useEffect } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Input } from "../../components/Inputs/Input";
import {
  addFormTemplateData,
  getFormTemplateById,
  updateFormTemplateById,
} from "../../services/formTemplateManagement";
import { loader, toast } from "../../utils";
export default function GeneralForm() {
  const [selectedFormType, setSelectedFormType] = useState("consent");
  const [initialData, setInitialData] = useState(null);

  const formTypes = [
    { label: "Medical History", value: "medical" },
    { label: "Consent", value: "consent" },
    { label: "Treatment Form", value: "treatment" },
    { label: "Prescription", value: "prescription" },
    { label: "Lab Form", value: "lab" },
    { label: "Registration", value: "registration" },
    { label: "Intake Form", value: "intake" },
  ];

  const navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;

  const {
    control,
    handleSubmit,
    setValue,
    formType,
    nestedData,
    formState: { errors },
  } = useForm({
    defaultValues: {
      formName: "",
      serviceUsedFor: "",
      formType: "consent",

      consent: {
        patientFullName: "",
        dateOfBirth: "",
        treatmentDetails: "",
        risksAndComplications: "",
        riskAcceptance: false,
        patientSignature: "",
        signedDate: "",
      },

      treatment: {
        patientName: "",
        dateOfBirth: "",
        treatmentName: "",
        treatmentDate: "",
        treatmentArea: "",
        productsUsed: "",
        dosageUnits: "",
        providerName: "",
        procedureNotes: "",
        postTreatmentInstructions: "",
        receivedInstructions: false,
        agreedToTreatment: false,
        patientSignature: "",
        patientSignedDate: "",
        providerSignature: "",
        providerSignedDate: "",
      },

      medical: {
        patientFullName: "",
        dateOfBirth: "",
        currentMedications: "",
        allergies: "",
        pastSurgeriesOrHospitalizations: "",
        chronicConditions: "",
        familyMedicalHistory: "",
        lifestyleInformation: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        confirmationAccepted: false,
        patientSignature: "",
        signedDate: "",
      },

      prescription: {
        patientFullName: "",
        dateOfBirth: "",
        prescriptionDate: "",
        medicationName: "",
        dosageInstructions: "",
        duration: "",
        refills: 0,
        prescriberName: "",
        prescriberSignature: "",
      },

      lab: {
        patientFullName: "",
        dateOfBirth: "",
        testRequested: "",
        reasonForTest: "",
        requestedBy: "",
        requestDate: "",
        additionalNotes: "",
      },

      registration: {
        fullName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        emailAddress: "",
        homeAddress: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        emergencyContactRelationship: "",
      },

      intake: {
        reasonForVisit: "",
        currentSymptoms: "",
        symptomStartDate: "",
        currentMedications: "",
        allergies: "",
        substanceUse: "",
        referralSource: "",
      },
    },
  });

  useEffect(() => {
    if (!isAddMode && id) {
      getFormTemplateById(id)
        .then((response) => {
          const data = response.data;
          console.log("fetch data:", data);

          setInitialData(data);

          const formType = data.formType;
          setSelectedFormType(formType); // Important to show correct form
          setValue("formType", formType);

          const nested = data[formType];

          // Handle all form types properly
          if (formType === "consent" && nested) {
            setValue("consent.patientFullName", nested.patientFullName || "");
            setValue(
              "consent.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue("consent.treatmentDetails", nested.treatmentDetails || "");
            setValue(
              "consent.risksAndComplications",
              nested.risksAndComplications || ""
            );
            setValue("consent.riskAcceptance", nested.riskAcceptance || "");
            setValue("consent.patientSignature", nested.patientSignature || "");
            setValue("consent.signedDate", nested.signedDate || "");
          }

          if (formType === "treatment" && nested) {
            setValue("treatment.patientName", nested.patientName || "");
            setValue(
              "treatment.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue("treatment.treatmentName", nested.treatmentName || "");
            setValue(
              "treatment.treatmentDate",
              nested.treatmentDate.slice(0, 10) || ""
            );
            setValue("treatment.treatmentArea", nested.treatmentArea || "");
            setValue("treatment.productsUsed", nested.productsUsed || "");
            setValue("treatment.dosageUnits", nested.dosageUnits || "");
            setValue("treatment.providerName", nested.providerName || "");
            setValue("treatment.procedureNotes", nested.procedureNotes || "");
            setValue(
              "treatment.postTreatmentInstructions",
              nested.postTreatmentInstructions || ""
            );
            setValue(
              "treatment.receivedInstructions",
              nested.receivedInstructions || false
            );
            setValue(
              "treatment.agreedToTreatment",
              nested.agreedToTreatment || false
            );
            setValue(
              "treatment.patientSignature",
              nested.patientSignature || ""
            );
            setValue(
              "treatment.patientSignedDate",
              nested.patientSignedDate?.slice(0, 10) || ""
            );
            setValue(
              "treatment.providerSignature",
              nested.providerSignature || ""
            );
            setValue(
              "treatment.providerSignedDate",
              nested.providerSignedDate?.slice(0, 10) || ""
            );
          }

          if (formType === "registration" && nested) {
            setValue("registration.fullName", nested.fullName || "");
            setValue(
              "registration.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue("registration.gender", nested.gender || "");
            setValue("registration.contactNumber", nested.contactNumber || "");
            setValue("registration.emailAddress", nested.emailAddress || "");
            setValue("registration.homeAddress", nested.homeAddress || "");
            setValue(
              "registration.emergencyContactName",
              nested.emergencyContactName || ""
            );
            setValue(
              "registration.emergencyContactNumber",
              nested.emergencyContactNumber || ""
            );
            setValue(
              "registration.emergencyContactRelationship",
              nested.emergencyContactRelationship || ""
            );
          }

          if (formType === "lab" && nested) {
            setValue("lab.patientFullName", nested.patientFullName || "");
            setValue("lab.dateOfBirth", nested.dateOfBirth?.slice(0, 10) || "");
            setValue("lab.testRequested", nested.testRequested || "");
            setValue("lab.reasonForTest", nested.reasonForTest || "");
            setValue("lab.requestedBy", nested.requestedBy || "");
            setValue("lab.requestDate", nested.requestDate?.slice(0, 10) || "");
            setValue("lab.additionalNotes", nested.additionalNotes || "");
          }

          if (formType === "prescription" && nested) {
            setValue(
              "prescription.patientFullName",
              nested.patientFullName || ""
            );
            setValue(
              "prescription.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue(
              "prescription.prescriptionDate",
              nested.prescriptionDate?.slice(0, 10) || ""
            );
            setValue(
              "prescription.medicationName",
              nested.medicationName || ""
            );
            setValue(
              "prescription.dosageInstructions",
              nested.dosageInstructions || ""
            );
            setValue("prescription.duration", nested.duration || "");
            setValue("prescription.refills", nested.refills || 0);
            setValue(
              "prescription.prescriberName",
              nested.prescriberName || ""
            );
            setValue(
              "prescription.prescriberSignature",
              nested.prescriberSignature || ""
            );
          }

          if (formType === "medical" && nested) {
            setValue("medical.patientFullName", nested.patientFullName || "");
            setValue(
              "medical.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue(
              "medical.currentMedications",
              nested.currentMedications || ""
            );
            setValue("medical.allergies", nested.allergies || "");
            setValue(
              "medical.pastSurgeriesOrHospitalizations",
              nested.pastSurgeriesOrHospitalizations || ""
            );
            setValue(
              "medical.chronicConditions",
              nested.chronicConditions || ""
            );
            setValue(
              "medical.familyMedicalHistory",
              nested.familyMedicalHistory || ""
            );
            setValue(
              "medical.lifestyleInformation",
              nested.lifestyleInformation || ""
            );
            setValue(
              "medical.emergencyContactName",
              nested.emergencyContactName || ""
            );
            setValue(
              "medical.emergencyContactPhone",
              nested.emergencyContactPhone || ""
            );
            setValue(
              "medical.confirmationAccepted",
              nested.confirmationAccepted || false
            );
            setValue("medical.patientSignature", nested.patientSignature || "");
            setValue(
              "medical.signedDate",
              nested.signedDate?.slice(0, 10) || ""
            );
          }

          if (formType === "intake" && nested) {
            setValue("intake.patientFullName", nested.patientFullName || "");
            setValue("intake.reasonForVisit", nested.reasonForVisit || "");
            setValue("intake.currentSymptoms", nested.currentSymptoms || "");
            setValue(
              "intake.symptomStartDate",
              nested.symptomStartDate?.slice(0, 10) || ""
            );
            setValue(
              "intake.currentMedications",
              nested.currentMedications || ""
            );
            setValue("intake.allergies", nested.allergies || "");
            setValue("intake.substanceUse", nested.substanceUse || "");
            setValue("intake.referralSource", nested.referralSource || "");
          }

          setValue("formName", data.formName || "");
          setValue("serviceUsedFor", data.serviceUsedFor || "");
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching the data");
        });
    }
  }, [id, isAddMode, setValue]);


  async function onSubmit(data) {
    try {
      loader.start();

      const finalPayload = {
        formName: data.formName,
        serviceUsedFor: data.serviceUsedFor,
        formType: selectedFormType,
      };

      if (selectedFormType && data[selectedFormType]) {
        finalPayload[selectedFormType] = data[selectedFormType];
      }

      let response;
      if (isAddMode) {
        response = await addFormTemplateData(finalPayload);
      } else {
        response = await updateFormTemplateById(id, finalPayload);
      }

      if (response && response.data) {
        setInitialData(response.data);

        setValue("formName", response.data.formName || "");
        setValue("serviceUsedFor", response.data.serviceUsedFor || "");

        const nested = response.data[selectedFormType];

          if (selectedFormType === "consent" && nested) {
            setValue("consent.patientFullName", nested.patientFullName || "");
            setValue(
              "consent.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue("consent.treatmentDetails", nested.treatmentDetails || "");
            setValue(
              "consent.risksAndComplications",
              nested.risksAndComplications || ""
            );
            setValue("consent.riskAcceptance", nested.riskAcceptance || "");
            setValue("consent.patientSignature", nested.patientSignature || "");
            setValue("consent.signedDate", nested.signedDate || "");
          }


                  if (selectedFormType === "treatment" && nested) {
            setValue("treatment.patientName", nested.patientName || "");
            setValue(
              "treatment.dateOfBirth",
              nested.dateOfBirth?.slice(0, 10) || ""
            );
            setValue("treatment.treatmentName", nested.treatmentName || "");
            setValue(
              "treatment.treatmentDate",
              nested.treatmentDate.slice(0, 10) || ""
            );
            setValue("treatment.treatmentArea", nested.treatmentArea || "");
            setValue("treatment.productsUsed", nested.productsUsed || "");
            setValue("treatment.dosageUnits", nested.dosageUnits || "");
            setValue("treatment.providerName", nested.providerName || "");
            setValue("treatment.procedureNotes", nested.procedureNotes || "");
            setValue(
              "treatment.postTreatmentInstructions",
              nested.postTreatmentInstructions || ""
            );
            setValue(
              "treatment.receivedInstructions",
              nested.receivedInstructions || false
            );
            setValue(
              "treatment.agreedToTreatment",
              nested.agreedToTreatment || false
            );
            setValue(
              "treatment.patientSignature",
              nested.patientSignature || ""
            );
            setValue(
              "treatment.patientSignedDate",
              nested.patientSignedDate?.slice(0, 10) || ""
            );
            setValue(
              "treatment.providerSignature",
              nested.providerSignature || ""
            );
            setValue(
              "treatment.providerSignedDate",
              nested.providerSignedDate?.slice(0, 10) || ""
            );
          }


        if (selectedFormType === "registration" && nested) {
          setValue("registration.fullName", nested.fullName || "");
          setValue(
            "registration.dateOfBirth",
            nested.dateOfBirth?.slice(0, 10) || ""
          );
          setValue("registration.gender", nested.gender || "");
          setValue("registration.contactNumber", nested.contactNumber || "");
          setValue("registration.emailAddress", nested.emailAddress || "");
          setValue("registration.homeAddress", nested.homeAddress || "");
          setValue(
            "registration.emergencyContactName",
            nested.emergencyContactName || ""
          );
          setValue(
            "registration.emergencyContactNumber",
            nested.emergencyContactNumber || ""
          );
          setValue(
            "registration.emergencyContactRelationship",
            nested.emergencyContactRelationship || ""
          );
        }

        if (selectedFormType === "lab" && nested) {
          setValue("lab.patientFullName", nested.patientFullName || "");
          setValue("lab.dateOfBirth", nested.dateOfBirth?.slice(0, 10) || "");
          setValue("lab.testRequested", nested.testRequested || "");
          setValue("lab.reasonForTest", nested.reasonForTest || "");
          setValue("lab.requestedBy", nested.requestedBy || "");
          setValue("lab.requestDate", nested.requestDate?.slice(0, 10) || "");
          setValue("lab.additionalNotes", nested.additionalNotes || "");
        }

        if (selectedFormType === "prescription" && nested) {
          setValue(
            "prescription.patientFullName",
            nested.patientFullName || ""
          );
          setValue(
            "prescription.dateOfBirth",
            nested.dateOfBirth?.slice(0, 10) || ""
          );
          setValue(
            "prescription.prescriptionDate",
            nested.prescriptionDate?.slice(0, 10) || ""
          );
          setValue("prescription.medicationName", nested.medicationName || "");
          setValue(
            "prescription.dosageInstructions",
            nested.dosageInstructions || ""
          );
          setValue("prescription.duration", nested.duration || "");
          setValue("prescription.refills", nested.refills || 0);
          setValue("prescription.prescriberName", nested.prescriberName || "");
          setValue(
            "prescription.prescriberSignature",
            nested.prescriberSignature || ""
          );
        }

        if (selectedFormType === "medical" && nested) {
          setValue("medical.patientFullName", nested.patientFullName || "");
          setValue(
            "medical.dateOfBirth",
            nested.dateOfBirth?.slice(0, 10) || ""
          );
          setValue(
            "medical.currentMedications",
            nested.currentMedications || ""
          );
          setValue("medical.allergies", nested.allergies || "");
          setValue(
            "medical.pastSurgeriesOrHospitalizations",
            nested.pastSurgeriesOrHospitalizations || ""
          );
          setValue("medical.chronicConditions", nested.chronicConditions || "");
          setValue(
            "medical.familyMedicalHistory",
            nested.familyMedicalHistory || ""
          );
          setValue(
            "medical.lifestyleInformation",
            nested.lifestyleInformation || ""
          );
          setValue(
            "medical.emergencyContactName",
            nested.emergencyContactName || ""
          );
          setValue(
            "medical.emergencyContactPhone",
            nested.emergencyContactPhone || ""
          );
          setValue(
            "medical.confirmationAccepted",
            nested.confirmationAccepted || false
          );
          setValue("medical.patientSignature", nested.patientSignature || "");
          setValue("medical.signedDate", nested.signedDate?.slice(0, 10) || "");
        }
        if (selectedFormType === "intake" && nested) {
          setValue("intake.reasonForVisit", nested.reasonForVisit || "");
          setValue("intake.currentSymptoms", nested.currentSymptoms || "");
          setValue(
            "intake.symptomStartDate",
            nested.symptomStartDate?.slice(0, 10) || ""
          );
          setValue(
            "intake.currentMedications",
            nested.currentMedications || ""
          );
          setValue("intake.allergies", nested.allergies || "");
          setValue("intake.substanceUse", nested.substanceUse || "");
          setValue("intake.referralSource", nested.referralSource || "");
        }

        toast.success(`Form ${isAddMode ? "added" : "updated"} successfully!`);
        navigate("/medical-form");
      } else {
        toast.error("Error: No response data received");
      }
    } catch (error) {
      console.error("Error saving the data", error);
      toast.error("Error saving the data");
    } finally {
      loader.stop();
    }
  }







  

  function onCancel() {
    navigate("/medical-form");
  }
  return (
    <div className=" flex items-center justify-center bg-gray-100 min-h-screen">
      {/* <div className="mt-5 border rounded overflow-hidden"> */}
      <div className="space-y-4 bg-white rounded-md shadow-md w-full max-w-4xl p-6">
        <div className="text-2xl font-semibold mb-2 flex justify-between items-center cursor-pointer">
          <span>{`${isAddMode ? "Add" : "Update"} Patient Form`}</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="mt-3">
              <Controller
                name="formName"
                control={control}
                rules={{ required: "Form Name is required" }}
                render={({ field }) => (
                  <Input
                    required
                    error={!!errors.formName}
                    {...field}
                    placeholder="Enter Form Name"
                    label="Form Name"
                  />
                )}
              />
            </div>

            <div className="mt-3">
              <Controller
                name="serviceUsedFor"
                control={control}
                rules={{ required: "service is required" }}
                render={({ field }) => (
                  <Input
                    required
                    error={!!errors.serviceUsedFor}
                    {...field}
                    placeholder="e.g., Dermal Fillers 1ml Cheek "
                    label="Which service should this form be used for?"
                  />
                )}
              />
            </div>

            <div className="mt-3">
              <Controller
                name="formType"
                control={control}
                rules={{ required: "Form type is required" }}
                render={({ field }) => (
                  <>
                    <label className="block text-sm font-medium mb-2">
                      Form Type
                    </label>
                    <select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSelectedFormType(e.target.value);
                      }}
                      className={`w-full border rounded px-3 py-2 ${
                        errors.formType ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Form Type</option>
                      {formTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.formType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.formType.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Consent Form Fields */}
            {selectedFormType === "consent" && (
              <>
                <Controller
                  name="consent.patientFullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Full Name"
                      placeholder="Enter patient name"
                      error={errors?.consent?.patientFullName?.message}
                    />
                  )}
                />

                <Controller
                  name="consent.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Date of Birth"
                      error={errors?.consent?.dateOfBirth?.message}
                    />
                  )}
                />

                <Controller
                  name="consent.treatmentDetails"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Treatment Details"
                      textarea
                      rows={3}
                      placeholder="Enter treatment details"
                      error={errors?.consent?.treatmentDetails?.message}
                    />
                  )}
                />

                <Controller
                  name="consent.risksAndComplications"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Risks and Complications"
                      textarea
                      rows={3}
                      placeholder="Describe risks and complications"
                      error={errors?.consent?.risksAndComplications?.message}
                    />
                  )}
                />

                <Controller
                  name="consent.riskAcceptance"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <label className="text-sm">
                        I understand and accept the risks.
                      </label>
                    </div>
                  )}
                />

                <Controller
                  name="consent.patientSignature"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Signature"
                      placeholder="Enter patient signature"
                      error={errors?.consent?.patientSignature?.message}
                    />
                  )}
                />

                <Controller
                  name="consent.signedDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Date"
                      error={errors?.consent?.signedDate?.message}
                    />
                  )}
                />
              </>
            )}

            {/* Treatment Form Fields */}
            {selectedFormType === "treatment" && (
              <>
                <Controller
                  name="treatment.patientName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Name"
                      error={errors?.treatment?.patientName?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date of Birth"
                      type="date"
                      error={errors?.treatment?.dateOfBirth?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.treatmentName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Treatment Name"
                      error={errors?.treatment?.treatmentName?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.treatmentDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Treatment Date"
                      type="date"
                      error={errors?.treatment?.treatmentDate?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.treatmentArea"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Treatment Area"
                      error={errors?.treatment?.treatmentArea?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.productsUsed"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Products Used"
                      error={errors?.treatment?.productsUsed?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.dosageUnits"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Dosage / Units"
                      error={errors?.treatment?.dosageUnits?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.providerName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Provider Name"
                      error={errors?.treatment?.providerName?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.procedureNotes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Procedure Notes"
                      textarea
                      rows={3}
                      error={errors?.treatment?.procedureNotes?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.postTreatmentInstructions"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Post-Treatment Instructions"
                      textarea
                      rows={3}
                      error={
                        errors?.treatment?.postTreatmentInstructions?.message
                      }
                    />
                  )}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Controller
                    name="treatment.receivedInstructions"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <label className="text-sm">
                    I confirm I have received and understood pre/post-care
                    instructions.
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="treatment.agreedToTreatment"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <label className="text-sm">
                    I agree to undergo the above treatment.
                  </label>
                </div>
                <Controller
                  name="treatment.patientSignature"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Signature"
                      error={errors?.treatment?.patientSignature?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.patientSignedDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date"
                      type="date"
                      error={errors?.treatment?.patientSignedDate?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.providerSignature"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Provider Signature"
                      error={errors?.treatment?.providerSignature?.message}
                    />
                  )}
                />
                <Controller
                  name="treatment.providerSignedDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date"
                      type="date"
                      error={errors?.treatment?.providerSignedDate?.message}
                    />
                  )}
                />
              </>
            )}


            
                  {/* medical form */}

            {selectedFormType === "medical" && (
              <>
                <Controller
                  name="medical.patientFullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Full Name"
                      error={errors?.medical?.patientFullName?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date of Birth"
                      type="date"
                      error={errors?.medical?.dateOfBirth?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.currentMedications"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Current Medications"
                      type="textarea"
                      rows={2}
                      placeholder="List all medications the patient is currently taking"
                      error={errors?.medical?.currentMedications?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.allergies"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Allergies"
                      type="textarea"
                      rows={2}
                      placeholder="Include medications, food, or environmental allergies"
                      error={errors?.medical?.allergies?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.pastSurgeriesOrHospitalizations"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Past Surgeries or Hospitalizations"
                      type="textarea"
                      rows={2}
                      error={
                        errors?.medical?.pastSurgeriesOrHospitalizations
                          ?.message
                      }
                    />
                  )}
                />

                <Controller
                  name="medical.chronicConditions"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Chronic Conditions"
                      type="textarea"
                      rows={2}
                      placeholder="e.g., diabetes, hypertension, asthma"
                      error={errors?.medical?.chronicConditions?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.familyMedicalHistory"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Family Medical History"
                      type="textarea"
                      rows={2}
                      placeholder="Any major illnesses in family (e.g., cancer, heart disease)"
                      error={errors?.medical?.familyMedicalHistory?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.lifestyleInformation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Lifestyle Information"
                      type="textarea"
                      rows={2}
                      placeholder="e.g., smoking, alcohol use, exercise habits"
                      error={errors?.medical?.lifestyleInformation?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.emergencyContactName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Emergency Contact Name"
                      error={errors?.medical?.emergencyContactName?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.emergencyContactPhone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Emergency Contact Phone"
                      type="tel"
                      error={errors?.medical?.emergencyContactPhone?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.confirmationAccepted"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2 my-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label className="text-sm">
                        I confirm that the above information is accurate and up
                        to date.
                      </label>
                    </div>
                  )}
                />

                <Controller
                  name="medical.patientSignature"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Signature"
                      error={errors?.medical?.patientSignature?.message}
                    />
                  )}
                />

                <Controller
                  name="medical.signedDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date"
                      type="date"
                      error={errors?.medical?.signedDate?.message}
                    />
                  )}
                />
              </>
            )}


                  {/* prescription form */}

            {selectedFormType === "prescription" && (
              <>
                <Controller
                  name="prescription.patientFullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Full Name"
                      placeholder="Full name"
                    />
                  )}
                />

                <Controller
                  name="prescription.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Date of Birth" type="date" />
                  )}
                />

                <Controller
                  name="prescription.prescriptionDate"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Prescription Date" type="date" />
                  )}
                />

                <Controller
                  name="prescription.medicationName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Medication Name"
                      placeholder="e.g., Amoxicillin 500mg"
                    />
                  )}
                />

                <Controller
                  name="prescription.dosageInstructions"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Dosage Instructions"
                      textarea
                      rows={2}
                      placeholder="e.g., Take 1 tablet twice daily after meals"
                    />
                  )}
                />

                <Controller
                  name="prescription.duration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Duration"
                      placeholder="e.g., 7 days"
                    />
                  )}
                />

                <Controller
                  name="prescription.refills"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Refills"
                      type="number"
                      placeholder="e.g., 0, 1, 2"
                      min={0}
                    />
                  )}
                />

                <Controller
                  name="prescription.prescriberName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Prescriber’s Name"
                      placeholder="Name of doctor"
                    />
                  )}
                />

                <Controller
                  name="prescription.prescriberSignature"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Prescriber’s Signature"
                      placeholder="Signature"
                    />
                  )}
                />
              </>
            )}


             {/* Lab form */}

            {selectedFormType === "lab" && (
              <>
                <Controller
                  name="lab.patientFullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Full Name"
                      placeholder="Enter full name"
                    />
                  )}
                />

                <Controller
                  name="lab.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Date of Birth" type="date" />
                  )}
                />

                <Controller
                  name="lab.testRequested"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Test Requested"
                      placeholder="e.g., CBC, Liver Function, Lipid Profile"
                    />
                  )}
                />

                <Controller
                  name="lab.reasonForTest"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Reason for Test"
                      textarea
                      rows={2}
                      placeholder="e.g., Routine check, specific symptoms"
                    />
                  )}
                />

                <Controller
                  name="lab.requestedBy"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Requested By (Clinician Name)"
                      placeholder="Enter clinician name"
                    />
                  )}
                />

                <Controller
                  name="lab.requestDate"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Date of Request" type="date" />
                  )}
                />

                <Controller
                  name="lab.additionalNotes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Additional Notes"
                      textarea
                      rows={2}
                      placeholder="Optional"
                    />
                  )}
                />
              </>
            )}

 {/* registration form */}


            {selectedFormType === "registration" && (
              <>
                <Controller
                  name="registration.fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Full Name"
                      placeholder="Enter full name"
                    />
                  )}
                />

                <Controller
                  name="registration.dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} label="Date of Birth" type="date" />
                  )}
                />

                <Controller
                  name="registration.gender"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gender
                      </label>
                      <select
                        {...field}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                />

                <Controller
                  name="registration.contactNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Contact Number"
                      type="tel"
                      placeholder="Enter contact number"
                    />
                  )}
                />

                <Controller
                  name="registration.emailAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email Address"
                      type="email"
                      placeholder="Enter email"
                    />
                  )}
                />

                <Controller
                  name="registration.homeAddress"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Home Address"
                      textarea
                      rows={2}
                      placeholder="Enter address"
                    />
                  )}
                />

                <Controller
                  name="registration.emergencyContactName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Emergency Contact Name"
                      placeholder="Enter name"
                    />
                  )}
                />

                <Controller
                  name="registration.emergencyContactNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Emergency Contact Number"
                      type="tel"
                      placeholder="Enter number"
                    />
                  )}
                />

                <Controller
                  name="registration.emergencyContactRelationship"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Relationship to Emergency Contact"
                      placeholder="Enter relationship"
                    />
                  )}
                />
              </>
            )}


 {/* Intake form */}
            {selectedFormType === "intake" && (
              <>
                <Controller
                  name="intake.patientFullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Patient Full Name"
                      placeholder="Full name"
                    />
                  )}
                />

                <Controller
                  name="intake.reasonForVisit"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Reason for Visit
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Describe your main concern or symptoms..."
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.currentSymptoms"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Current Symptoms
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="List your symptoms (e.g. pain, fatigue, swelling)..."
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.symptomStartDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        When did the symptoms start?
                      </label>
                      <input
                        {...field}
                        type="date"
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.currentMedications"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Medications Currently Taking
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        placeholder="Include dosage and frequency if known..."
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.allergies"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Allergies
                      </label>
                      <textarea
                        {...field}
                        rows={2}
                        placeholder="List known drug, food, or environmental allergies..."
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.substanceUse"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Do you use tobacco, alcohol, or drugs?
                      </label>
                      <textarea
                        {...field}
                        rows={2}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="intake.referralSource"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        How did you hear about us?
                      </label>
                      <input
                        {...field}
                        type="text"
                        placeholder="Friend, doctor, ad, social media, etc."
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={onCancel} bordered type="button">
                Cancel
              </Button>
              <Button primary type="submit">
                {isAddMode ? "Submit" : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
