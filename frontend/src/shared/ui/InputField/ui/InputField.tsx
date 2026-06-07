import { Input, type InputProps, Typography } from 'antd'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './InputField.module.css'

interface InputFieldProps<T extends FieldValues> extends InputProps {
  control: Control<T>
  name: Path<T>
  label?: string
}

export const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: InputFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <label className={className}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <Input {...field} {...props} className={styles.input} status={error ? 'error' : undefined} />
        {error ? <Typography.Text className={styles.error}>{error.message}</Typography.Text> : null}
      </label>
    )}
  />
)
