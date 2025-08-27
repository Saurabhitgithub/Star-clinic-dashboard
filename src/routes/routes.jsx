
import { SpecialtyManagement } from '../views/SpecialtyManagement/SpecialtyManagement'
import { AddUpdateSpeciality } from '../views/SpecialtyManagement/AddUpdateSpeciality'
import { Patients } from '../views/Patients/Patients'
import { Doctors } from '../views/Doctors/Doctors'
import { ViewDoctor } from '../views/Doctors/ViewDoctor'
import { ViewPatient } from '../views/Patients/ViewPatient'
import { CustomerSupportManagement } from '../views/CustomerSupportManagement/CustomerSupportManagement'
import { CreateUpdateCustomerSupport } from '../views/CustomerSupportManagement/CreateUpdateCustomerSupport'
import { ViewCustomerSupport } from '../views/CustomerSupportManagement/ViewCustomerSupport'
import { Appointments } from '../views/Appointments/Appointments'
import { ViewAppointment } from '../views/Appointments/ViewAppointment'
import { ManageSubscriptions } from '../views/ManageSubscription/ManageSubscriptions'
import { AddUpdateSubscription } from '../views/ManageSubscription/AddUpdateSubscription'
import { PurchasedSubscription } from '../views/PurchasedSubscription/PurchasedSubscription'
import BestOffer from '../views/BestOffer/BestOffer'
import { Products } from '../views/Products/Products'
import { CreateUpdateProduct } from '../views/Products/CreateUpdateProduct'
import { SplashScreen } from '../views/SplashScreen/SplashScreen'
import { AddUpdateSplashScreen } from '../views/SplashScreen/AddUpdateSplashScreen'
import { AddUpdateOnboarding } from '../views/OnboardingManagement/AddUpdateOnboarding'
import { OnboardingManagement } from '../views/OnboardingManagement/OnboardingManagement'
import SafeAndSurgery from '../views/SafeAndSurgeryManagement/SafeAndSurgery'
import AddUpdateSurgeries from '../views/SafeAndSurgeryManagement/AddUpdateSurgeries'
import { Theme } from '../views/Themes/Theme'
import { UpdateTheme } from '../views/Themes/UpdateTheme'
import AddUpdateBestOffer from '../views/BestOffer/AddUpdateBestOffer'
import { LeadsManagement } from '../views/LeadsManagement/LeadsManagement'
import { TeamManagement } from "../views/TeamManamement/TeamManagement"
import AddUpdateTeam from '../views/TeamManamement/AddUpdateTeam'
import { CreateLeads } from '../views/LeadsManagement/CreateLeads'
import LeadPipeline from '../views/LeadsManagement/LeadPipeline'
import CreateNewPipeline from '../views/LeadsManagement/CreateNewPipeline'
import Services from '../views/ServiceAndPackages/Services'
import PackageManagement from '../views/ServiceAndPackages/Package/PackageManagement'
import AddUpdatePackage from '../views/ServiceAndPackages/Package/AddUpdatePackage'
import EditPipeline from '../views/LeadsManagement/Editpipeline'
import DetailViewLeads from '../views/LeadsManagement/DetailViewLeads'
import AddUpdateBundle from '../views/ServiceAndPackages/Package/AddUpdateBundle'
import CreateItemBundle from '../views/ServiceAndPackages/Package/CreateItemBundle'
import AddUpdateCategory from '../views/ServiceAndPackages/AddUpdateCategory'
import AddUpdateServices from '../views/ServiceAndPackages/AddUpdateServices'
import AddEducationInfo from '../views/Setup/AddEducationInfo'
import Setup from '../views/Setup/SetUp'
import ItemListingPage from '../views/ServiceAndPackages/Package/ItemListingPage'
import { CreateUpdateDrug } from '../views/Setup/Drug/CreateUpdateDrug'
import { MedicalForm } from '../views/Setup/MedicalForm'
import GeneralForm from '../views/Setup/GeneralForm'
import MedicalCondition from '../views/Setup/MedicalCondition/Medicalcondition'
import { Drug } from '../views/Setup/Drug/Drug'
import ResourceRoom from '../views/ServiceAndPackages/Resources/ResourceRoom'
import CreateRoom from '../views/ServiceAndPackages/Resources/CreateRoom'
import ServicesListing from '../views/ServiceAndPackages/Resources/ServicesListing'
import AddRoomServicesDetails from '../views/ServiceAndPackages/Resources/AddRoomServicesDetails'
import EquipmentResource from '../views/ServiceAndPackages/Resources/EquipmentResource'
import AddEquipmentResource from '../views/ServiceAndPackages/Resources/AddEquipmentResource'
import EquipmentServiceListing from '../views/ServiceAndPackages/Resources/EquipmentServiceListing'
import AddEquipmentServiceDetails from '../views/ServiceAndPackages/Resources/AddEquipmentServiceDetails'
import NewsManagement from '../views/NewsManagement/NewsManagement'
import AddUpdateNews from '../views/NewsManagement/AddUpdateNews'
import OrderHistory from '../views/OrderHistory/OrderHistory'
import OnlineBooking from '../views/ServiceAndPackages/OnlineBooking/OnlineBooking'
import ClientPortal from '../views/ServiceAndPackages/ClientPortal/ClientPortal'
import { FAQList } from '../views/FAQ/FAQList'
import { AddFaq } from '../views/FAQ/AddFaq'
import BusinessDetails from '../views/BusinessManagement/BusinessDetails'
import Financials from '../views/BusinessManagement/Financial/Financials'
import AddFinancialsDetails from '../views/BusinessManagement/Financial/AddFinancialsDetails'
import CreateCreditNotes from '../views/BusinessManagement/Financial/CreateCreditNotes'
import EmailFinancialDetails from '../views/BusinessManagement/Financial/EmailFinancialDetails'
import LabsTestManagement from '../views/LabsTestManagement/LabsTestManagement'
import CreateLabTest from '../views/LabsTestManagement/CreateLabTest'
import UploadReport from '../views/LabsTestManagement/UploadReport'
import EmailReport from '../views/LabsTestManagement/EmailReport'
import PrintReport from '../views/LabsTestManagement/PrintReport'
import ViewReport from '../views/LabsTestManagement/ViewReport'
import GiftVoucher from '../views/Setup/GiftVoucher/GiftVoucher'
import BlankForm from '../views/Setup/FormManagement.jsx/BlankForm'
import CreateBlankForm from '../views/Setup/FormManagement.jsx/CreateBlankForm'
import PreviewMedicalForm from '../views/Setup/PreviewMedicalForm'
import LocationDetails from '../views/BusinessManagement/Financial/LocationManagement/LocationDetails'




