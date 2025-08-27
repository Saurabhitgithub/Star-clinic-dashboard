import { Box, Paper } from '@mui/material'
import React from 'react'
import style from './tableContainer.module.css'
import { CustomPagination } from '../Pagination/CustomPagination'

export const TableContainer = ({
  children,
  pagination,
  title,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  height,
  className,
  ...props
}) => {
  return (
    <Paper className={`${style.tableContainer_con} ${className} primary_table_container`}>
      {title && <div className={style.tableContainer_title_con}>{title}</div>}
      <div style={{height:`calc(100vh - ${height})`,overflow:"auto"}}>
        {children}
      </div>

      {pagination && (
        <Box className={style.pagination_con}>
          <CustomPagination
            onPageChange={onPageChange}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </Box>
      )}
    </Paper>
  )
}
