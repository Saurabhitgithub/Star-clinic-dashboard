import { configureStore } from '@reduxjs/toolkit'
import { loaderSlice } from './slices/loaderSlice'
import { toastSlice } from './slices/toastSlice'
import { specilityApiSlice } from './apiSlices/specialityApiSlice'
import { doctorApiSlice } from './apiSlices/doctorApiSlices'
import { patientApiSlice } from './apiSlices/patientApiSlice'
import { customerSupportApiSlice } from './apiSlices/customerSupportApiSlices'
import { subscriptionPlanApiSlice } from './apiSlices/subscriptionsPlanApiSlice'
import { appointmentsApiSlice } from './apiSlices/appointmentsApiSlice'
import { purchasedSubscriptionApiSlice } from './apiSlices/purchasedSubscriptionApiSlice'
import { dashboardApiSlice } from './apiSlices/dashboardApiSlice'
import { splashScreenApiSlice } from './apiSlices/splashScreenApiSlice'
import { productApiSlice } from './apiSlices/productApiSlices'
import { onboardingApiSlice } from './apiSlices/onboardingApiSlice'
import { themeApiSlice } from './apiSlices/themeApiSlice'

export const store = configureStore({
  reducer: {
    loader: loaderSlice.reducer,
    toast: toastSlice.reducer,
    [specilityApiSlice.reducerPath]: specilityApiSlice.reducer,
    [splashScreenApiSlice.reducerPath] : splashScreenApiSlice.reducer,
    [doctorApiSlice.reducerPath]: doctorApiSlice.reducer,
    [patientApiSlice.reducerPath]: patientApiSlice.reducer,
    [customerSupportApiSlice.reducerPath]: customerSupportApiSlice.reducer,
    [subscriptionPlanApiSlice.reducerPath]: subscriptionPlanApiSlice.reducer,
    [appointmentsApiSlice.reducerPath]: appointmentsApiSlice.reducer,
    [purchasedSubscriptionApiSlice.reducerPath]:
      purchasedSubscriptionApiSlice.reducer,
    [dashboardApiSlice.reducerPath]: dashboardApiSlice.reducer,
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [onboardingApiSlice.reducerPath]: onboardingApiSlice.reducer,
    [themeApiSlice.reducerPath]: themeApiSlice.reducer
  },
  middleware: pre =>
    pre()
      .concat(specilityApiSlice.middleware)
      .concat(splashScreenApiSlice.middleware)
      .concat(doctorApiSlice.middleware)
      .concat(patientApiSlice.middleware)
      .concat(customerSupportApiSlice.middleware)
      .concat(subscriptionPlanApiSlice.middleware)
      .concat(appointmentsApiSlice.middleware)
      .concat(purchasedSubscriptionApiSlice.middleware)
      .concat(dashboardApiSlice.middleware)
      .concat(productApiSlice.middleware)
      .concat(onboardingApiSlice.middleware)
      .concat(themeApiSlice.middleware)
})
