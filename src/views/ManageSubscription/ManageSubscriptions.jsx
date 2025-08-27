import React, { useState } from 'react'
import { CommonPagesHeader } from '../../components/PagesHeaders/CommonPagesHeader'
import { TableContainer } from '../../components/Table/TableContainer'
import { DataTable, TableColumn } from '../../components/Table/DataTable'
import { Link, Outlet, useNavigate } from 'react-router'
import { useDeleteSubscriptionPlanMutation, useGetAllSubscriptionPlanDataQuery } from '../../store/apiSlices/subscriptionsPlanApiSlice'
import { convertDateIntoSimpleDate, searchDataWithMultipleKeys } from '../../utils'
import { EditIcon } from '../../components/Icons/SvgIcons'
import { DeleteButton } from '../../components/Buttons/DeleteButton'
import { HtmlIntoJsx } from '../../components/common/HtmlIntoJsx'

export const ManageSubscriptions = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const { data } = useGetAllSubscriptionPlanDataQuery();
    const filteredSubscriptionPlans = searchDataWithMultipleKeys(["subcription_name"], data || [], search);
    const [deleteSubscription] = useDeleteSubscriptionPlanMutation();
    return (
        <div>
            <Outlet />
            <CommonPagesHeader
                onSearch={(e) => setSearch(e.target.value)}
                searchValue={search}
                heading={"Manage Subscriptions Plans"}
                subHeading={"All Subscription"}
                addButtonProps={{ show: true, title: "Add New", onClick: () => navigate("add") }}
            />

            <TableContainer className={"mt-4"} title={"Subscription Management"}>
                <DataTable data={filteredSubscriptionPlans}>
                    <TableColumn className={"text-nowrap"} title="Subscription Name" field="subcription_name" />
                    <TableColumn title="Details" body={(rowData) => <HtmlIntoJsx html={rowData?.subcription_details} />} />
                    <TableColumn className={"text-nowrap"} title="Date" body={(rowData) => convertDateIntoSimpleDate(rowData?.createdAt)} />
                    <TableColumn className={"text-nowrap"} title="Time Period" body={({ subcription_days }) => subcription_days + " Days"} />
                    <TableColumn  title="Price" field="subcription_fees" />

                    <TableColumn title="Action" body={(rowData) => {
                        return (
                            <div className='flex gap-3'>
                                <Link to={`update/${rowData?._id}`}>
                                    <EditIcon />
                                </Link>
                                <DeleteButton className="pointer" onDelete={deleteSubscription} data={rowData?._id} confirmation />
                            </div>
                        )
                    }} />

                </DataTable>
            </TableContainer>
        </div>
    )
}
