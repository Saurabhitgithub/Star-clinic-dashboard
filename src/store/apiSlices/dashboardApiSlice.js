import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import { APIS } from '../../services/endpoints'
import { getFullMonthNameByNumber } from '../../utils'

export const dashboardApiSlice = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllDashboardDataTag'],
  endpoints: builder => ({
    // handle get all dashboard data
    getAllDashboardData: builder.query({
      query: () => ({
        url: APIS.getDashboardAnalyticalData,
        method: 'GET'
      }),
      providesTags: ['GetAllDashboardDataTag'],
      transformResponse: response => {
        let data = response?.data

        let dd =
          data?.map(e => ({
            ...e,
            month: getFullMonthNameByNumber(e.month)
          })) || []

        return dd || []
      }
    })
  })
})

export const { useGetAllDashboardDataQuery } = dashboardApiSlice
