import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APIS, BASE_URL } from '../../services/endpoints'
import { INVALID_TOKEN_MESSAGES } from '../../utils/constants'
import { loader, toast } from '../../utils'

// set headers to all apis which are call threw rtk
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  loader.start()
  let result = await baseQuery(args, api, extraOptions)
  loader.stop()
  if (INVALID_TOKEN_MESSAGES.includes(result?.error?.data?.message)) {
    toast.error('Refreshing Token')
    // If the token is expired then fetch new token with refresh token
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      // refetch token using refresh token
      const refreshResult = await baseQuery(
        {
          url: APIS.refreshToken,
          method: 'POST',
          body: { refreshToken }
        },
        api,
        extraOptions
      )
      if (refreshResult?.data?.data) {
        localStorage.setItem('token', refreshResult?.data?.data)
        loader.start()
        // Re-run Last unsuccessfull api after refresh token
        result = await baseQuery(args, api, extraOptions)
        loader.stop()
      } else {
        window.location.pathname = '/'
        localStorage.clear()
      }
    }
  }

  return result
}
