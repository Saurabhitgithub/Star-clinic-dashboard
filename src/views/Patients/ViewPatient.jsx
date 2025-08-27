import React, { Fragment } from 'react';
import { PatientProfileCard } from '../../components/Cards/PatientProfileCard';
import img from '../../assets/images/userProfileImg.png';
import style from "./patient.module.css";
import { InfoCard } from '../../components/Cards/InfoCard';
import { TreatmentAndStatus } from '../../components/common/TreatmentAndStatus';
import { Divider } from '@mui/material';
import { UpcomingCounclingCard } from '../../components/Cards/UpcomingCounclingCard';
import { Link, useParams } from 'react-router';
import { useGetAppointmentOfPatientQuery, useGetPatientByIdQuery } from '../../store/apiSlices/patientApiSlice';
import { Button } from '../../components/Buttons/Button';
import { BreadCrum } from '../../components/common/BreadCrum';
import { convertDateIntoDateAndTimeSeprate } from '../../utils';

export const ViewPatient = () => {
    const { id } = useParams();

    const { data } = useGetPatientByIdQuery(id);
    const { data: appointmentData } = useGetAppointmentOfPatientQuery(id)

    const breadCrumData = [
        { title: "Patients", path: "/patients" },
        { title: "View Patient", active: true }
    ]

 
    return (
        <div className={style.viewpatient_main_con}>

            <BreadCrum backUrl={"/patients"} data={breadCrumData} />
            <br />
            <div className="grid lg:grid-cols-2 gap-5">

                <div>

                    <PatientProfileCard
                        age={data?.age}
                        img={data?.profile_image?.fileUrl || img}
                        gender={data?.gender}
                        name={data?.name}
                        email={data?.email_address}
                        mobile={data?.mobile}
                    />
                    <br />
                    <InfoCard heading="Appointments History">
                        <br />
                        <div className='max-h-[400px] overflow-auto pr-[10px]'>
                            {appointmentData?.past?.map((res, ind) => {
                                return (
                                    <Fragment key={ind}>
                                        <TreatmentAndStatus data={res} title={res?.symptoms || "--"} status={res?.status} date={convertDateIntoDateAndTimeSeprate(res?.booking_date)} />
                                        <Divider sx={{ my: 2 }} />
                                    </Fragment>
                                )
                            })}
                        </div>
                    </InfoCard>
                </div>

                <UpcomingCounclingCard heading="Upcoming Appointments"
                    data={appointmentData?.upcoming || []}
                />

            </div>

            <br />
            <div className="flex justify-end">
                <Link to={"/patients"}>
                    <Button bordered>Cancel</Button>
                </Link>
            </div>
            <br />
            <br />
        </div>
    )
}
