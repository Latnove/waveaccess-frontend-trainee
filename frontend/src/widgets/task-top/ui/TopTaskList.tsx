import { Typography } from 'antd'
import type { FC } from 'react'
import type { Task } from '@/entities/task'
import { TOP_LIMIT_NUMBER } from '../model/constants'
import styles from './TaskTopPanel.module.css'
import { TopTaskItem } from './TopTaskItem'

interface ITopTaskList {
	title: string
	emptyText: string
	tasks: Task[]
	onTaskDelete: (taskId: string) => void
	onTaskExists: (taskId: string) => boolean
	onTaskUpdate: (task: Task) => void
	topLimitNumber?: number
}

export const TopTaskList: FC<ITopTaskList> = ({
	emptyText,
	onTaskDelete,
	onTaskExists,
	onTaskUpdate,
	tasks,
	title,
	topLimitNumber = TOP_LIMIT_NUMBER,
}) => (
	<section className={styles.section}>
		<div className={styles.sectionHeader}>
			<Typography.Title className={styles.sectionTitle} level={3}>
				{title}
			</Typography.Title>
			<Typography.Text className={styles.count}>
				{tasks.length} из {topLimitNumber}
			</Typography.Text>
		</div>

		{tasks.length ? (
			<ol className={styles.list}>
				{tasks.map((task, index) => (
					<TopTaskItem
						index={index}
						key={task.id}
						task={task}
						onTaskDelete={onTaskDelete}
						onTaskExists={onTaskExists}
						onTaskUpdate={onTaskUpdate}
					/>
				))}
			</ol>
		) : (
			<Typography.Paragraph className={styles.empty}>
				{emptyText}
			</Typography.Paragraph>
		)}
	</section>
)
