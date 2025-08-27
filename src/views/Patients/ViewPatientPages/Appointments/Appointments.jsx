import React, { Fragment } from "react";
import { InfoCard } from "../../../../components/Cards/InfoCard";
import { useParams } from "react-router";
import { useGetAppointmentOfPatientQuery } from "../../../../store/apiSlices/patientApiSlice";
import { TreatmentAndStatus } from "../../../../components/common/TreatmentAndStatus";
import { Divider } from "@mui/material";
import { convertDateIntoDateAndTimeSeprate } from "../../../../utils";
import { UpcomingCounclingCard } from "../../../../components/Cards/UpcomingCounclingCard";
 
export const Appointments = () => {
  const { id } = useParams();
  const { data: appointmentData } = useGetAppointmentOfPatientQuery(id);
  return (
    <div className="grid grid-cols-2 gap-3">
      <InfoCard heading="Appointments History">
        <br />
        <div className="max-h-[400px] overflow-auto pr-[10px]">
          {appointmentData?.past
            ?.filter((res) => res?.status?.toLowerCase() !== "pending")
            ?.map((res, ind) => {
              console.log("Filtered Appointment Status:", res?.status);
              return (
                <Fragment key={ind}>
                  <TreatmentAndStatus
                    data={res}
                    title={res?.symptoms || "--"}
                    status={res?.status}
                    date={res?.booking_date?.replace("T", " ").slice(0, 16)}
                  />
                  <Divider sx={{ my: 2 }} />
                </Fragment>
              );
            })}
        </div>
      </InfoCard>
 
      <UpcomingCounclingCard
        heading="Upcoming Appointments"
        data={appointmentData?.upcoming || []}
      />
    </div>
  );
};