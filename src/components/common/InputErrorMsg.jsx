
import style from "./common.module.css"

export const InputErrorMsg = ({children}) => {
  return (
    <div className={style.inputErrorMsgCon}>{children}</div>
  )
}
