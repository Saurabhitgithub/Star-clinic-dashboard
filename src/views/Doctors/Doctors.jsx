import React, { useState } from 'react'
import { DoctorsHeader } from '../../components/PagesHeaders/DoctorsHeader'
import { DoctorCard } from '../../components/Cards/DoctorCard'
import img from '../../assets/images/userProfileImg.png'
import { useGetAllDoctorsQuery, useUpdateDoctorByIdMutation } from '../../store/apiSlices/doctorApiSlices'
import { DOCTOR_STATUS } from '../../utils/constants'
import { Link, useNavigate } from 'react-router'
import { searchDataWithMultipleKeys, toast } from '../../utils'
import { TableContainer } from '../../components/Table/TableContainer'
import { DataTable, TableColumn } from '../../components/Table/DataTable'
import { EyeIcon } from '../../components/Icons/SvgIcons'
import { StatusTag } from '../../components/common/StatusTag'
import { GridAndListButton } from '../../components/Buttons/GridAndListButton'

export const Doctors = () => {
  const navigate = useNavigate();
  const [dataTableView, setDataTableView] = useState("column")
  // fetch all doctor data 
  const { data } = useGetAllDoctorsQuery()
  const [updateDoctor] = useUpdateDoctorByIdMutation()
  const [search, setSearch] = useState("");
  const filteredDoctors = searchDataWithMultipleKeys(["name"], data || [], search)

  // Update doctor status
  async function changeDoctorStatus(id, status) {
    try {
      const res = await updateDoctor({ id, body: { doctor_status: status } })
      toast.success("Doctor Status updated successfully !")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr_80px] gap-4 items-center">
        <DoctorsHeader
          onSearch={(e) => setSearch(e.target.value)}
          searchValue={search}
        />
        <GridAndListButton onClick={setDataTableView} value={dataTableView} />
      </div>
      <br />
      {dataTableView === "grid" ?
        <div className='grid 2500px:grid-cols-6 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5'>
          {filteredDoctors?.map((res, key) => {
            return (
              <div key={key}>
                <DoctorCard
                  onClick={() => navigate(`view/${res._id}`)}
                  isSmallCard={true}
                  onPrimaryBtnClick={() => changeDoctorStatus(res._id, DOCTOR_STATUS.approved)}
                  onSecondaryBtnClick={() => changeDoctorStatus(res._id, DOCTOR_STATUS.rejected)}
                  actionButtons={res?.doctor_data?.doctor_status !== DOCTOR_STATUS.approved}
                  img={res?.profile_image?.fileUrl || img}
                  name={res?.name}
                  status={res?.doctor_data?.doctor_status}
                  specility={res.specialization?.[0]?.name}
                  doctor_id={res.doctor_id}
                />
              </div>
            )
          })}
        </div>
        :
        <TableContainer title="Doctor">
          <DataTable data={filteredDoctors || []}>
            <TableColumn title="Doctor Name" field={"name"}></TableColumn>
            <TableColumn title="Doctor ID" field={'doctor_id'}  body={(rowData) => rowData?.doctor_id ?? "N/A"}></TableColumn>
            <TableColumn title="Speciality" body={(rowData) => rowData?.specialization?.[0]?.name}></TableColumn>
            {/* <TableColumn title="Status" body={(res) => <StatusTag status={res?.doctor_data?.doctor_status} />}></TableColumn> */}
            <TableColumn title="Action" body={(rowData) => (
              <div className="flex gap-2">
                <Link to={`view/${rowData._id}`}>
                  <EyeIcon />
                </Link>
              </div>
            )}></TableColumn>
          </DataTable>
        </TableContainer>
      }
      <br />
    </div>
  )
}
