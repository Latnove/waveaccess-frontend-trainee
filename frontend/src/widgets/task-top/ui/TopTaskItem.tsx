import type { FC } from 'react'
import { TaskCard, type Task } from '@/entities/task'
import { TaskDeleteAction } from '@/features/task-delete'
import { TaskEditAction } from '@/features/task-edit'
import styles from './TaskTopPanel.module.css'

interface ITopTaskItem {
	index: number
	task: Task
	onTaskDelete: (taskId: string) => void
	onTaskExists: (taskId: string) => boolean
	onTaskUpdate: (task: Task) => void
}

export const TopTaskItem: FC<ITopTaskItem> = ({
	index,
	onTaskDelete,
	onTaskExists,
	onTaskUpdate,
	task,
}) => (
	<li className={styles.item}>
		<span className={styles.rank}>{index + 1}</span>
		<TaskCard className={styles.taskCard} task={task}>
			<TaskEditAction
				isTaskExists={onTaskExists}
				task={task}
				onSave={onTaskUpdate}
			/>
			<TaskDeleteAction
				isTaskExists={onTaskExists}
				task={task}
				onDelete={onTaskDelete}
			/>
		</TaskCard>
	</li>
)
