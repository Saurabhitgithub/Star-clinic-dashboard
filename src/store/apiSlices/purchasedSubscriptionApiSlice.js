import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import { APIS } from '../../services/endpoints'

export const purchasedSubscriptionApiSlice = createApi({
  reducerPath: 'purchasedSubscriptionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllPurchasedSubscriptionsTag'],
  endpoints: builder => ({
    // handle get all purchased subscriptions
    GetAllPurchasedSubscriptions: builder.query({
      query: () => ({
        url: APIS.getAllSubcriberData,
        method: 'GET'
      }),
      providesTags: ['GetAllPurchasedSubscriptionsTag'],
      transformResponse: response => {
        let res = response.data?.reduce(
          (acc, val) => {
            if (val?.paymentFor === 'doctorsubscriber') {
              acc.doctors.push(val)
            }
            if (val?.paymentFor === 'patientsubscriber') {
              acc.patients.push(val)
            }
            return acc
          },
          {
            doctors: [],
            patients: []
          }
        )

        return res || []
      }
    })
  })
})

export const { useGetAllPurchasedSubscriptionsQuery } =
  purchasedSubscriptionApiSlice