export const specialityManagementRoutes = {
  path: '/specialtyManagement',
  element: <SpecialtyManagement />,
  children: [
    {
      path: 'add',
      element: <AddUpdateSpeciality mode={'add'} />
    },
    {
      path: 'update/:id',
      element: <AddUpdateSpeciality mode={'update'} />
    }
  ]
}

export const patientsRoutes = {
  path: 'patients',
  children: [
    {
      index: true,
      element: <Patients />
    },
    {
      path: 'view/:id',
      element: <ViewPatient />
    }
  ]
}

export const doctorsRoutes = {
  path: '/doctors',
  children: [
    {
      index: true,
      element: <Doctors />
    },
    {
      path: 'view/:id',
      element: <ViewDoctor />
    }
  ]
}
export const appointmentsRoutes = {
  path: '/appointments',
  children: [
    {
      index: true,
      element: <Appointments />
    },
    {
      path: "view/:id",
      element: <ViewAppointment />
    }
  ]
}
export const manageSubscriptionsRoutes = {
  path: '/manageSubscriptions',
  element: <ManageSubscriptions />,
  children: [
    {
      path: "add",
      element: <AddUpdateSubscription mode={"add"} />
    },
    {
      path: "update/:id",
      element: <AddUpdateSubscription mode={"update"} />
    }
  ]
}
export const purchasedSubscriptionRoutes = {
  path: '/purchasedSubscription',
  children: [
    {
      index: true,
      element: <PurchasedSubscription />
    }
  ]
}
export const customerSupportManagementRoutes = {
  path: '/customerSupportManagement',
  children: [
    {
      index: true,
      element: <CustomerSupportManagement />
    },
    {
      path: "create",
      element: <CreateUpdateCustomerSupport />
    },
    {
      path: "update/:id",
      element: <CreateUpdateCustomerSupport />
    },
    {
      path: "view/:id",
      element: <ViewCustomerSupport />
    },
  ]
}
export const BestOfferRoutes = {
  path: 'BestOffer',
  element: <BestOffer />,
  children: [
    {
      path: "create",
      element: <AddUpdateBestOffer mode={"add"} />
    },
    {
      path: "update/:id",
      element: <AddUpdateBestOffer mode={"add"} />
    },
  ]
}
export const productRoutes = {
  path: 'products',
  children: [
    {
      index: true,
      element: <Products />,
    },
    {
      path: "create",
      element: <CreateUpdateProduct mode={"add"} />
    },
    {
      path: "update/:id",
      element: <CreateUpdateProduct mode={"edit"} />
    },
  ]
}

