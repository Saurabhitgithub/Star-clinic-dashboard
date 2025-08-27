import React from 'react';
import { PageHeading } from '../common/PageHeading';
import { Input } from '../Inputs/Input';
import { FilterButton } from '../Buttons/FilterButton';
import { Button } from '../Buttons/Button';

export const CommonPagesHeader = ({ onSearch, searchValue, heading, subHeading, addButtonProps }) => {

    
    return (
        <section>
            <div className='flex items-center'>
                <div>
                    <PageHeading heading={heading} subHeading={subHeading} />
                </div>

                <div className='flex text-nowrap gap-[10px] flex-1 items-center'>
                    <div className='w-[100%] flex justify-end items-center'>
                        {onSearch&&<Input placeholder='Search' onChange={onSearch} value={searchValue} className={''} />}

                    </div>
                    {addButtonProps?.show && <Button onClick={()=>addButtonProps?.onClick && addButtonProps.onClick()} addIcon primary>{addButtonProps?.title}</Button>}
                </div>
            </div>
        </section>
    )
}
