import { useCallback } from 'react'
import { useLazyGetSubscriptionPlanByIdQuery } from '../store/apiSlices/subscriptionsPlanApiSlice'
import { toast } from '../utils'

export const useFetchSubscriptionPlanDate = (id, reset) => {
  const [getSubscriptionData] = useLazyGetSubscriptionPlanByIdQuery()

  const fetchSubscriptionData = useCallback(async () => {
    if (!id) return
    try {
      const res = await getSubscriptionData(id).unwrap()
      const data = res

      reset({
        type: data?.type,
        subcription_name: data?.subcription_name,
        subcription_details: data?.subcription_details,
        subcription_days: data?.subcription_days,
        subcription_fees: data?.subcription_fees
      })
    } catch (error) {
      console.log(error)
      toast.error(error || 'Some Error error occured while fetching data !')
    }
  }, [id, reset])

  return { fetchSubscriptionData }
}
