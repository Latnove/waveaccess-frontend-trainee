import { Typography } from 'antd'
import type { FC } from 'react'
import type { ITaskDayStats } from '../model/types'
import styles from './TaskOverviewStats.module.css'

interface ITaskOverviewStats {
	stats: ITaskDayStats
}

const getStats = (stats: ITaskDayStats) => [
	{ label: 'Запланировано', value: stats.planned },
	{ label: 'Выполняется', value: stats.inProgress },
	{ label: 'Выполнено', value: stats.done },
	{ label: 'Высокий приоритет', value: stats.highPriority },
]

const getTaskTotalLabel = (total: number) => {
	const mod10 = total % 10
	const mod100 = total % 100

	if (mod10 === 1 && mod100 !== 11) return 'задача сегодня'
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
		return 'задачи сегодня'
	}

	return 'задач сегодня'
}

export const TaskOverviewStats: FC<ITaskOverviewStats> = ({ stats }) => {
	const items = getStats(stats)

	return (
		<div className={styles.stats}>
			<div className={styles.primary}>
				<Typography.Text className={styles.primaryValue}>
					{stats.total}
				</Typography.Text>
				<Typography.Text className={styles.primaryLabel}>
					{getTaskTotalLabel(stats.total)}
				</Typography.Text>
			</div>

			<div className={styles.details}>
				{items.map(item => (
					<div className={styles.item} key={item.label}>
						<Typography.Text className={styles.value}>{item.value}</Typography.Text>
						<Typography.Text className={styles.label}>{item.label}</Typography.Text>
					</div>
				))}
			</div>
		</div>
	)
}
