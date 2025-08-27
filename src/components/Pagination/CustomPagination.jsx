import React, { useState } from "react";
import style from "./pagination.module.css"
import { DOTS, usePagination } from "../../hooks/usePagination";

export function CustomPagination(props) {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];


    return (

        <div className={`${style.pagination_main_con}`}>
            <ul
                className={` ${style.pagination_container}`}
            >
                <button
                    className={style.navigation_btn}
                    disabled={currentPage === 1}
                    onClick={onPrevious}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8334 7.00002H1.16675M1.16675 7.00002L7.00008 12.8334M1.16675 7.00002L7.00008 1.16669" stroke="#344054" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Previous

                </button>
                <div className="flex">

                    {paginationRange.map((pageNumber, ind) => {
                        if (pageNumber === DOTS) {
                            return <li key={`${ind}pagination`} className={`dots ${style.pagination_item}`}>&#8230;</li>;
                        }

                        return (
                            <li
                                key={`${ind}pagination`}
                                className={` 
                                ${style.pagination_item}
                                ${pageNumber === currentPage && style.selected_pagination_item}
                                `}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </li>
                        );
                    })}
                </div>

                <button
                    className={style.navigation_btn}
                    disabled={currentPage === lastPage}
                    onClick={onNext}
                >
                    Next
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.16675 7.00002H12.8334M12.8334 7.00002L7.00008 1.16669M12.8334 7.00002L7.00008 12.8334" stroke="#344054" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </button>
            </ul>

        </div>
    );
};