export const orderHistoryRoutes = {
    path: 'orderHistory',
    element:<OrderHistory />,
  }
  



export const SplashScreenRoutes = {
  path: "/splashScreen",
  element: <SplashScreen />,
  children: [
    {
      path: "update/:id",
      element: <AddUpdateSplashScreen mode={"update"} />
    }
  ]
}
export const OnboardingMangementRoutes = {
  path: "/onboardingManagement",
  element: <OnboardingManagement />,
  children: [
    {
      path: "add",
      element: <AddUpdateOnboarding mode={"add"} />
    },
    {
      path: "update/:id",
      element: <AddUpdateOnboarding mode={"update"} />
    }]
}

export const safeAndSurgeryRoutes = {
  path: "/safeAndSurgery",
  element: <SafeAndSurgery />,
  children: [
    {
      path: "create",
      element: <AddUpdateSurgeries mode={"add"} />
    },
    {
      path: "update/:id",
      element: <AddUpdateSurgeries mode={"update"} />
    }
  ]
}
export const themesRoutes = {
  path: "/theme",
  element: <Theme />,
  children: [{
    path: "update/:id",
    element: <UpdateTheme />
  }]

}

export const teamManagementRoutes = [
  {
    path: "/teamManagement",
    element: <TeamManagement />,
    children: [
      {
        path: "create",
        element: <AddUpdateTeam />

      },
      {
        path: "update/:id",
        element: <AddUpdateTeam />

      }
    ]
  }

];
export const LeadsManagementRoutes = [
  {
    path: "/leadsManagement",
    element: <LeadsManagement />,
  },
  {
    path: "/leadsManagement/add",
    element: <CreateLeads mode="add" />,
  },
  {
    path: "/leadsManagement/edit/:id",
    element: <CreateLeads mode="update" />,
  },
  {
    path: "/leadsPipeline",
    element: <LeadPipeline />,
  },
  {
    path: "/createNewPipeline",
    element: <CreateNewPipeline />,
  },
    {
    path: "/editPipeline/:pipelineId",
    element: <EditPipeline />,
  },

]


 




export const ServiceAndPackages = [
  {
    path: "/services",
    element: <Services />,
    children: [
      {
        path: "add",
        element: <AddUpdateServices  />
      },
      {
        path: "updateService/:id",
        element: <AddUpdateServices />

      } 
      ,
      {
        path: "addCategory",
        element: <AddUpdateCategory  />
      },
      {
        path: "updateCategory/:id",
        element: <AddUpdateCategory />

      }

    ]
  },
  {
    path: "packages",
    element: <PackageManagement />,
    children: [
      {
        path: "add",
        element: <AddUpdatePackage />
      },
      {
        path: "updatePackage/:id",
        element: <AddUpdatePackage />

      },
      {
        path: "updateBundle/:id",
        element: <AddUpdateBundle />,

      }

    ]
  },

]

export const ServiceBundleRoutes = [
  {
    path: "/packages/addBundle",
    element: <AddUpdateBundle />,

  },
      
  { path: "/updateBundle/:id", element: <AddUpdateBundle /> },
  {
    path: "/packages/item/:id",
    element: <ItemListingPage />,
    children: [
      { path: "add", element: <CreateItemBundle /> },
      { path: "updateItem/:docId", element: <CreateItemBundle /> },
    ]
  }
];


