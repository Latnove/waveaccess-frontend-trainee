import { Button as AntdButton, type ButtonProps } from 'antd'
import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './Button.module.css'

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <AntdButton ref={ref} className={clsx(styles.button, className)} {...props} />
  ),
)

Button.displayName = 'Button'
