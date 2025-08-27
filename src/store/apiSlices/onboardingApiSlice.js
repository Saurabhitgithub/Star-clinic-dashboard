import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'


export const onboardingApiSlice = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllOnboardingTag'],
  

  endpoints: builder => ({
    // handle get all specilities
    GetAllOnboardingData: builder.query({
      query: ({ page, pageSize }) => ({
        url: APIS.getAllOnboarding,
        method: 'GET',
      }),
      providesTags: ['GetAllOnboardingTag'],
      transformResponse: response => response || {}
    }),

    // handle add specilities by id
    AddOnboardingDataById: builder.mutation({
      query: body => ({
        url: APIS.addOnboardingScreen,
        method: 'POST',
        body
      }),
      // refetch all specilities using invalidatesTags after add new specilities

      invalidatesTags: (result, error) => {
        if (!error) {
          return ['GetAllOnboardingTag']
        }
        return []
      },

      transformResponse: response => response?.data || [],
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Onboarding Already Exist'
    }),
    // handle delete specilities by id
    DeleteOnboardingById: builder.mutation({
      query: (id) => ({
        url: `${APIS.deleteOnboardingScreen}${id}`, // Ensure correct API format
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        let patchResult;
        try {
          patchResult = dispatch(
            onboardingApiSlice.util.updateQueryData(
              "GetAllOnboardingData",
              undefined,
              (draft) => {
                return draft?.data?.filter(
                  (onboarding) => onboarding._id !== id
                );
              }
            )
          );
          await queryFulfilled;
        } catch (error) {
          if (patchResult) patchResult.undo();
        }
      },
      invalidatesTags: ["GetAllOnboardingTag"], // ✅ Ensures fresh data after delete
    }),
    // handle get specilities data by id
    GetOnboardingDataById: builder.query({
      query: (id) => ({
        url: `${APIS.getOnboardingById}${id}`, 
        method: "GET",
      }),
      transformResponse: (res) => res?.data || {},
      transformErrorResponse: (errRes) =>
        errRes?.data?.errormessage || "Onboarding Not Found",
    }),

    // handle update specilities data by id
    UpdateOnboardingDataById: builder.mutation({
      query: ({ id, data }) => ({
        url: `${APIS.updateOnboardingById}${id}`, 
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["GetAllOnboardingTag"],
      transformResponse: (response) => response?.data,
    }),

  })
})

export const {
  useGetAllOnboardingDataQuery,
  useAddOnboardingDataByIdMutation,
  useDeleteOnboardingByIdMutation,
  useUpdateOnboardingDataByIdMutation,
  useGetOnboardingDataByIdQuery,
  useLazyGetOnboardingDataByIdQuery
} = onboardingApiSlice
