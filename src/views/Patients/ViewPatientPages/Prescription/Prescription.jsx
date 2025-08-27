import React from 'react'
import { DataTable, TableColumn } from '../../../../components/Table/DataTable';
import { TableContainer } from '../../../../components/Table/TableContainer';

export const Prescription = () => {

    let data = [
        {
            name: "Private prescription Official",
            created_by: "John",
            last_completed: "a month ago",
            last_modified: "9 month ago"
        },
        {
            name: "Private prescription",
            created_by: "John",
            last_completed: "10 month ago",
            last_modified: "11 month ago"
        },

    ]

    return (
        <div>
            <TableContainer title={"Prescriptions"}>
                <DataTable data={data}>
                    <TableColumn title={"Name"} field="name" />
                    <TableColumn title={"Created By"} field="created_by" />
                    <TableColumn title={"Last Completed"} field="last_completed" />
                    <TableColumn title={"Last Modified"} field="last_modified" />
                </DataTable>
            </TableContainer>
        </div>
    )
};