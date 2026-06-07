import {
	TaskCard,
	taskPriorityLabels,
	taskStatusLabels,
	type Task,
	type TaskPriority,
	type TaskStatus,
} from '@/entities/task'
import { TaskDeleteAction } from '@/features/task-delete'
import { TaskEditAction } from '@/features/task-edit'
import { Surface } from '@/shared/ui/Surface'
import { Empty, Segmented, Spin, Typography } from 'antd'
import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import type {
	ITaskFilters,
	TaskPriorityFilter,
	TaskSortMode,
	TaskStatusFilter,
} from '../model/types'
import styles from './TaskOverviewPanel.module.css'

interface ITaskOverviewPanel {
	title: string
	counter: string
	tasks: Task[]
	sortMode: TaskSortMode
	emptyDescription: string
	className?: string
	filters?: ITaskFilters
	hasMore?: boolean
	onLoadMore?: () => void
	onPriorityFilterChange?: (priority: TaskPriorityFilter) => void
	onSortModeChange: (sortMode: TaskSortMode) => void
	onStatusFilterChange?: (status: TaskStatusFilter) => void
	onTaskDelete: (taskId: string) => void
	onTaskExists: (taskId: string) => boolean
	onTaskUpdate: (task: Task) => void
}

const statusOptions: Array<{ label: string; value: TaskStatusFilter }> = [
	{ label: 'Все', value: 'all' },
	...(Object.entries(taskStatusLabels) as Array<[TaskStatus, string]>).map(
		([value, label]) => ({ label, value }),
	),
]

const priorityOptions: Array<{ label: string; value: TaskPriorityFilter }> = [
	{ label: 'Все', value: 'all' },
	...(Object.entries(taskPriorityLabels) as Array<[TaskPriority, string]>).map(
		([value, label]) => ({ label, value }),
	),
]

const sortOptions: Array<{ label: string; value: TaskSortMode }> = [
	{ label: 'Приоритет', value: 'priority' },
	{ label: 'Время', value: 'time' },
]

export const TaskOverviewPanel: FC<ITaskOverviewPanel> = ({
	className,
	counter,
	emptyDescription,
	filters,
	hasMore = false,
	onLoadMore,
	onPriorityFilterChange,
	onSortModeChange,
	onStatusFilterChange,
	onTaskDelete,
	onTaskExists,
	onTaskUpdate,
	sortMode,
	tasks,
	title,
}) => {
	const observerRef = useRef<HTMLDivElement | null>(null)
	const isLoadingRef = useRef(false)

	useEffect(() => {
		const target = observerRef.current

		if (!target || !hasMore || !onLoadMore) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !isLoadingRef.current) {
					isLoadingRef.current = true
					onLoadMore()

					setTimeout(() => {
						isLoadingRef.current = false
					}, 500)
				}
			},
			{
				root: null,
				rootMargin: '120px',
				threshold: 0.1,
			},
		)

		observer.observe(target)

		return () => {
			observer.unobserve(target)
		}
	}, [hasMore, onLoadMore])

	return (
		<Surface className={clsx(styles.panel, className)}>
			<div className={styles.header}>
				<Typography.Title className={styles.title} level={2}>
					{title}
				</Typography.Title>
				<div className={styles.headerActions}>
					<Typography.Text className={styles.counter}>
						{counter}
					</Typography.Text>
					<Segmented
						className={clsx(styles.segmented, styles.headerSort)}
						options={sortOptions}
						value={sortMode}
						onChange={nextValue => onSortModeChange(nextValue)}
					/>
				</div>
			</div>

			{filters ? (
				<div className={styles.controls}>
					<label className={clsx(styles.field, styles.statusField)}>
						<Typography.Text className={styles.label}>Статус</Typography.Text>
						<Segmented
							className={styles.segmented}
							options={statusOptions}
							value={filters.status}
							onChange={nextValue => onStatusFilterChange?.(nextValue)}
						/>
					</label>

					<label className={clsx(styles.field, styles.priorityField)}>
						<Typography.Text className={styles.label}>
							Приоритет
						</Typography.Text>
						<Segmented
							className={styles.segmented}
							options={priorityOptions}
							value={filters.priority}
							onChange={nextValue => onPriorityFilterChange?.(nextValue)}
						/>
					</label>
				</div>
			) : null}

			{tasks.length ? (
				<div className={styles.list}>
					{tasks.map(task => (
						<TaskCard key={task.id} task={task}>
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
					))}
				</div>
			) : (
				<Empty description={emptyDescription} />
			)}

			{hasMore && (
				<div ref={observerRef} className={styles.observer}>
					<Spin size='small' />
				</div>
			)}
		</Surface>
	)
}
