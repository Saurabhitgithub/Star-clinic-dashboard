import React from 'react'
import { DoctorProfileCard } from '../../components/Cards/DoctorProfileCard'
import img from "../../assets/images/testt.png"
import style from "./customerSupport.module.css"
import { ListByDot } from '../../components/Lists/ListByDot'
import { useDeleteCustomerSupportByIdMutation, useGetCustomerSupportByIdQuery } from '../../store/apiSlices/customerSupportApiSlices'
import { useNavigate, useParams } from 'react-router'
import { TableContainer } from '../../components/Table/TableContainer'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { patientQueryData } from '../../utils/dummyData'
import { BreadCrum } from '../../components/common/BreadCrum'
import { Button } from '../../components/Buttons/Button'
import { ConfirmationDialog } from '../../components/Dialogs/ConfirmationDialog'
import { toast } from '../../utils'
 
export const ViewCustomerSupport = () => {
    const navigate = useNavigate()
    const { id } = useParams();
const { data, isLoading, isError } = useGetCustomerSupportByIdQuery(id, {
  refetchOnMountOrArgChange: true
});
    const [deleteCustomerSupport] = useDeleteCustomerSupportByIdMutation()
 
 
    const breadCrumData = [
        { title: "Customer Support", active: false, path: "/customerSupportManagement" },
        { title: "View", active: true },
    ]
 
    async function deleteCustomerAndSupport() {
        try {
            deleteCustomerSupport(id)
            toast.success("Customer Support Deleted successfully")
            navigate("/customerSupportManagement")
 
        } catch (error) {
            console.log(error)
        }
    }
 
if(isError && !isLoading){
    return <div className='family-500'>No Data available ..</div>
}
 
    return (
        <div className={style.viewCustomerSupport_main_con}>
            <div className="flex justify-between items-center">
                <BreadCrum backUrl={"/customerSupportManagement"} data={breadCrumData} />
                <div className='flex items-center gap-4'>
                    <Button bordered>Give Permission</Button>
                    <ConfirmationDialog
                        primaryBtnText={"Delete"}
                        onConfirm={(e) => deleteCustomerAndSupport()}
                        secondaryBtnText={"Cancel"}
                        title="Delete ?"
                        body={"Are you sure you want to delete ?"}
                    >
                        <Button primary>Delete</Button>
                    </ConfirmationDialog>
                </div>
            </div>
            <br />
            <div className="grid grid-cols-[300px_1fr] gap-4">
 
                <DoctorProfileCard
                    img={img}
                    Id={"UI-sdfjhdf"}
                    rating={3}
                    name={data?.name}
                    speciality={"Mdss"}
                    email={data?.email}
                    mobile={data?.phone_no}
                />
 
                <div>
                    <div className={style.listByDot_title1}>Biography</div>
                    <div className={style.viewCustomer_biography_text}>{data?.biography}</div>
                    <div className='grid grid-cols-2 mt-4'>
                        <ListByDot title={"Education"}
                            data={data?.education?.map(e => ({ title: e?.degree, body: e?.institution })) || []}
                        />
                        <ListByDot title={"Work & Experience"}
                            data={data?.workexperience?.map(e => ({ title: e?.company, body: e?.about })) || []}
                        />
                    </div>
                </div>
            </div>
            <br />
 
            <TableContainer title={"Resolved Query"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patients Name</TableCell>
                            <TableCell>Patient ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Query</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patientQueryData?.map((res, ind) => {
                            return (
                                <TableRow key={ind}>
                                    <TableCell>{res.name}</TableCell>
                                    <TableCell>{res?.ID}</TableCell>
                                    <TableCell>{res.date}</TableCell>
                                    <TableCell>{res.query}</TableCell>
                                    <TableCell>{res?.status}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
 
                </Table>
            </TableContainer>
 
            <br />
            <br />
 
        </div>
    )
}