import React, { useState } from 'react'
import { CommonPagesHeader } from '../../components/PagesHeaders/CommonPagesHeader'
import { TableContainer } from '../../components/Table/TableContainer'
import { DataTable, TableColumn } from '../../components/Table/DataTable'
import { DeleteIcon, ElectricIcon } from '../../components/Icons/SvgIcons'
import { IconLabelCard } from '../../components/Cards/IconLabelCard';
import style from "./purchasedSubscription.module.css"
import img from '../../assets/images/userImg.png'
import { Tabs } from '../../components/Tabs/Tabs'
import { PlanPurchasedUserCard } from '../../components/Cards/PlanPurchasedUserCard'
import { useGetAllPurchasedSubscriptionsQuery } from '../../store/apiSlices/purchasedSubscriptionApiSlice'
import { convertDateIntoSimpleDate } from '../../utils'

export const PurchasedSubscription = () => {

    const [activeTab, setActiveTab] = useState(0);


    const { data } = useGetAllPurchasedSubscriptionsQuery();

    console.log(data);


    return (
        <div className={style.purchasedSubscription_main_con}>
            <CommonPagesHeader
                heading={"Purchased Subscription"}
                subHeading={"Here are your active subscription plans"}
            />
            <div className="grid grid-cols-[350px_350px] mt-4  gap-4">
                <IconLabelCard
                    mediumCard
                    value={data?.patients?.length || 0}
                    heading={'Total Subscribed users'}
                    value2={"10% vs last month"}
                    icon={<div className={style.purchasedSubscription_card_icon}><ElectricIcon /></div>}
                />
                <IconLabelCard mediumCard value={data?.doctors?.length || 0} heading={'Total Subscribed doctors'}
                    value2={"100% vs last month"}
                    icon={<div className={style.purchasedSubscription_card_icon}><ElectricIcon /></div>}
                />
            </div>

            <Tabs
                className={"my-4"}
                onTabClick={setActiveTab}
                activeIndex={activeTab}
                tabData={[{ title: "Patient" }, { title: "Doctor" }]} />

            {activeTab === 0 &&
            <div className='family-500'>No Data Available..</div>
                // data?.doctors.map((res) => {
                //     return (
                //         <PlanPurchasedUserCard
                //             name={res?.user_details?.[0]?.name}
                //             img={img}
                //             date={convertDateIntoSimpleDate(res?.createdAt)}
                //             email={res?.user_details?.[0]?.email_address}
                //             plan={res?.subscription_details?.[0]?.subcription_name}
                //             expires={"13-10-2024"}
                //             onCancel={() => { }}



                //         />
                //     )
                // })
            }

            {activeTab === 1 && <TableContainer className={"mt-4"} title={"Purchased Subscription"}>
                <DataTable data={data?.doctors || []}>
                    <TableColumn title="Doctor Name" body={(rowData) => rowData?.user_details?.[0]?.name} />
                    <TableColumn title="Email" body={(res) => res?.user_details?.[0]?.email_address} />
                    <TableColumn title="Plan" body={(res) =>res?.subscription_details?.[0]?.subcription_name} />
                    <TableColumn title="Booking Price" field="paymentAmount" />
                    <TableColumn title="Expires" body={(rowData) => convertDateIntoSimpleDate(rowData?.createdAt)} />
                    <TableColumn title="Action" body={(rowData) => {
                        return (
                            <div className='flex items-center gap-3'>
                                <DeleteIcon />
                            </div>
                        )
                    }} />
                </DataTable>
            </TableContainer>}
            <br />
            <br />
        </div>
    )
}
