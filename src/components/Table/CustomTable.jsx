import { Table, TableRow } from '@mui/material'
import React from 'react'

export const CustomTable = ({ children }) => {
  return <Table>
    {children}
    </Table>
}

export const CustomRow = ({ children }) => {
  ;<TableRow>{children}</TableRow>
}
