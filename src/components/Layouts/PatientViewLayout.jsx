import React, { useEffect, useState } from 'react'
import { UserProfile } from '../../views/Patients/UserProfile'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router'
import style from "./layouts.module.css"
import { Collapse, Divider } from '@mui/material'
import { IoIosArrowBack } from "react-icons/io";
import { ArrowDownIcon, ArrowUpIcon } from '../Icons/SvgIcons'
import { BiMessage } from 'react-icons/bi'
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiAlertTriangle } from "react-icons/fi";
import { useGetAppointmentOfPatientQuery, useGetPatientByIdQuery } from '../../store/apiSlices/patientApiSlice'

export const PatientViewLayout = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data } = useGetPatientByIdQuery(id);
    const { data: appointmentData } = useGetAppointmentOfPatientQuery(id)
   

    const tabs = [
        // { label: "Treatment Notes", path: "treatmentNotes", value: 3 },
        // { label: "Forms", path: "forms", value: 43 },
        { label: "Photos", path: "photos", value: 2 },
        { label: "Allergies", path: "allergies", value: 7 },
        // { label: "Prescriptions", path: "prescriptions", value: 23 },
        { label: "Documents", path: "documents", value: 53 },
        { label: "Patch Tests", path: "patchTests", value: 31 },
        // { label: "Education", path: "education", value: 1 },
        { label: "Lab Tests", path: "labTests", value: 56 },
        { label: "Client Problems", path: "clientProblems", value: 66 },
         { label: "Financials", path: "financialDetails", value: 66 },
          { label: "Medical Condition", path: "medicalConditionManagement", value: 66 },
    ]

    return (
        <div className={style.patientViewLayout_con}>

            <div className={`${style.patientView_header} flex justify-between`}>
                <div className="flex items-center gap-2">
                    <IoIosArrowBack className='pointer' onClick={() => navigate("/patients")} />
                    <div className={style.patient_view_name}>{data?.name}</div>
                </div>
                <div className='flex items-center gap-2 text-xl'>
                    <BiMessage />
                    <HiOutlineDocumentReport />
                    <FiAlertTriangle />
                </div>
            </div>

            <div className="grid grid-cols-[350px_300px_1fr] gap-3 p-4 bg-gray-100">
                <UserProfile userData={data|| {}}/>
                <div>

                <div className='bg-white p-4 rounded-md'>
                    <div><NavLink to={`/patientDetails/${id}/appointments`}
                        style={({ isActive }) => ({
                            fontWeight: isActive ? "bold" : "normal",
                            color: isActive ? "var(--primary-color)" : "",
                        })}
                        className={style.patientView_navlink}>Appointments <span>4</span></NavLink></div>
                    <TabNavbarItems title={"Chart"} navItems={tabs} />
                    <div className="flex flex-col gap-3">
                        {/* <div><NavLink className={style.patientView_navlink}>Financials <span>30</span></NavLink></div> */}
                        {/* <div><NavLink className={style.patientView_navlink}
                        to={`/patientDetails/${id}/package`}
                        >Packages <span>2</span></NavLink></div> */}
                        {/* <div><NavLink className={style.patientView_navlink}>Communications <span>40</span></NavLink></div> */}
                        {/* <div><NavLink className={style.patientView_navlink}>Gift Vouchers <span>20</span></NavLink></div> */}
                        {/* <div><NavLink className={style.patientView_navlink}>Activities <span>20</span></NavLink></div> */}
                    </div>
                </div>
                </div>

                <div className='overflow-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}


function TabNavbarItems({ title, navItems }) {
    const [collapse, setCollapse] = useState(true)
    const { id } = useParams()
    let location = useLocation()

    useEffect(() => {

        if (!!navItems?.length) {
            if (navItems.some(e => location.pathname.includes(e.path))) {
                setCollapse(true)
            }
        }

    }, [navItems])


    return (
        <>
            <div onClick={() => setCollapse(!collapse)} className={`${style.patientView_navlink} flex mt-2 pointer justify-between`}>
                <div>{title}</div>
                <div>{collapse ? <ArrowDownIcon /> : <ArrowUpIcon />}</div>
            </div>
            <div className="my-1">
                <Divider />
            </div>
            <Collapse in={collapse}>
                <div className="flex flex-col gap-3">
                    {navItems?.map((res) => {
                        return (
                            <div key={res.path} className='pl-5'> <NavLink
                                style={({ isActive }) => ({
                                    fontWeight: isActive ? "bold" : "normal",
                                    color: isActive ? "var(--primary-color)" : "",
                                })}
                                to={`/patientDetails/${id}/${res.path}`}
                                className={`${style.patientView_navlink} pointer`}> {res?.label}<span>{res?.value}</span></NavLink>  </div>
                        )
                    })}

                </div>
                <br />
            </Collapse>

        </>
    )
}