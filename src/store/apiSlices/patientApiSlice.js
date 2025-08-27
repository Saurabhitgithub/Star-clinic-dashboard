import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import moment from 'moment'
 
export const patientApiSlice = createApi({
  reducerPath: 'patientsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllPatientsTag'],
  endpoints: builder => ({
    // handle get all doctors
    GetAllPatients: builder.query({
      query: () => ({
        url: APIS.getAllPatientData,
        method: 'GET'
      }),
      providesTags: ['GetAllPatientsTag'],
      transformResponse: response => response?.data || []
    }),
    GetPatientById: builder.query({
      query: id => ({
        url: APIS.getPatientDataById + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data || []
    }),
    GetAllPatientsOfDoctor: builder.query({
      query: id => ({
        url: APIS.getAllPatientsOfDoctor + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data || []
    }),
    GetAppointmentOfPatient: builder.query({
      query: id => ({
        url: APIS.getAppointmentOfPatient + id,
        method: 'GET'
      }),
      // transformResponse: response => {
      //   let arr = !!response?.data?.length ? response?.data : []
      //   // trans form reasponse as per appointment date
      //   let obj = {
      //     upcoming: [],
      //     past: [],
      //     all: []
      //   }
      //   const finalRes = arr?.reduce((acc, val) => {
      //     if (val?.booking_date) {
      //       const bookingDate = moment(val.booking_date)
      //       const today = moment()
      //       acc.all.push(val)
      //       if (bookingDate.isAfter(today)) {
      //         acc.upcoming.push(val)
      //       } else {
      //         acc.past.push(val)
      //       }
      //     }
      //     return acc
      //   }, obj) || { ...obj }
 
      //   return finalRes || { ...obj }
      // }
 
transformResponse: response => {
  let arr = Array.isArray(response?.data) ? response.data : []
 
  let obj = {
    upcoming: [],
    past: [],
    all: []
  }
 
  const finalRes = arr.reduce((acc, val) => {
    if (val?.booking_date) {
      const bookingDate = moment(val.booking_date)
      const today = moment()
 
      acc.all.push(val)
 
      const isCancelled = val?.status?.toLowerCase().includes('cancel')
 
      if (bookingDate.isAfter(today)) {
        if (!isCancelled) {
          acc.upcoming.push(val)
        }
      } else {
        acc.past.push(val)
      }
    }
    return acc
  }, obj)
 
  return finalRes
}
 
 
    })
 
   
  })
})
 
export const {
  useGetAllPatientsQuery,
  useGetAppointmentOfPatientQuery,
  useGetPatientByIdQuery,
  useLazyGetAllPatientsOfDoctorQuery
} = patientApiSlice
 