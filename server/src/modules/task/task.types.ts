export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskSortBy = 'priority' | 'time'
export type TaskTopPeriod = 'week' | 'month'

export interface Task {
	id: string
	title: string
	description?: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
	createdAt: string
	updatedAt: string
}

export interface TaskCreateRequest {
	title: string
	description?: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
}

export interface TaskUpdateRequest {
	title?: string
	description?: string
	startAt?: string
	priority?: TaskPriority
	status?: TaskStatus
}

export interface TaskListQuery {
	from?: string
	to?: string
	status?: TaskStatus | 'all'
	priority?: TaskPriority | 'all'
	sortBy: TaskSortBy
	page: number
	limit: number
}

export interface TaskListResponse {
	items: Task[]
	meta: {
		sourceCount: number
		filteredCount: number
		page: number
		limit: number
		hasMore: boolean
	}
}

export interface TaskStats {
	total: number
	planned: number
	inProgress: number
	done: number
	highPriority: number
}
