import { SignIn } from "../views/Auth/SignIn";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ForgotPassword } from "../views/Auth/ForgotPassword";
import { Dashboard } from "../views/Dashboard/Dashboard";
import { SidebarLayout } from "../components/Layouts/SidebarLayout";
import { AllIons } from "../components/Icons/AllIons";
import {
  appointmentsRoutes,
  BestOfferRoutes,
  bookingManagementRoutes,
  businessManagementRoutes,
  clientPortalRoutes,
  customerSupportManagementRoutes,
  doctorsRoutes,
  faqRoutes,
  LeadsManagementRoutes,
  manageSubscriptionsRoutes,
  newsManagementRoutes,
  OnboardingMangementRoutes,
  orderHistoryRoutes,
  patientsRoutes,
  productRoutes,
  purchasedSubscriptionRoutes,
  ResourcesManagementRoutes,
  safeAndSurgeryRoutes,
  ServiceAndPackages,
  ServiceBundleRoutes,
  SetUpRoutes,
  specialityManagementRoutes,
  SplashScreenRoutes,
  teamManagementRoutes,
  themesRoutes,
} from "./routes";

import { SetNewPassword } from "../views/Auth/SetNewPassword";

import TreatmentNotes from "../views/Patients/ViewPatientPages/TreatmentNotes/TreatmentNotes";
import MedicalForm from "../views/Patients/MedicalForm";
import { PatientViewLayout } from "../components/Layouts/PatientViewLayout";
import Allergies from "../views/Patients/ViewPatientPages/Allergies";
import AddUpdateAllergy from "../views/Patients/ViewPatientPages/AddUpdateAllergy";
import PatchTest from "../views/Patients/ViewPatientPages/PatchTest/PatchTest";
import LabTest from "../views/Patients/ViewPatientPages/LabTest/LabTest";
import ClientProblem from "../views/Patients/ViewPatientPages/ClientProblem/ClientProblem";
import AddUpdateClientProblem from "../views/Patients/ViewPatientPages/ClientProblem/AddUpdateClientproblem";
import TreatmentsNotes from "../views/Patients/ViewPatientPages/TreatmentNotes/TreatmentNotes";
import Documents from "../views/Patients/ViewPatientPages/Documents/Documents";
import AddUpdateDocuments from "../views/Patients/ViewPatientPages/Documents/AddUpdateDocuments";
import CreateUpdatePatchTest from "../views/Patients/ViewPatientPages/PatchTest/CreateUpdatePatchTest";
import { Appointments } from "../views/Patients/ViewPatientPages/Appointments/Appointments";
import PackageManagement from "../views/ServiceAndPackages/Package/PackageManagement";
import AddUpdatePackage from "../views/ServiceAndPackages/Package/AddUpdatePackage";
import { Prescription } from "../views/Patients/ViewPatientPages/Prescription/Prescription";
import Photos from "../views/Patients/ViewPatientPages/Photos/Photos";
import { Drug } from "../views/Setup/Drug/Drug";
import { CreateUpdateDrug } from "../views/Setup/Drug/CreateUpdateDrug";
import DetailViewLeads from "../views/LeadsManagement/DetailViewLeads";
import TakePhoto from "../views/Patients/ViewPatientPages/Photos/TakePhoto";
import PatchTests from "../views/Patients/ViewPatientPages/PatchTest/PatchTest";
import VoucherBuilder from "../views/Setup/GiftVoucher/CreateVoucher";
import Financials from "../views/BusinessManagement/Financial/Financials";
import AddFinancialsDetails from "../views/BusinessManagement/Financial/AddFinancialsDetails";
import CreateCreditNotes from "../views/BusinessManagement/Financial/CreateCreditNotes";
import EmailFinancialDetails from "../views/BusinessManagement/Financial/EmailFinancialDetails";
import MedicalCondition from "../views/Patients/ViewPatientPages/MedicalConditionManagement/MedicalCondition";
import AddUpdateCondition from "../views/Patients/ViewPatientPages/MedicalConditionManagement/AddUpdateCondition";

