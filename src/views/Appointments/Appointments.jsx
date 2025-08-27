import React, { Fragment } from 'react'
import { CommonPagesHeader } from '../../components/PagesHeaders/CommonPagesHeader'
import moment from 'moment'
import { useNavigate } from 'react-router'
import { DoctorCard } from '../../components/Cards/DoctorCard'
import img from '../../assets/images/userImg.png'
import { useGetAllAppointmentsQuery } from '../../store/apiSlices/appointmentsApiSlice'
 
export const Appointments = () => {
 
    const { data } = useGetAllAppointmentsQuery();
    const navigate = useNavigate();
 
    return (
        <div>
            <CommonPagesHeader
                heading={"Doctor Appointments"}
                subHeading={"All Bookings"}
            />
            <br />
            {data?.map((res, ind) => {
                const doctorData = res?.doctor_details?.[0]
                return (
                    <div key={ind} className="mb-4">
                        <DoctorCard
                            onClick={() => { }}
                            isSmallCard={false}
                            onPrimaryBtnClick={() => { navigate(`view/${res._id}`) }}
                            onSecondaryBtnClick={() => { navigate(`/doctors/view/${doctorData?._id}`) }}
                            actionButtons={true}
                            img={doctorData?.profile_image?.fileUrl || img}
                            name={doctorData?.name}
                            primaryBtnText={"View Appointments"}
                            secondaryBtnText={"View Doctor Details"}
                            specility={res?.specialties?.[0]?.name}
                            date={moment(res?.booking_date).format("DD-MM-YYYY")}
                            time={moment(res?.booking_date?.replace('T', ' ').slice(0, 16)).format('hh:mma')}
                            description={"---"}
                        />
                    </div>
                )
            })}
 
 
        </div>
    )
}