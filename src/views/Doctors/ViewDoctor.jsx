import { Fragment } from 'react'
import { DoctorProfileCard } from '../../components/Cards/DoctorProfileCard'
import img from "../../assets/images/newprofileimage.png";
import style from './doctors.module.css'
import { ListByDot } from '../../components/Lists/ListByDot'
import { Divider } from '@mui/material'
import { IconLabelCard } from '../../components/Cards/IconLabelCard'
import { StarIcon, SubscriptionIcon } from '../../components/Icons/SvgIcons'
import { BasicCard } from '../../components/Cards/BasicCard'
import { RatingAndComments } from '../../components/Cards/RatingAndComments'
import { useGetDoctorByIdQuery } from '../../store/apiSlices/doctorApiSlices'
import { useParams } from 'react-router'
import { InfoCard } from '../../components/Cards/InfoCard'
import { BreadCrum } from '../../components/common/BreadCrum'
import { UpcomingCounclingCard } from '../../components/Cards/UpcomingCounclingCard'
 
export const ViewDoctor = () => {
 
  const { id } = useParams();
  const { data: doctorData = {} } = useGetDoctorByIdQuery(id);
 
  const breadCrumData = [
    { title: "Doctor", path: "/doctors" },
    { title: "View Doctor", active: true },
  ];
 
  return (
    <div className={style.viewDoctor_main_con}>
 
      <BreadCrum backUrl={"/doctors"} data={breadCrumData} />
      <br />
 
      <div className='grid gap-4 lg:grid-cols-[300px_1fr]'>
        <div>
          <DoctorProfileCard
            img={doctorData?.profile_image?.fileUrl || img}
            Id={'UI-6735'}
            rating={doctorData?.averageRating }
            name={doctorData?.name}
            speciality={doctorData?.specialization?.[0]?.name}
            mobile={doctorData?.mobile}
            email={doctorData?.email_address}
            address='546 Lem Street, Cityvaly state 20389'
          />
          {/* <InfoCard className="mt-4" heading={"Today's Appointments"}></InfoCard> */}
 
 
          <UpcomingCounclingCard className="mt-4" heading="Today's Appointments"
                    data={doctorData?.todaysAppointmentsData || []}
                    doctorName={doctorData?.name}
                />
 
 
 
 
 
 
 
        </div>
        <div>
          <BasicCard>
            <div className={`grid xl:grid-cols-2 grid-cols-1 gap-5 `}>
              <IconLabelCard smallCard heading={doctorData?.totalAppointmentsCount} value={'Appointment'} icon={<SubscriptionIcon />} />
              <IconLabelCard smallCard heading={doctorData?.averageRating } value={'Ratings'} icon={<StarIcon width="30" backgroundColor="orange" height="30" />} />
              {/* <IconLabelCard smallCard heading={'4'} value={'Surgery'} icon={<SurgeryIcon />} /> */}
              {/* <IconLabelCard smallCard heading={'54'} value={'Critical Patients'} icon={<HospitalIcon />} /> */}
            </div>
          </BasicCard>
          <div className='grid md:grid-cols-2 mt-4 grid-cols-1 gap-3'>
 
            <div>
 
              <InfoCard heading={"About"}>
                <div className={style.viewDoctor_title1}>Description</div>
                <div className={style.basic_text}>{doctorData?.about_you} </div>
                <ListByDot className={'mt-5'} title={'Education'}
 
                  data={doctorData?.doctor_data?.education?.map((res) => {
                    return ({
                      title: res?.degree,
                      body: res?.institution
                    }
                    )
                  })} />
 
              </InfoCard>
            </div>
 
            {/* reviews section  */}
 
            <div>
              <InfoCard heading={"Patient's Reviews"}>
                {doctorData?.reviewData?.map((res, key) => {
                  return (
                    <Fragment key={key}>
                      <RatingAndComments
                        name={res?.user_name || "--"}
                        rating={res?.rating}
                        comment={res?.review}
                         img={res?.user_profile?.fileUrl || img}
                      />
                      <div className='my-2'>
                        <Divider />
                      </div>
                    </Fragment>
                  )
                })}
              </InfoCard>
            </div>
 
          </div>
        </div>
      </div>
 
 
    </div>
  )
}