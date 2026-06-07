import {
	TaskOverviewPanel,
	usePeriodTaskOverview,
} from '@/features/task-overview'
import { DateTimePicker } from '@/shared/ui/DateTimePicker'
import { Surface } from '@/shared/ui/Surface'
import { CalendarOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { formatPeriod } from '../lib/formatPeriod'
import { usePeriodRangeStore } from '../model/usePeriodRangeStore'
import styles from './PeriodTaskOverview.module.css'

export const PeriodTaskOverview = () => {
	const { range, setRange } = usePeriodRangeStore()
	const { deleteTask, hasSelectedPeriod, isTaskExists, list, updateTask } =
		usePeriodTaskOverview({ range })

	return (
		<div className={styles.root}>
			<Surface className={styles.hero}>
				<div className={styles.heroCopy}>
					<Typography.Text className={styles.eyebrow}>Период</Typography.Text>
					<Typography.Title className={styles.title} level={1}>
						Задачи за период
					</Typography.Title>
					<Typography.Paragraph className={styles.text}>
						{formatPeriod(range.from, range.to)}
					</Typography.Paragraph>
				</div>

				<div className={styles.picker}>
					<Typography.Text className={styles.pickerLabel}>
						<CalendarOutlined />
						Выбор периода
					</Typography.Text>
					<DateTimePicker
						disablePast={false}
						mode='range'
						placeholder='Выберите период'
						rangeValue={range}
						withTime={false}
						onRangeChange={setRange}
					/>
				</div>
			</Surface>

			{hasSelectedPeriod ? (
				<TaskOverviewPanel
					counter={`${list.tasks.length} из ${list.filteredCount}`}
					emptyDescription='В выбранном периоде задач нет'
					filters={list.filters}
					hasMore={list.hasMore}
					sortMode={list.sortMode}
					tasks={list.tasks}
					title='Задачи периода'
					onLoadMore={list.loadMore}
					onPriorityFilterChange={list.setPriorityFilter}
					onSortModeChange={list.setSortMode}
					onStatusFilterChange={list.setStatusFilter}
					onTaskDelete={deleteTask}
					onTaskExists={isTaskExists}
					onTaskUpdate={updateTask}
				/>
			) : (
				<Surface className={styles.emptyState}>
					<Typography.Title className={styles.emptyTitle} level={2}>
						Выберите период
					</Typography.Title>
					<Typography.Paragraph className={styles.emptyText}>
						После выбора начальной и конечной даты здесь появится список задач.
					</Typography.Paragraph>
				</Surface>
			)}
		</div>
	)
}
