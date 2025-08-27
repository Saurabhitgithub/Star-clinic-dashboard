import { baseQueryWithReauth } from './handleTokenAndRefreshToken'
import { APIS } from '../../services/endpoints'
import { createApi } from '@reduxjs/toolkit/query/react'

export const customerSupportApiSlice = createApi({
  
  reducerPath: 'customerSupportApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllCustomerSupportsTag'],
  endpoints: builder => ({
    GetAllCustomerSupport: builder.query({
      query: () => ({
        url: APIS.getAllCustomerSupportData,
        method: 'GET'
      }),
      providesTags: ['GetAllCustomerSupportsTag'],
      transformResponse: response => response?.data || []
    }),
    AddCustomerSupport: builder.mutation({
      query: body => ({
        url: APIS.addCustomerSupportData,
        method: 'POST',
        body
      }),
      invalidatesTags: ['GetAllCustomerSupportsTag']
    }),
    GetCustomerSupportById: builder.query({
      query: id => ({
        url: APIS.getCustomerSupportById + id,
        method: 'GET'
      }),
      transformResponse: response => response?.data?.[0] || {}
    }),
    UpdateCustomerSupportById: builder.mutation({
      query: ({ id, body }) => ({
        url: APIS.updateCustomerSupportById + id,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['GetAllCustomerSupportsTag']
    }),
    UpdateCustomerSupportStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: APIS.updateCustomerSupportStatus + id,
        method: 'PUT',
        body
      }),
      async onQueryStarted (id, { dispatch, queryFulfilled }) {
        let patchResult
        try {
          patchResult = dispatch(
            customerSupportApiSlice.util.updateQueryData(
              'GetAllCustomerSupport',
              undefined,
              draft => {
                const dd = [...draft]
                const ind = dd.findIndex(e => e._id == id.id)
                draft[ind].status = id.body.status
              }
            )
          )
          await queryFulfilled
        } catch (error) {
          if (patchResult) patchResult.undo()
          return error
        }
      }
    }),
    DeleteCustomerSupportById: builder.mutation({
      query: id => ({
        url: APIS.deleteCustomerSupportById + id,
        method: 'DELETE'
      }),
      async onQueryStarted (id, { dispatch, queryFulfilled }) {
        let patchResult
        try {
          patchResult = dispatch(
            customerSupportApiSlice.util.updateQueryData(
              'GetAllCustomerSupport',
              undefined,
              draft => {
                const dd = [...draft]
                const ind = dd.findIndex(e => e._id === id)
                draft.splice(ind, 1)
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
  useGetAllCustomerSupportQuery,
  useAddCustomerSupportMutation,
  useGetCustomerSupportByIdQuery,
  useLazyGetCustomerSupportByIdQuery,
  useUpdateCustomerSupportByIdMutation,
  useUpdateCustomerSupportStatusMutation,
  useDeleteCustomerSupportByIdMutation
} = customerSupportApiSlice
