

export const BASE_URL = import.meta.env.VITE_API_URL

export const APIS = {
  login: '/auth/login',
  refreshToken: '/auth/login/refreshTokenAPI',
  forgotPassword: '/auth/login/forgotPassword',
  passwordReset: '/auth/login/changePassword',
  uploadMultipleDocsData: '/doc/uploadMultipleDocsData',

  // specialities apis
  getAllSpecialitiesData: '/specialities/getAllSpecialitiesData',
  addSpecialities: '/specialities/addSpecialities',
  deleteSpecialities: '/specialities/deleteSpecialitiesById/',
  updateSpecialitiesById: '/specialities/updateSpecialitiesById/',
  getSpecialitiesById: '/specialities/getSpecialitiesById/',
  updateSpecialityStatus: '/specialities/updateStatus/',

  // doctors apis
  getAllDoctorsData: '/user/getAllDoctorsData',
  updateDoctorById: '/user/updateDoctorById/',
  getDoctorDataById: '/user/getDoctorDataById/',

  // patients apis

  getAllPatientData: '/user/getAllPatientData',
  getPatientDataById: '/user/getPatientDataById/',
  getAllPatientsOfDoctor: '/user/getPatientDataOfDoctor/',
  getAppointmentOfPatient: '/appointment/getAppointmentOfPatient/',
  getUserCardData :'/card/getUserCardData/',

  // rating and comments apis

  getAllRatingAndReviewsOfDoctor: '/rating/getAllRatingAndReviewsOfDoctor/',
  getAverageRatingData: '/rating/getAverageRatingData/',

  // customer and support apis

  getAllCustomerSupportData: '/customerSupport/getAllCustomerSupportData',
  addCustomerSupportData: '/customerSupport/addCustomerSupport',
  getCustomerSupportById: '/customerSupport/getCustomerSupportById/',
  updateCustomerSupportById: '/customerSupport/updateCustomerSupportById/',
  updateCustomerSupportStatus: '/customerSupport/updateStatus/',
  deleteCustomerSupportById: '/customerSupport/deleteCustomerSupportById/',

  // subscription plan apis
  addSubscriptionPlan: '/subscriptionPlan/addsubscription',
  getAllSubscriptionPlans: '/subscriptionPlan/getAllsubscriptionData',
  getSubscriptionPlanById: '/subscriptionPlan/getSubscriptionById/',
  updateSubscriptionData: '/subscriptionPlan/updateSubscriptionById/',
  deleteSubscriptionPlan: '/subscriptionPlan/deleteSpecialitiesById/',

  // appointments apis

  getAllAppointmentData: '/appointment/getAllAppointmentData',
  getAppointmentById:
    '/appointment/getAppointmentByIdWithDoctorAndPatientDetails/',
  getAllUpcomingAppointment: 'appointment/getAllUpcomingAppointment',

  // purchases management apis

  getAllSubcriberData: '/subscriber/getAllSubcriberData',

  // dashboard apis
  getDashboardAnalyticalData: '/appointment/getDashboardAnalyticalData',

  // product apis
  createProduct: '/product/addProduct',
  getAllProduct: '/product/getAllProduct',
  getProductById: '/product/getProductById/',
  updateProduct: '/product/updateProduct/',
  deleteProduct: '/product/deleteProduct/',
  Addcategory: '/category/addCategory',
  getAllCategory:  '/category/getAllCategory',

  // splash screen apis
  getAllSplash: '/splash/getAllSplash',
  updateSplash: '/splash/updateSplash/',
  getSplashScreenById: '/splash/getSplashScreenById',

  // onboarding screen apis
  getAllOnboarding: '/onBoarding/getAllOnBoarding',
  addOnboardingScreen: '/onBoarding/addOnBoarding',
  getOnboardingById: '/onBoarding/getOnboardingById/',
  updateOnboardingById: '/onBoarding/updateOnboardingById/',
  deleteOnboardingScreen: '/onBoarding/deleteOnBoarding/',
  // safe surgery apis
  addSurgeriesdata: '/safety/addSafety',
  getAllSurgeriesData: '/safety/getAllSafety',
  updateSurgeriesData: '/safety/updateSafety/:id',
  getSurgeryDataById: '/safety/getSafetyDataById/:id',
  deleteSurgeryDataById: '/safety/deleteSafety/:id',
   updateSurgeriesStatus: '/safety/updateSafety/:id',

  // theme apis

  getThemeData: '/theme/getAllTheme',
  addTheme: 'theme/addTheme',
  updateTheme: '/theme/updateTheme/',

  // offers apis
  updateBestOffer: '/bestOffer/updateBestOffer/',
  getBestOffer: '/bestOffer/getAllBestOffer',
  addBestOffer: '/bestOffer/addBestOffer',
  deleteBestOffer: '/bestOffer/deleteBestOffer/',
  getBestOfferDataById: '/bestOffer/getAllBestOfferById/:id',
 


  // leads apis 
  getAllLeads:'/lead/getAllLeadManagement',
  addLeadData:'/lead/addLeadManagement',
  getLeadById: "/lead/getLeadManagementById",
  updateLeadData:'/lead/updateLeadManagementById/',
  deleteLeadData:'/lead/deleteLeadManagement/',
  addNewPipeline:'/pipeline/addPipeline',
  getAllPipeline:'/pipeline/getAllPipeline',
  getAllPipelineById:'/pipeline/getPipelineById',
  updatePipelineData:'/pipeline/updatePipelineById/',
  getLeadsByPipeline:'/lead/getLeadsByPipeline',
  addLeadNote:'/leadNote/addLeadNote',
 

    // team management apis
getAllTeamData:"/team/getAllTeam",
addTeamData:"/team/addTeam",
getTeamDataById:"/team/getTeamDataById/:id",
updateTeamData:"/team/updateTeam/:id",
deleteTeamDataById:"/team/deleteTeam/:id",
updateTeamStatus:"/team/updateTeam/",


  // Allergy apis
  addAllergy: '/allergy/addAllergy',
  getAllAllergy: '/allergy/getAllAllergy/',
  getAllergyById :'/allergy/getAllergyById/',
  updateAllergyById :'/allergy/updateAllergyById/',
  deleteAllergy :'/allergy/deleteAllergy/',

// patient Document Api 
getAllDocumentData:"/document/getAllDocument/:id",
AddDocumentData:"/document/addDocument",
getDocumentDataById:"/document/getDocumentById/:id",
updateDocumentData:"/document/updateDocumentById/:id",
DeleteDocumentDataById:"/document/deleteDocument/:id",
updateDocumentStatus:"/document/updateDocumentById/",
getAllFinancialsData: '/appointment/getAppointmentOfPatient/:id',

// patient certificate
getAllPatientCertificateDataById: '/user/getPatientDataById/',

  //Client Problem
  addclientProblem: '/clientProblem/addClientProblem',
  getAllClientProblem:'/clientProblem/getAllClientProblem/',
  getClientProblemById :'/clientProblem/getClientProblemById/',
  deleteClientProblem :'/clientProblem/deleteClientProblem/',
  updateClientProblemById  :'/clientProblem/updateClientProblemById/',



  addCategoryData:'/serviceCategory/addServiceCategory',
  getAllCategoryData:'/serviceCategory/getAllServiceCategory',
  getCategoryDataById:'/serviceCategory/getServiceCategoryById/:id',
  updateCategoryDataById:'/serviceCategory/updateServiceCategory/:id',
  deleteCategoryDataById:'/serviceCategory/deleteServiceCategory/:id',
  updateCategoryStatus:'/serviceCategory/updateServiceCategory/:id',

// Education apis 
  addEducation:'/education/addEducation',
  getAllEducation:'/education/getAllEducation/',
  addEducationCategory:'/educationCategory/addEducationCategory',
  getAllEducationCategory:'/educationCategory/getAllEducationCategory',
  deleteEducationDataById:'/education/deleteEducation/:id',





  // Service section 
  addServiceData:'/packageService/addPackageService',
  getAllServiceData:'/packageService/getAllPackageService',
  getServiceDataById:'/packageService/getPackageServiceById/:id',
  updateServiceDataById:'/packageService/updatePackageServiceById/:id',
  deleteServiceDataById:'packageService/deletePackageService/:id',
  updateServiceStatus:'/packageService/updatePackageServiceById/:id',

  // package section 

  addPackageData:'/package/addPackage',
  getAllpackageData:'/package/getAllPackage',
  getPackageDataById:'/package/getPackageById/:id',
  updatePackageDataById:'/package/updatePackageById/:id',
  deletePackageDataById:'/package/deletePackage/:id',
  updatePackageStatus:'/package/updatePackageById/:id',

  // bundle section api 

addBundleData:'/bundle/addBundle',
getAllBundleData:'/bundle/getAllBundle',
getBundleDataById:'/bundle/getBundleById/:id',
updateBundleDataById:'/bundle/updateBundleById/:id',
deleteBundleDataById:'/bundle/deleteBundle/:id',
updateBundleStatus:'/bundle/updateBundleById/:id',


// item section api 
addBundleItemData:'/bundleItem/addBundleItem',
getAllBundleItemData:'/bundleItem/getAllBundleItem/:id',
getBundleItemDataById:'/bundleItem/getBundleItemById/:id',
updateBundleItemDataById:'/bundleItem/updateBundleItemById/:id',
deleteBundleItemDataById:'/bundleItem/deleteBundleItem/:id',
updateBundleItemStatus:'/bundleItem/updateBundleItemById/:id',


  //Drug
  addDrug:'/drug/addDrug',
  getAllDrug:'/drug/getAllDrug',
  updateDrugById:'/drug/updateDrugById/',
  getDrugById:'/drug/getDrugById/',
  deleteDrug:'/drug/deleteDrug/',


  // Room section under Resource Management
addRoomData:'/room/addRoom',
getAllRoomData:'/room/getAllRoom',
getRoomDataById:'/room/getRoomById/:id',
updateRoomDataById:'/room/updateRoomById/:id',
updateRoomStatusById:'/room/updateRoomById/:id',
deleteRoomDataById:'/room/deleteRoom/:id',


//Room service details 

addRoomServiceData:'/roomService/addRoomService',
getAllRoomServiceData:'/roomService/getAllRoomService/:id',
getRoomServiceDataById:'/roomService/getRoomServiceById/:id',
updateRoomServiceDataById:'/roomService/updateRoomServiceById/:id',
updateRoomServiceStatusById:'/roomService/updateRoomServiceById/:id',
deleteRoomServiceDataById:'/roomService/deleteRoomService/:id',


//Photos
addPhotos : '/photo/addPhotos',
getAllAlbums:'/photo/getAllPhotos/',
updatePhotosById :'/photo/updatePhotosById/',
getPhotosById:'/photo/getPhotosById/',
addBeforeAfter:'/beforeAfter/addBeforeAfter/',

// news management 
// addNewsData:'/news/addNews',
// getAllNewsData:'news/getAllNews',
// getNewsDataById:'news/getNewsDataById/:id',
// updateNewsDataById:'news/updateNews/:id',
// deleteNewsDataById:'news/deleteNews/:id',
// updateNewsStatusById:'news/updateNews/:id',


  //Patch Test
  addPatchTest:'/patch/addPatchTest',
  getAllPatchTest:'/patch/getAllPatchTest/',
  addPatchTest :'/patch/addPatchTest',
  getPatchTestById :'/patch/getPatchTestById/',
  updatePatchTestById :'/patch/updatePatchTestById/',
  deletePatchTest:'/patch/deletePatchTest/',

// Order History api 
  getAllPaymentData:'/payment/getAllPaymentData',
  updateOrderStatus:'/crmPayment/updatePyamentStatusById/',
  
  




  // news management 
addNewsData:'/news/addNews',
getAllNewsData:'news/getAllNews',
getNewsDataById:'news/getNewsDataById/:id',
updateNewsDataById:'news/updateNews/:id',
deleteNewsDataById:'news/deleteNews/:id',
updateNewsStatusById:'news/updateNews/',

//  resource equipment 
addResourceEquipment:'/roomresource/addRoomResource',
getAllResourceEquipment:'/roomresource/getAllRoomResource',
getResourceEquipmentById:'/roomresource/getRoomResourceById/:id',
updateResourceEquipmentById:'/roomresource/updateRoomResourceById/:id',
updateResourceEquipmentStatusById:'/roomresource/updateRoomResourceById/:id',
deleteResourceEquipmentById:'/roomresource/deleteRoomResource/:id',


// resource Service listing

addEquipmentService:'resourceEquipment/addRoomResourceEquipment',
getAllEquipmentService:'resourceEquipment/getAllRoomResourceEquipment/:id',
getEquipmentServiceById:'resourceEquipment/getRoomResourceEquipmentById/:id',
updateEquipmentServiceById:'resourceEquipment/updateRoomResourceEquipmentById/:id',
updateEquipmentServiceStatusById:'resourceEquipment/updateRoomResourceEquipmentById/:id',
deleteEquipmentServiceById:'resourceEquipment/deleteRoomResourceEquipment/:id',

// FAQ 
  createFaq: '/faq/addFaq',
  getAllFaq: '/faq/getAllFaq',
  getFaqById: '/faq/getFaqById',
  updateFaq: '/faq/updateFaq/',
  deleteFaq: '/faq/deleteFaq/',

  //gift voucher apis
  addCoupon:'/coupon/addCoupon',
  getAllCoupon :'/coupon/getAllCoupon',
  deleteCoupon:'/coupon/deleteCoupon/',

    // lab Test managemnt 
  addLabTestData:'/labManagement/addlabManagement',
 getAllLabTestData:'/labManagement/getAllLabManagement',
editLabData:'/labManagement/editLabManagement/:id',
getLabManagementDataById:'/labManagement/getLabManagementById/:id',


// Medical Condition Management
 addMedicalConditionData: '/medicalManagement/addMedicalManagement',
  getAllMedicalConditionData: 'medicalManagement/getAllMedicalManagement/:id',
  getMedicalConditionById: '/medicalManagement/getMedicalManagementDataById/:id',
  updateMedicalConditionById: '/medicalManagement/editMedicalManagement/:id',
  deleteMedicalConditionById: '/medicalManagement/deleteMedicalManagementDataById/:id',
  updateMedicalConditionStatusById: '/medicalManagement/editMedicalManagement/',


  // blank Form Management
  addBlankFormData: '/blankFormManagement/addBlankFormManagement',
  getAllBlankFormData: '/blankFormManagement/getAllBlankFormManagement',
  getBlankFormById: '/blankFormManagement/getBlankFormManagementDataById/:id',
  updateBlankFormById: '/blankFormManagement/editBlankFormManagement/:id',
  deleteBlankFormById: '/blankFormManagement/deleteBlankFormManagementDataById/:id',

  // medical Template form 
  addFormTemplateData: '/formTemplateManagement/addFormTemplate',
  getAllFormTemplateData: '/formTemplateManagement/getAllFormTemplates',
  getFormTemplateById: '/formTemplateManagement/getFormTemplateById/:id',
  updateFormTemplateById: '/formTemplateManagement/editFormTemplate/:id',
  deleteFormTemplateById: '/formTemplateManagement/deleteFormTemplateById/:id',

  // business details
  addBusinessDetails: '/BusinessDetailManagement/addBusinessDetail',
  getAllBusinessDetails: '/BusinessDetailManagement/getAllBusinessDetails',
  updateBusinessDetails: '/BusinessDetailManagement/updateBusinessDetail/:id',
  getBusinessDetailsById: '/BusinessDetailManagement/getBusinessDetailById/:id',
  deleteBusinessDetailsById: '/BusinessDetailManagement/deleteBusinessDetail/:id',

  
}
 
  


