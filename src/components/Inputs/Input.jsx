
import { Label } from './Label'
import style from './input.module.css'
import { SearchIcon } from '../Icons/SvgIcons'

export const Input = ({
  label,
  className,
  error,
  required,
  search,
  textarea,
  ...props
}) => {
  return (
    <div className={`${style.input_container} ${className}`}>
      {label && <Label required={required}>{label}</Label>}
      {textarea && <textarea {...props} className={`${style.textarea_design} ${error && 'error_input'}`} />}
      {!textarea && <input
        {...props}
        className={`${style.input} ${error && 'error_input'}`}
      />}
      {search && (
        <div className={style.input_search_icon}>
          <SearchIcon />
        </div>
      )}
    </div>
  )
}
