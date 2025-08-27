import React, { useState, useEffect } from "react";
import { BreadCrum } from "../../components/common/BreadCrum";
import { DoctorAppointmentProfileCard } from "../../components/Cards/DoctorAppointmentProfileCard";
import img from "../../assets/images/userImg.png";
import { IconLabelCard } from "../../components/Cards/IconLabelCard";
import {
  CalenderIcon,
  StarIcon,
  SurgeryIcon,
} from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { useLazyGetAllPatientsOfDoctorQuery } from "../../store/apiSlices/patientApiSlice";
import { StatusTag } from "../../components/common/StatusTag";
import { useGetAppointmentByIdQuery } from "../../store/apiSlices/appointmentsApiSlice";
import { Link, useParams } from "react-router";
import moment from "moment";
import { InfoCard } from "../../components/Cards/InfoCard";
import { ImageLabelValue } from "../../components/common/ImageLabelValue";
import { Button } from "../../components/Buttons/Button";
import { useGetDoctorByIdQuery } from "../../store/apiSlices/doctorApiSlices";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
export const ViewAppointment = () => {
  //document section
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const { id } = useParams();
  const [data, setData] = useState([]);
 
  const filteredDocument = data.filter(
    (doc) =>
      doc?.fileName && doc.fileName.toLowerCase().includes(search.toLowerCase())
  );
 
  const { data: appointmentData } = useGetAppointmentByIdQuery(id);
  const [getPatientData, { data: pData }] =
    useLazyGetAllPatientsOfDoctorQuery();
 
  const doctorId = appointmentData?.doctor_id;
 
  const { data: doctorApiRes = {} } = useGetDoctorByIdQuery(doctorId, {
    skip: !doctorId,
  });
 
  const doctor = doctorApiRes;
  const averageRating = doctor?.averageRating
    ? doctor.averageRating.toFixed(2)
    : "0.0";
  console.log(".......................", doctor);
  useEffect(() => {
    if (appointmentData?._id) {
      getPatientData(appointmentData?._id);
    }
  }, [getPatientData, appointmentData?._id]);
 
  const breadCrumData = [{ title: "Doctor Appointment" }];
  console.log(appointmentData);
 
  return (
    <div>
      <BreadCrum backUrl={"/appointments"} data={breadCrumData} />
      <br />
      <div className="grid xl:grid-cols-[450px_1fr] gap-4">
        <DoctorAppointmentProfileCard
          name={appointmentData?.doctor_details?.[0]?.name}
          img={
            appointmentData?.doctor_details?.[0]?.profile_image?.fileUrl || img
          }
          date={moment(appointmentData?.booking_date).format("DD-MM-YYYY")}
          time={moment(appointmentData?.booking_date).format("hh:mma")}
          speciality={appointmentData?.specialties?.[0]?.name}
          description={
            "Infectious Diseases Hub aims to provide up-to-date, essential research and on aspects of microbiology, virology, and parasitology."
          }
        />
 
        <div className="grid md:grid-cols-2  gap-5">
          <IconLabelCard
            smallCard
            colDirection
            value={"Appointment"}
            heading={doctor.totalAppointmentsCount}
            icon={<CalenderIcon width="30" height="30" />}
          />
          <IconLabelCard
            smallCard
            colDirection
            value={"Ratings"}
            heading={averageRating}
            icon={
              <StarIcon height="30" width="30" backgroundColor={"orange"} />
            }
          />
        </div>
      </div>
 
      <div className="grid lg:grid-cols-2 grid-cols-1 mt-[50px] gap-5">
        <TableContainer
          pagination={false}
          currentPage={1}
          onPageChange={() => {}}
          pageSize={10}
          totalCount={100 || 0}
          title={"Patients Lists"}
        >
          <DataTable data={pData?.userData || []}>
            <TableColumn
              title="Patient Name"
              field={"name"}
              body={(rowData) => {
                return (
                  <div className="flex items-center gap-3">
                    <img
                      src={rowData?.profile_image?.fileUrl || img}
                      className="w-[20px] h-[20px] rounded-full"
                    />
                    <span>{rowData?.name}</span>
                  </div>
                );
              }}
            ></TableColumn>
            <TableColumn title="Gender" field={"gender"}></TableColumn>
            <TableColumn title="Age" field={"age"}></TableColumn>
            <TableColumn
              title="Status"
              body={() => <StatusTag status={"Active"} />}
            ></TableColumn>
          </DataTable>
        </TableContainer>
 
        <div>
          <InfoCard heading="Patients Details">
            <div className="flex justify-between border-b-2 p-3">
              <ImageLabelValue
                img={
                  appointmentData?.patient_details?.[0]?.profile_image?.fileUrl
                }
                label={appointmentData?.patient_details?.[0]?.name || ""}
                value={`${
                  appointmentData?.patient_details?.[0]?.age || ""
                } Years`}
              />
              <div className="border" />
              <ImageLabelValue
                label={"Email"}
                value={
                  appointmentData?.patient_details?.[0]?.email_address || ""
                }
              />
              <div className="border" />
              <ImageLabelValue
                label={"Phone"}
                value={appointmentData?.patient_details?.[0]?.mobile || ""}
              />
            </div>
            <div className="family-700 mt-3">Details</div>
            <br />
            <TableContainer
              pagination
              title={"Document"}
              currentPage={page}
              onPageChange={setPage}
              pageSize={pageSize}
              totalCount={
                Array.isArray(data) ? data.length : data?.totalCount || 0
              }
            >
              {/* <DataTable data={filteredDocument || []}> */}
              <DataTable data={pData?.documentData || []}>
                <TableColumn
                  title="Image"
                  body={(rowData) =>
                    rowData.fileData?.fileUrl ? (
                      <a
                        href={rowData.fileData.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={rowData.fileData.fileUrl}
                          alt="Document Img"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    ) : (
                      "No Image"
                    )
                  }
                />
 
                <TableColumn title="File Name" field="fileName" />
 
                <TableColumn
                  title="Last modified"
                  body={(rowData) =>
                    moment(rowData.createdAt).format("DD-MM-YYYY")
                  }
                />
              </DataTable>
            </TableContainer>
            <br />
            <TableContainer
              pagination
              title="Allergy Information"
              currentPage={page}
              onPageChange={setPage}
              pageSize={pageSize}
              totalCount={data.length}
            >
              <DataTable data={pData?.allergiesData || []}>
                <TableColumn title="Allergy Name" field="type" />
                <TableColumn title="Severity" field="severity" />
                <TableColumn title="Reaction" field="reaction" />
 
                {/* Ensure createdAt is formatted correctly */}
                <TableColumn
                  title="Last modified"
                  body={(rowData) =>
                    moment(rowData.createdAt).format("DD-MM-YYYY")
                  }
                />
              </DataTable>
            </TableContainer>
          </InfoCard>
        </div>
      </div>
      <br />
      <div className="flex justify-end">
        <Link to={"/appointments"}>
          <Button bordered>Cancel</Button>
        </Link>
      </div>
      <br />
    </div>
  );
};
 