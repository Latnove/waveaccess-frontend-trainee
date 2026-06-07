import { Select, type SelectProps, Typography } from 'antd'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './SelectField.module.css'

interface SelectFieldProps<T extends FieldValues, TValue = unknown> extends SelectProps<TValue> {
  control: Control<T>
  name: Path<T>
  label?: string
}

export const SelectField = <T extends FieldValues, TValue = unknown>({
  control,
  name,
  label,
  className,
  onChange,
  ...props
}: SelectFieldProps<T, TValue>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <label className={className}>
        {label ? <span className={styles.label}>{label}</span> : null}
        <Select
          {...field}
          {...props}
          className={styles.select}
          classNames={{ popup: { root: styles.dropdown } }}
          status={error ? 'error' : undefined}
          onChange={(value, option) => {
            field.onChange(value)
            onChange?.(value, option)
          }}
        />
        {error ? <Typography.Text className={styles.error}>{error.message}</Typography.Text> : null}
      </label>
    )}
  />
)
