import React, { useState } from "react";

import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { Outlet, useNavigate } from "react-router";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { useDeleteProductByIdMutation, useGetAllProductDataQuery } from "../../store/apiSlices/productApiSlices";

export const Products = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState("");

    // fetch all product data with pagination
    const { data, isLoading, error } = useGetAllProductDataQuery({
        page: page,
        pageSize: pageSize,
    });
    console.log(data)

    const [deleteProduct] = useDeleteProductByIdMutation();

    const navigate = useNavigate();

    async function deleteSpec(id) {
        try {
            loader.start();
            let res = await deleteProduct(id);
            toast.success(res?.data);
        } catch (error) {
            console.log(error);
        } finally {
            loader.stop();
        }
    }

    const filteredSpecialities = data?.data?.filter((speciality) =>
        speciality.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <CommonPagesHeader
                heading={"Products"}
                subHeading={"Manage Products"}
                addButtonProps={{ title: "Add", show: true, onClick: () => navigate("create", { replace: true }) }}
                searchValue={search}
                onSearch={(e) => setSearch(e.target.value)}
            />
            <br />
            <TableContainer
                pagination
                title={"Products"}
                currentPage={page}
                onPageChange={setPage}
                pageSize={pageSize}
                totalCount={data?.totalCount || 0}
            >
                <DataTable data={filteredSpecialities || []}>
                    <TableColumn
                        title="Icon"
                        body={(rowData) =>
                            rowData?.fileData?.[0] && rowData.fileData?.[0].fileUrl ? (
                                <img
                                    src={rowData.fileData?.[0].fileUrl}
                                    alt="Product Icon"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "10%",
                                    }}
                                />
                            ) : (
                                "No Image"
                            )
                        }
                    />
                    <TableColumn title="Name" field={"name"}></TableColumn>
                    <TableColumn title="Quantity" field={"quantity"}></TableColumn>
                    <TableColumn title="Product Type" className="capitalize" field={"product_type"}></TableColumn>
                    <TableColumn
                        title="Action"
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <EditIcon
                                    className="pointer"
                                    onClick={() => {
                                        navigate(`update/${rowData._id}`);
                                    }}
                                />
                                <DeleteButton
                                    className="pointer"
                                    data={rowData._id}
                                    confirmation
                                    onDelete={deleteSpec}
                                />
                            </div>
                        )}
                    ></TableColumn>
                </DataTable>
            </TableContainer>
          
        </div>
    );
};
