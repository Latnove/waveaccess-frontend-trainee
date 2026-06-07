import { Input, Typography } from 'antd'
import type { TextAreaProps } from 'antd/es/input/TextArea'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './TextAreaField.module.css'

interface TextAreaFieldProps<T extends FieldValues> extends TextAreaProps {
  control: Control<T>
  name: Path<T>
  label?: string
}

export const TextAreaField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: TextAreaFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <label className={className}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <Input.TextArea
          {...field}
          {...props}
          className={styles.textarea}
          status={error ? 'error' : undefined}
        />
        {error ? <Typography.Text className={styles.error}>{error.message}</Typography.Text> : null}
      </label>
    )}
  />
)
