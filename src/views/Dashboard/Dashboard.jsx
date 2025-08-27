import { UpcomingAppointmentsDoctorCard } from "../../components/Cards/UpcomingAppointmentsCard"
import { useGetAllUpcomingAppointmentQuery } from "../../store/apiSlices/appointmentsApiSlice"
import { useGetAllDashboardDataQuery } from "../../store/apiSlices/dashboardApiSlice"
import { useGetAllPatientsQuery } from "../../store/apiSlices/patientApiSlice"
import { DataTable, TableColumn } from "../../components/Table/DataTable"
import { TableContainer } from "../../components/Table/TableContainer"
import { StatusTag } from "../../components/common/StatusTag"
import { BarChart } from "../../components/Charts/BarChart"
import { InfoCard } from "../../components/Cards/InfoCard"
import { convertDateIntoSimpleDate } from "../../utils"
import img from "../../assets/images/userProfileImg.png"
import { Fragment } from "react"
import moment from "moment"

export const Dashboard = () => {

  const { data } = useGetAllPatientsQuery();

  const { data: upcomingAppointmentData } = useGetAllUpcomingAppointmentQuery();
  const { data: dashboardData } = useGetAllDashboardDataQuery();

  return (
    <div>

      <InfoCard heading={"Doctor Appointment"}>
        <BarChart labels={dashboardData?.map(e => e?.month) || []} data={dashboardData?.map(e => e?.count) || []} />
      </InfoCard>
      <br />
      <TableContainer title={'Patients Lists'}>
        <DataTable data={data || []}>
          <TableColumn title="Patient Name" field={"name"}
            body={(rowData) => {
              return (
                <div className='flex items-center gap-3'>
                  <img src={rowData?.profile_image?.fileUrl || img} className='w-[20px] h-[20px] rounded-full' />
                  <span>{rowData?.name}</span>
                </div>
              )
            }}
          ></TableColumn>
          <TableColumn title="Patient ID" field={"patient_id"}  body={(rowData) => rowData?.patient_id ?? "N/A"}></TableColumn>
          <TableColumn title="Mobile" field={"mobile"}></TableColumn>
            <TableColumn title="Email" field={"email_address"}></TableColumn>
          {/* <TableColumn title="Status" body={() => <StatusTag status={"Active"} />}></TableColumn> */}
        </DataTable>
      </TableContainer>

      <div className="family-600 my-4">Upcoming Appointment</div>

          <div className="flex gap-4 flex-wrap">
 
        {upcomingAppointmentData?.map((res, ind) => {
          return (
            <Fragment key={ind}>
              <UpcomingAppointmentsDoctorCard
                patientName={res?.patient_details?.[0]?.name}
                name={res?.doctor_details?.[0]?.name}
                img={res?.doctor_details?.profile_image?.fileUrl || img}
                speciality={res?.specialties?.[0]?.name}
                date={moment.utc(res?.booking_date).format("DD-MM-YYYY")}
                time={moment.utc(res?.booking_date).format("h:mm A")}
              />
            </Fragment>
          )
        })
        }
 
      </div>
      <br />
      <br />

    </div>
  )
}
