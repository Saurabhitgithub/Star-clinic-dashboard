import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

export const DataTable = ({ data, onRowClick, children }) => {

    function fetchHeadersOfTable() {
        let headers = [];
        if (!!children?.length) {
            for (let d of children) {
                headers.push(d.props.title)
            }
        }
        else {
            headers = [children.props.title]
        }
        return headers.flat()
    };

    return (
        <Table stickyHeader={true}>
            <TableHead>
                <TableRow>
                    {fetchHeadersOfTable()?.map((res, ind) => {
                        return (
                            <TableCell key={ind}>{res}</TableCell>
                        )
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((rowData, rowIndex) => (
                    <TableRow key={rowIndex} onClick={() => onRowClick && onRowClick(rowData)}>
                        {[children].flat(Infinity).map((column, colIndex) => {
                            const { body, field, ...rest } = column.props; // Destructure props and exclude `body`
                            return (
                                <TableCell key={colIndex} {...rest}>
                                    {body ? body(rowData) : rowData[field]}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export const TableColumn = ({ ...props }) => {
    return (<div {...props} />)
}