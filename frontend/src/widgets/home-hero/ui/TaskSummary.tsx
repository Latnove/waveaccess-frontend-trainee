import { Surface } from '@/shared/ui/Surface'
import { Statistic } from 'antd'
import type { FC } from 'react'
import styles from './HomeHero.module.css'

interface ITaskSummary {
	activeTasksCount: number
	highPriorityCount: number
	totalTasksCount: number
}

export const TaskSummary: FC<ITaskSummary> = ({
	activeTasksCount,
	highPriorityCount,
	totalTasksCount,
}) => (
	<Surface className={styles.metrics}>
		<Statistic title='Активных задач:' value={activeTasksCount} />
		<Statistic title='Высокий приоритет:' value={highPriorityCount} />
		<Statistic title='Всего задач:' value={totalTasksCount} />
	</Surface>
)
