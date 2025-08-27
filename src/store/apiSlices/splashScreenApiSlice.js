import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'

export const splashScreenApiSlice = createApi({
  reducerPath: 'splashScreenApiSlice',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllSplashScreenTag'],

  endpoints: builder => ({
    // handle get all specilities
    GetAllSplashScreenData: builder.query({
      query: () => ({
        url: APIS.getAllSplash,
        method: 'GET',
      }),
      providesTags: ['GetAllSplashScreenTag'],
      transformResponse: response => response || {}
    }),

    // handle add specilities by id
    AddSplashScreenDataById: builder.mutation({
      query: body => ({
        url: APIS.addSplash,
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
        errRes?.data?.errormessage || 'Splash Already Exist'
    }),
    // handle delete specilities by id
    DeleteSplashScreenById: builder.mutation({
      query: (id) => ({
        url: APIS.deleteSplashScreen + id,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        let patchResult;
        try {
          patchResult = dispatch(
            splashScreenApiSlice.util.updateQueryData(
              "GetAllSplashScreenData",
              undefined,
              (draft) => {
                if (draft?.data) {
                  draft.data = draft.data.filter(
                    (splashscreen) => splashscreen._id !== id
                  );
                }
              }
            )
          );
          await queryFulfilled;
        } catch (error) {
          if (patchResult) patchResult.undo();
          return error;
        }
      },
      // Ensure correct tag invalidation for refetching
      invalidatesTags: ["GetAllSplashScreenTag"],
      transformResponse: (response) => response?.data || [],
      transformErrorResponse: (errRes) =>
        errRes?.data?.errormessage || "Splash Screen Already Exists",
    }),
    
    // handle get specilities data by id
    GetSplashScreenDataById: builder.query({
      query: id => ({
        url: APIS.getSplashScreenById + id,
        method: 'GET'
      }),

      transformResponse: res => res.data
    }),

    // handle update specilities data by id
    UpdateSplashScreenDataById: builder.mutation({
      query: ({ id, data }) => ({
        url: APIS.updateSplash + id,
        method: 'PUT',
        body: data
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: ['GetAllSplashScreenTag'],
      transformResponse: response => response?.data,
      transformErrorResponse: errRes => errRes
    }),
    UpdataSplashScreenStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: APIS.updateSplashScreen + id,
        method: 'PUT',
        body: { status }
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: ['GetAllSplashScreenTag'],
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
  useGetAllSplashScreenDataQuery,
  useLazyGetSplashScreenDataByIdQuery,
  useAddSplashScreenDataByIdMutation,
  useDeleteSplashScreenByIdMutation,
  useUpdateSplashScreenDataByIdMutation,
  useUpdataSplashScreenStatusMutation
} = splashScreenApiSlice
