import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'

export const doctorApiSlice = createApi({
  reducerPath: 'doctorsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllDoctorsTag'],
  endpoints: builder => ({
    // handle get all doctors
    GetAllDoctors: builder.query({
      query: () => ({
        url: APIS.getAllDoctorsData,
        method: 'GET'
      }),
      providesTags: ['GetAllDoctorsTag'],
      transformResponse: response => response?.data || []
    }),
    // handle update  doctors by id
    UpdateDoctorById: builder.mutation({
      query: ({ id, body }) => ({
        url: APIS.updateDoctorById + id,
        method: 'PUT',
        body: body
      }),
      invalidatesTags: ['GetAllDoctorsTag'],
      transformResponse: response => response?.data || []
    }),
    // handle get  doctors by id
    GetDoctorById: builder.query({
      query: id => ({
        url: APIS.getDoctorDataById + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data?.[0] || {}
    }),
    GetAllRatingAndReviewsOfDoctor: builder.query({
      query: id => ({
        url: APIS.getAllRatingAndReviewsOfDoctor + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data || []
    }),
    GetAverageRatingDataOfDoctor: builder.query({
      query: id => ({
        url: APIS.getAverageRatingData + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data?.[0] || {}
    })
  })
})

export const {
  useGetAllDoctorsQuery,
  useUpdateDoctorByIdMutation,
  useGetDoctorByIdQuery,
  useGetAllRatingAndReviewsOfDoctorQuery,
  useGetAverageRatingDataOfDoctorQuery
} = doctorApiSlice