export const SetUpRoutes = [
  {
    path: "/setup",
    element: <Setup />,
    children: [
      {
        path: "/setup/addEducationInfo", 
        element: <AddEducationInfo />,
      },
      
     
    ],
  },
       {
    path:"/labsManagement",
    element:<LabsTestManagement/>,
    children: [
      {
        path: "createLabTest", 
        element: <CreateLabTest />,
      },
      {
        path: "uploadReport/:id", 
        element: <UploadReport />,
      },
      {
        path: "emailReport", 
        element: <EmailReport />,
      },
      {
        path: "printReport/:id", 
        element: <PrintReport />,
      },
    ],
  },

  {
    path: "/viewReport/:id", 
    element: <ViewReport />,
  },
{
    path: "/setup/drug", 
    element: <Drug/>,
    children: [
      {
        path: "/setup/drug/create", 
        element: <CreateUpdateDrug />,
      },
      {
        path: "/setup/drug/update/:id", 
        element: <CreateUpdateDrug />,
      },
    ]
    
  },
   {
    path: "/giftVoucher",
    element: <GiftVoucher />
  },
 

  {
    path:"/medical-form",
    element:<MedicalForm/>,
    children: [
      {
    path:"preview/:id",
    element:<PreviewMedicalForm />
      },
    ]
  },
  {
    path:"/general-form",
    element:<GeneralForm/>
  },

    {
    path:"/update/:id",
    element:<GeneralForm/>
  },
   {
    path:"/BlankForm",
    element:<BlankForm/>,
    children: [
     {
        path: "create", 
        element: <CreateBlankForm />,
      },
       {
        path: "update/:id", 
        element: <CreateBlankForm />,
      },
    ]
  },
  {
    path:"/medical-condition",
    element:<MedicalCondition/>
  },
];

// resource management

export const ResourcesManagementRoutes = [
  {
    path: "/resourceRoom",
    element: <ResourceRoom />,
    children: [
      {
        path: "createRoom",
        element: <CreateRoom />
      },
      {
        path: "updateRoom/:id",
        element: <CreateRoom />

      }
    ]
  },
{
  path: "/servicesListing/:id",
    element: <ServicesListing />,
    children: [
      {
        path: "AddRoomServices",
        element: <AddRoomServicesDetails />
      },
      { path: "updateRoomService/:docId", 
        element:<AddRoomServicesDetails />
       },
    ]
  }
  ,
{
  path: "/resourceEquipment",
    element: <EquipmentResource />,
    children: [
      {
        path: "AddEquipmentResource",
        element: <AddEquipmentResource />
      },
      {
        path: "updateEquipmentResource/:id",
        element: <AddEquipmentResource />
      },
    ]
  }

  ,
{
  path: "/equipmentServiceListing/:id",
    element: <EquipmentServiceListing />,
    children: [
      {
        path: "AddResourceServicesDetails",
        element: <AddEquipmentServiceDetails />
      },
      {
        path: "updateResourceServicesDetails/:docId",
        element: <AddEquipmentServiceDetails />
      },
    ]
   }
]


export const newsManagementRoutes = [
  {
    path: "/newsManagement",
    element: <NewsManagement />,
    children: [
      {
        path: "Add",
        element: <AddUpdateNews />

      },
      {
        path: "update/:id",
        element:<AddUpdateNews />

      }
    ]
  }

];

export const bookingManagementRoutes=[
  {
    path: "/booking",
    element: <OnlineBooking />,
  }
]


export const businessManagementRoutes=[
  {
    path: "/businessDetail",
    element: <BusinessDetails />,
  },
  
  {
    path: "/financialDetails",
    element: <Financials />,
    children: [
      {
        path: "Add",
        element: <AddFinancialsDetails />

      },
        {
        path: "CreateCreditNotes",
        element: <CreateCreditNotes />

      },
       {
        path: "EmailFinancialDetails",
        element: <EmailFinancialDetails />

      },

    ]
  },
     {
    path: "/locationManagement",
    element: <LocationDetails />,
  },
]






export const clientPortalRoutes=[
  {
    path: "/clientPortal",
    element: <ClientPortal />,
  }
]
export const faqRoutes ={
  path: 'faq',
 
  children: [
    {
      index: true,
      element:<FAQList />,
    },
    {
      path: "create",
      element: <AddFaq mode={"add"} />
    },
    {
      path: "update/:id",
      element: <AddFaq mode={"edit"} />
    },
  ]
};