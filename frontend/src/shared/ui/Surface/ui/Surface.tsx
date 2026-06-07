import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import styles from './Surface.module.css'

export const Surface = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.surface, className)} {...props} />
)
