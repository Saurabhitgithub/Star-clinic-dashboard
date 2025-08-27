import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'

export const themeApiSlice = createApi({
  reducerPath: 'themeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetThemeData'],

  endpoints: builder => ({
    // handle get all products
    GetThemeData: builder.query({
      query: () => ({
        url: APIS.getThemeData,
        method: 'get'
      }),
      providesTags: ['GetThemeData'],
      transformResponse: response => response?.data?.[0] || []
    }),

    // handle update product data by id
    UpdateThemeDataById: builder.mutation({
      query: ({ id, data }) => ({
        url: APIS.updateTheme + id,
        method: 'PUT',
        body: data
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: ['GetThemeData'],
      transformResponse: response => response?.data,
      transformErrorResponse: errRes => errRes
    })
  })
})

export const { useGetThemeDataQuery, useUpdateThemeDataByIdMutation } =
  themeApiSlice
