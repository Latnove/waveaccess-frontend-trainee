import { Typography } from 'antd'
import type { FC } from 'react'
import type { Task } from '@/entities/task'
import { pluralize } from '@/shared/lib/pluralize/pluralize'
import { Surface } from '@/shared/ui/Surface'
import { TOP_LIMIT_NUMBER } from '../model/constants'
import styles from './TaskTopPanel.module.css'
import { TopTaskList } from './TopTaskList'

interface ITaskTopPanel {
	weekTasks: Task[]
	monthTasks: Task[]
	onTaskDelete: (taskId: string) => void
	onTaskExists: (taskId: string) => boolean
	onTaskUpdate: (task: Task) => void
	topLimitNumber?: number
}

export const TaskTopPanel: FC<ITaskTopPanel> = ({
	monthTasks,
	onTaskDelete,
	onTaskExists,
	onTaskUpdate,
	weekTasks,
	topLimitNumber = TOP_LIMIT_NUMBER,
}) => (
	<Surface className={styles.panel}>
		<div className={styles.header}>
			<Typography.Title className={styles.title} level={2}>
				Топ {topLimitNumber}{' '}
				{pluralize(topLimitNumber, ['задача', 'задачи', 'задач'])}
			</Typography.Title>
			<Typography.Text className={styles.caption}>
				Сначала высокий приоритет, затем ближайшее время
			</Typography.Text>
		</div>

		<div className={styles.columns}>
			<TopTaskList
				emptyText='На текущую неделю активных задач нет'
				onTaskDelete={onTaskDelete}
				onTaskExists={onTaskExists}
				onTaskUpdate={onTaskUpdate}
				tasks={weekTasks}
				title='Текущая неделя'
				topLimitNumber={topLimitNumber}
			/>
			<TopTaskList
				emptyText='На текущий месяц активных задач нет'
				onTaskDelete={onTaskDelete}
				onTaskExists={onTaskExists}
				onTaskUpdate={onTaskUpdate}
				tasks={monthTasks}
				title='Текущий месяц'
				topLimitNumber={topLimitNumber}
			/>
		</div>
	</Surface>
)
