import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'

export const specilityApiSlice = createApi({
  reducerPath: 'specialitiesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllSpecilitiesTag'],

  endpoints: builder => ({
    // handle get all specilities
    GetAllSpecilitiesData: builder.query({
      query: ({ page, pageSize }) => ({
        url: APIS.getAllSpecialitiesData,
        method: 'POST',
        body: { isFetchAll: true, page, perPageData: pageSize }
      }),
      providesTags: ['GetAllSpecilitiesTag'],
      transformResponse: response => response || {}
    }),

    // handle add specilities by id
    AddSpecilitiesDataById: builder.mutation({
      query: body => ({
        url: APIS.addSpecialities,
        method: 'POST',
        body
      }),
      // refetch all specilities using invalidatesTags after add new specilities

      invalidatesTags: (result, error) => {
        if (!error) {
          return ['GetAllSpecilitiesTag']
        }
        return []
      },

      transformResponse: response => response?.data || [],
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Speciality Already Exist'
    }),
    // handle delete specilities by id
    DeleteSpecilieyById: builder.mutation({
      query: id => ({
        url: APIS.deleteSpecialities + id,
        method: 'DELETE'
      }),
      async onQueryStarted (id, { dispatch, queryFulfilled }) {
        let patchResult
        try {
          patchResult = dispatch(
            specilityApiSlice.util.updateQueryData(
              'GetAllSpecilitiesData',
              undefined,
              draft => {
                return draft.filter(speciality => speciality._id !== id)
              }
            )
          )
          await queryFulfilled
        } catch (error) {
          if (patchResult) patchResult.undo()
          return error
        }
      },
      // refetch all specilities using invalidatesTags after delete specility
      invalidatesTags: ['GetAllSpecilitiesTag'],
      transformResponse: response => response?.data || [],
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Speciality Already Exist'
    }),
    // handle get specilities data by id
    GetSpecilitiesDataById: builder.query({
      query: id => ({
        url: APIS.getSpecialitiesById + id,
        method: 'GET'
      }),

      transformResponse: res => res.data?.[0] ||{}
    }),

    // handle update specilities data by id
    UpdateSpecilitiesDataById: builder.mutation({
      query: ({ id, data }) => ({
        url: APIS.updateSpecialitiesById + id,
        method: 'PUT',
        body: data
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: ['GetAllSpecilitiesTag'],
      transformResponse: response => response?.data,
      transformErrorResponse: errRes => errRes
    }),
    UpdataSpecilitiesStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: APIS.updateSpecialityStatus + id,
        method: 'PUT',
        body: { status }
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: ['GetAllSpecilitiesTag'],
      transformResponse: response => response?.data,
      transformErrorResponse: errRes => errRes,
      // async onQueryStarted (data, { dispatch, queryFulfilled }) {
      //   let patchResult
      //   const { id, status } = data
      //   console.log(id)
      //   console.log(status)
      //   try {
      //     patchResult = dispatch(
      //       specilityApiSlice.util.updateQueryData(
      //         'GetAllSpecilitiesData',
      //         undefined,
      //         draft => {
      //           let d=[...draft]
      //           // let ff = d.find(e => e._id == id)
      //           // ff.status = status
      //           console.log(d)
      //           return []

      //           return draft
      //         }
      //       )
      //     )
      //     await queryFulfilled
      //   } catch (error) {
      //     if (patchResult) patchResult.undo()
      //     return error
      //   }
      // }
    })
  })
})

export const {
  useGetAllSpecilitiesDataQuery,
  useAddSpecilitiesDataByIdMutation,
  useDeleteSpecilieyByIdMutation,
  useUpdateSpecilitiesDataByIdMutation,
  useUpdataSpecilitiesStatusMutation,
  useGetSpecilitiesDataByIdQuery,
  useLazyGetSpecilitiesDataByIdQuery
} = specilityApiSlice
