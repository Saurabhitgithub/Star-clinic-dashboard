import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import { toast } from '../../utils'

export const subscriptionPlanApiSlice = createApi({
  reducerPath: 'subscriptionPlanApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllsubscriptionPlanTag'],

  endpoints: builder => ({
    // handle get all subscroption
    GetAllSubscriptionPlanData: builder.query({
      query: () => ({
        url: APIS.getAllSubscriptionPlans,
        method: 'POST',
        body: { type: 'doctor' }
      }),
      providesTags: ['GetAllsubscriptionPlanTag'],
      transformResponse: response => response?.data || []
    }),
    // handle add subscription plan by id
    AddSubscriptionPlan: builder.mutation({
      query: body => ({
        url: APIS.addSubscriptionPlan,
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error) => {
        if (!error) {
          return ['GetAllsubscriptionPlanTag']
        }
        return []
      },
      transformResponse: response => {
        return response || []
      },
      transformErrorResponse: errRes => {
        return errRes?.data?.errormessage || 'Subscroption Plan Already Exist'
      }
    }),
    // handle getsubscription data by id
    getSubscriptionPlanById: builder.query({
      query: id => ({
        url: APIS.getSubscriptionPlanById + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data || {},
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Some Error Occured'
    }),
    // handle update subscription data
    UpdateSubscriptionPlanById: builder.mutation({
      query: ({ id, body }) => ({
        url: APIS.updateSubscriptionData + id,
        method: 'PUT',
        body: body
      }),
      transformResponse: response => {
        console.log(response)
        return response
      },
      transformErrorResponse: errRes => {
        console.log(errRes?.data?.errormessage)
        return errRes?.data?.errormessage || 'Some Error Occured'
      },
      async onQueryStarted ({ id, body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionPlanApiSlice.util.updateQueryData(
            'GetAllSubscriptionPlanData',
            undefined,
            draft => {
              const item = draft.find(item => item._id === id)
              if (item) {
                Object.assign(item, body)
              }
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo() // Rollback changes if any error occured
        }
      }
    }),
    // handle delete subscription plan
    DeleteSubscriptionPlan: builder.mutation({
      query: id => ({
        url: APIS.deleteSubscriptionPlan + id,
        method: 'DELETE'
      }),
      transformResponse: response =>
        toast.success(response?.data || 'Subscription  deleted successfully') ||
        {},
      transformErrorResponse: errRes => {
        console.log(errRes)
        return errRes?.data?.errormessage || 'Some Error Occured'
      },
      // remove deleted subscription plan data  from all subscription data cache
      async onQueryStarted (id, { dispatch, queryFulfilled }) {
        let patchResult
        try {
          console.log(id)
          patchResult = dispatch(
            subscriptionPlanApiSlice.util.updateQueryData(
              'GetAllSubscriptionPlanData',
              undefined,
              draft => {
                return draft.filter(plan => plan._id !== id)
              }
            )
          )
          await queryFulfilled
        } catch (error) {
          if (patchResult) patchResult.undo()
          return error
        }
      }
    })
  })
})

export const {
  useGetAllSubscriptionPlanDataQuery,
  useAddSubscriptionPlanMutation,
  useLazyGetSubscriptionPlanByIdQuery,
  useUpdateSubscriptionPlanByIdMutation,
  useDeleteSubscriptionPlanMutation
} = subscriptionPlanApiSlice
