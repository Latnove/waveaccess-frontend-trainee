import {
	TaskOverviewPanel,
	TaskOverviewStats,
	useTodayTaskOverview,
} from '@/features/task-overview'
import { Surface } from '@/shared/ui/Surface'
import { TOP_LIMIT_NUMBER, TaskTopPanel } from '@/widgets/task-top'
import { Typography } from 'antd'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { FC } from 'react'
import styles from './DaySchedulePage.module.css'

export const DaySchedulePage: FC = () => {
	const { deleteTask, isTaskExists, list, stats, today, topTasks, updateTask } =
		useTodayTaskOverview()
	const todayLabel = format(today, 'd MMMM yyyy', { locale: ru })

	return (
		<main className={styles.page}>
			<Surface className={styles.panel}>
				<div className={styles.hero}>
					<div className={styles.copy}>
						<Typography.Text className={styles.eyebrow}>
							Сегодня
						</Typography.Text>
						<Typography.Title className={styles.title} level={1}>
							Расписание на день
						</Typography.Title>
						<Typography.Paragraph className={styles.text}>
							{todayLabel}
						</Typography.Paragraph>
					</div>

					<TaskOverviewStats stats={stats} />
				</div>
			</Surface>

			<TaskTopPanel
				monthTasks={topTasks.month}
				weekTasks={topTasks.week}
				onTaskDelete={deleteTask}
				onTaskExists={isTaskExists}
				onTaskUpdate={updateTask}
				topLimitNumber={TOP_LIMIT_NUMBER}
			/>

			<TaskOverviewPanel
				counter={`${list.filteredCount} из ${list.sourceCount}`}
				emptyDescription={
					list.sourceCount
						? 'Под выбранные фильтры задач нет'
						: 'На сегодня задач нет'
				}
				filters={list.filters}
				sortMode={list.sortMode}
				tasks={list.tasks}
				title='Задачи сегодня'
				onPriorityFilterChange={list.setPriorityFilter}
				onSortModeChange={list.setSortMode}
				onStatusFilterChange={list.setStatusFilter}
				onTaskDelete={deleteTask}
				onTaskExists={isTaskExists}
				onTaskUpdate={updateTask}
			/>
		</main>
	)
}
