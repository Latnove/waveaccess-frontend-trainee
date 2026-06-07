import { ClockCircleOutlined } from '@ant-design/icons'
import { Space, Tag, Typography } from 'antd'
import clsx from 'clsx'
import { formatTaskDate } from '@/shared/lib/date/formatDateTime'
import { taskPriorityLabels, taskStatusLabels } from '../model/constants'
import type { Task, TaskPriority, TaskStatus } from '../model/types'
import styles from './TaskCard.module.css'
import type { FC, ReactNode } from 'react'

interface ITaskCard {
	task: Task
	className?: string
	children?: ReactNode
}

const priorityClass: Record<TaskPriority, string> = {
	low: styles.priorityLow,
	medium: styles.priorityMedium,
	high: styles.priorityHigh,
}

const statusClass: Record<TaskStatus, string> = {
	todo: styles.statusTodo,
	in_progress: styles.statusProgress,
	done: styles.statusDone,
}

export const TaskCard: FC<ITaskCard> = ({ children, className, task }) => (
	<article
		className={clsx(
			styles.card,
			task.status === 'done' && styles.cardDone,
			className,
		)}
	>
		<div className={styles.content}>
			<Typography.Title className={styles.title} level={3}>
				{task.title}
			</Typography.Title>
			{task.description ? (
				<Typography.Paragraph className={styles.description}>
					{task.description}
				</Typography.Paragraph>
			) : null}
			<Space wrap size={[8, 8]}>
				<Tag className={clsx(styles.tag, priorityClass[task.priority])}>
					{taskPriorityLabels[task.priority]}
				</Tag>
				<Tag className={clsx(styles.tag, statusClass[task.status])}>
					{taskStatusLabels[task.status]}
				</Tag>
			</Space>
			<time className={styles.time} dateTime={task.startAt}>
				<ClockCircleOutlined />
				{formatTaskDate(task.startAt)}
			</time>
		</div>
		{children ? <div className={styles.actions}>{children}</div> : null}
	</article>
)