export const Router = () => {
  const routes = [
    {
      path: "/",
      element: <SignIn />,
    },
    {
      path: "/allIcon",
      element: <AllIons />,
    },
    {
      path: "/forgotPassword",
      element: <ForgotPassword />,
    },
    {
      path: "/setNewPassword",
      element: <SetNewPassword />,
    },
    {
      path: "/leadsManagement/detailView/:id",
      element: <DetailViewLeads />,
    },
    {
      path: "/createVoucher",
      element: <VoucherBuilder />,
    },
    {
      path: "patientDetails/:id",
      element: <PatientViewLayout />,
      children: [
        {
          index: true, // Redirect when /patientDetails/:id is accessed
          element: <Navigate to="appointments" replace />,
        },
        {
          path: "appointments",
          element: <Appointments />,
        },
        {
          path: "treatmentNotes",
          element: <TreatmentsNotes />,
        },
        {
          path: "forms",
          element: <div>This is Forms page</div>,
        },
        {
          path: "photos",
          element: <Photos />,
        },
        {
          path: "photos/TakePhoto/:aid",
          element: <TakePhoto />,
        },

        {
          path: "allergies",
          element: <Allergies />,
          children: [
            {
              path: "add",
              element: <AddUpdateAllergy />,
            },
            {
              path: "update/:allergyId",
              element: <AddUpdateAllergy />,
            },
          ],
        },
        {
          path: "prescriptions",
          element: <Prescription />,
        },
        {
          path: "documents",
          element: <Documents />,
          children: [
            {
              path: "add",
              element: <AddUpdateDocuments />,
            },
            {
              path: "update/:docId",
              element: <AddUpdateDocuments />,
            },
          ],
        },
        {
          path: "/patientDetails/:id/patchTests",
          element: <PatchTests />,
          children: [
            {
              path: "add",
              element: <CreateUpdatePatchTest />, // shows modal to create
            },
            {
              path: "update/:testId",
              element: <CreateUpdatePatchTest />, // shows modal to update
            },
          ],
        },

        {
          path: "education",
          element: <div>This is Education page</div>,
        },
        {
          path: "labTests",
          element: <LabTest />,
        },
        {
          path: "clientProblems",
          element: <ClientProblem />,
          children: [
            {
              path: "add",
              element: <AddUpdateClientProblem />,
            },
            {
              path: "update/:clientProblemId",
              element: <AddUpdateClientProblem />,
            },
          ],
        },
        {
          path: "financialDetails",
          element: <Financials />,
          children: [
            {
              path: "Add",
              element: <AddFinancialsDetails />,
            },
            {
              path: "CreateCreditNotes",
              element: <CreateCreditNotes />,
            },
            {
              path: "EmailFinancialDetails",
              element: <EmailFinancialDetails />,
            },
          ],
        },

        {
          path: "medicalConditionManagement",
          element: <MedicalCondition />,
          children: [
            { path: "add", element: <AddUpdateCondition /> },
            { path: "update/:docId", element: <AddUpdateCondition /> },
          ],
        },
        {
          path: "package",
          element: <PackageManagement />,
          children: [
            {
              path: "add",
              element: <AddUpdatePackage />,
            },
          ],
        },
      ],
    },
    {
      path: "drug",
      element: <Drug />,
      children: [
        {
          path: "create",
          element: <CreateUpdateDrug />,
        },
      ],
    },
    // sidebar layout
    {
      element: <SidebarLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },

        {
          path: "/treatmentNotes",
          element: <TreatmentNotes />,
        },
        {
          path: "/medicalForm",
          element: <MedicalForm />,
        },
        { ...patientsRoutes },
        { ...doctorsRoutes },
        { ...specialityManagementRoutes },
        { ...customerSupportManagementRoutes },
        { ...appointmentsRoutes },
        { ...manageSubscriptionsRoutes },
        { ...purchasedSubscriptionRoutes },
        { ...BestOfferRoutes },
        { ...productRoutes },
        { ...SplashScreenRoutes },
        { ...OnboardingMangementRoutes },
        { ...safeAndSurgeryRoutes },
        { ...themesRoutes },
        ...LeadsManagementRoutes,
        ...teamManagementRoutes,
        ...ServiceAndPackages,
        ...ServiceBundleRoutes,
        ...SetUpRoutes,
        ...ResourcesManagementRoutes,
        ...newsManagementRoutes,
        ...bookingManagementRoutes,
        ...businessManagementRoutes,
        ...clientPortalRoutes,
        { ...orderHistoryRoutes },
        { ...faqRoutes },
      ],
    },
  ];

  const router = createBrowserRouter(routes, {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  });

  return (
    <RouterProvider future={{ v7_startTransition: true }} router={router} />
  );
};
