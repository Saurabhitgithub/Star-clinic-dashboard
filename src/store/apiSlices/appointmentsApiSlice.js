import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import { APIS } from '../../services/endpoints'

export const appointmentsApiSlice = createApi({
  reducerPath: 'appointmentApiSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllAppointmentsTag'],
  endpoints: builder => ({
    GetAllAppointments: builder.query({
      query: () => ({
        url: APIS.getAllAppointmentData,
        method: 'GET'
      }),
      providesTags: ['GetAllAppointmentsTag'],
      transformResponse: response => response?.data || []
    }),
    GetAllUpcomingAppointment: builder.query({
      query: () => ({
        url: APIS.getAllUpcomingAppointment,
        method: 'GET'
      }),
      transformResponse: response => response?.data || []
    }),
    GetAppointmentById: builder.query({
      query: id => ({
        url: APIS.getAppointmentById + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data?.[0] || {}
    })
  })
})

export const {
  useGetAllAppointmentsQuery,
  useLazyGetAppointmentByIdQuery,
  useGetAppointmentByIdQuery,
  useGetAllUpcomingAppointmentQuery
} = appointmentsApiSlice
