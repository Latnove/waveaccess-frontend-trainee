import type { Task, TaskPriority, TaskStatus } from '@/entities/task'

export type TaskSortMode = 'priority' | 'time'
export type TaskStatusFilter = 'all' | TaskStatus
export type TaskPriorityFilter = 'all' | TaskPriority

export interface ITaskFilters {
	status: TaskStatusFilter
	priority: TaskPriorityFilter
}

export interface ITaskOverviewQuery {
	page: number
	limit: number
	sortMode: TaskSortMode
	filters: ITaskFilters
}

export interface ITaskOverviewList {
	tasks: Task[]
	sourceCount: number
	filteredCount: number
	page: number
	limit: number
	hasMore: boolean
	sortMode: TaskSortMode
	filters: ITaskFilters
	setSortMode: (sortMode: TaskSortMode) => void
	setStatusFilter: (status: TaskStatusFilter) => void
	setPriorityFilter: (priority: TaskPriorityFilter) => void
	loadMore: () => void
}

export interface ITaskDayStats {
	total: number
	planned: number
	inProgress: number
	done: number
	highPriority: number
}
