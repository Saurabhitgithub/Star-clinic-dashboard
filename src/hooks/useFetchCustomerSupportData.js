import { useCallback } from "react";
import { useLazyGetCustomerSupportByIdQuery } from "../store/apiSlices/customerSupportApiSlices";
import { convertDateIntoSimpleDate, toast } from "../utils";
import moment from "moment";
export const useFetchCustomerSupportData = (id, reset) => {
  const [getCustomerSupportById] = useLazyGetCustomerSupportByIdQuery();
 
  const getCustomerData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getCustomerSupportById(id);
      const data = res.data;
      reset({
        name: data?.name,
        email: data?.email,
        employee_id: data?.employee_id,
        biography: data?.biography,
        profile_image: data?.profile_image,
        phone_no: data?.phone_no,
        education:
          data?.education?.map(({ _id, _v, ...rest }) => ({
            ...rest,
            startDate: moment(rest.startDate).format("YYYY-MM-DD"),
            endDate: moment(rest.endDate).format("YYYY-MM-DD"),
          })) || [],
        workexperience:
          data?.workexperience?.map(({ _id, _v, ...rest }) => ({
            ...rest,
            startDate: moment(rest.startDate).format("YYYY-MM-DD"),
            endDate: moment(rest.endDate).format("YYYY-MM-DD"),
          })) || [],
      });
    } catch (error) {
      toast.error("Some Error occured while fetching data !");
    }
  }, [id, reset]);
 
  return { getCustomerData };
};