
import style from "./layouts.module.css"
import { Logo } from '../Logo/Logo'

export const AuthLayout = ({ img, children, heading, subHeading, className, direction }) => {
    return (
        <div className={`${style.loginSignupLayout_container} ${className}`}>
            <div className={`flex ${direction === "rtl" ? "flex-row-reverse" : ""}`}
             style={{ backgroundColor: "#393939" }}>
                <div className='h-[100vh] p-[0] w-[45%] hidden lg:block'>
                    <div className={`h-[100%] ${style.bg_image}`} style={{ backgroundImage: `url(${img})` }}></div>
                </div>
                <div className='h-[100vh] p-[24px] flex-1 flex items-center justify-center '>
                    <div className='w-[100%]'>
                        <div className="flex justify-center">
                            <Logo />
                        </div>
                        <div className={`text-center ${style.auth_heading}`}>{heading}</div>
                        <div className={`text-center ${style.sub_heading}`}>{subHeading}</div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}