import { createApi } from '@reduxjs/toolkit/query/react'
import { APIS } from '../../services/endpoints'
import { baseQueryWithReauth } from './handleTokenAndRefreshToken'

export const productApiSlice = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['GetAllProductsTag',"GetProductDataById"],

  endpoints: builder => ({
    // handle get all products
    GetAllProductData: builder.query({
      query: ({ page, pageSize }) => ({
        url: APIS.getAllProduct,
        method: 'get',
        // body: { page, perPageData: pageSize }
      }),
      providesTags: ['GetAllProductsTag'],
      transformResponse: response => response || {}
    }),

    // handle add product by id
    AddProductData: builder.mutation({
      query: body => ({
        url: APIS.createProduct,
        method: 'POST',
        body
      }),
      // refetch all specilities using invalidatesTags after add new specilities

      invalidatesTags: (result, error) => {
        if (!error) {
          return ['GetAllProductsTag']
        }
        return []
      },

      transformResponse: response => response?.data || [],
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Product Already Exist'
    }),

    // handle delete product by id
    DeleteProductById: builder.mutation({
      query: id => ({
        url: APIS.deleteProduct + id,
        method: 'DELETE'
      }),
      async onQueryStarted (id, { dispatch, queryFulfilled }) {
        let patchResult
        try {
          patchResult = dispatch(
            productApiSlice.util.updateQueryData(
              'GetAllProductData',
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
      invalidatesTags: ['GetAllProductsTag'],
      transformResponse: response => response?.data || [],
      transformErrorResponse: errRes =>
        errRes?.data?.errormessage || 'Product Already Exist'
    }),

    // handle get product data by id
    GetProductDataById: builder.query({
      query: id => ({
        url: APIS.getProductById + id,
        method: 'GET'
      }),
     
      transformResponse: res => res.data ||{},
      providesTags:(result,error,id)=>{
        return([{type:"GetProductDataById",id}])
      }
    }),

    // handle update product data by id
    UpdateProductDataById: builder.mutation({
      query: ({ id, data }) => ({
        url: APIS.updateProduct + id,
        method: 'PUT',
        body: data
      }),
      // refetch all specilities using invalidatesTags after update any specility
      invalidatesTags: (result, error, { id }) => [
        { type: 'GetAllProductsTag' },
        { type: 'GetProductDataById', id }
      ],
      transformResponse: response => response?.data,
      transformErrorResponse: errRes => errRes
    }),
  })
})

export const {
useGetAllProductDataQuery,
useDeleteProductByIdMutation,
useUpdateProductDataByIdMutation,
useAddProductDataMutation,
useGetProductDataByIdQuery
} = productApiSlice
