import "./style.css"

export function Input({ value, specialStyle, onChange, ...props }) {


  return <input className={`input ${specialStyle}`} onChange={onChange} value={value} autoComplete="off" {...props} />
}
