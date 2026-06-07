import { apiClient } from '@/shared/api/client'
import type { Task, TaskPriority, TaskStatus } from '../model/types'

export type TaskSortBy = 'priority' | 'time'
export type TaskTopPeriod = 'week' | 'month'
export type TaskStatusQuery = TaskStatus | 'all'
export type TaskPriorityQuery = TaskPriority | 'all'

export interface ITaskListQuery {
	from?: string
	to?: string
	status?: TaskStatusQuery
	priority?: TaskPriorityQuery
	sortBy?: TaskSortBy
	page?: number
	limit?: number
}

export interface ITaskListResponse {
	items: Task[]
	meta: {
		sourceCount: number
		filteredCount: number
		page: number
		limit: number
		hasMore: boolean
	}
}

export interface ITaskStats {
	total: number
	planned: number
	inProgress: number
	done: number
	highPriority: number
}

export interface ITaskTopResponse {
	items: Task[]
	limit: number
}

export interface ITaskCreateRequest {
	title: string
	description?: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
}

export type ITaskUpdateRequest = Partial<ITaskCreateRequest>

export const taskApi = {
	async getTasks(query: ITaskListQuery = {}) {
		const { data } = await apiClient.get<ITaskListResponse>('/tasks', {
			params: query,
		})

		return data
	},

	async getTask(taskId: string) {
		const { data } = await apiClient.get<Task>(`/tasks/${taskId}`)

		return data
	},

	async createTask(payload: ITaskCreateRequest) {
		const { data } = await apiClient.post<Task>('/tasks', payload)

		return data
	},

	async updateTask(taskId: string, payload: ITaskUpdateRequest) {
		const { data } = await apiClient.patch<Task>(`/tasks/${taskId}`, payload)

		return data
	},

	async deleteTask(taskId: string) {
		await apiClient.delete(`/tasks/${taskId}`)
	},

	async getStats(from: string, to: string) {
		const { data } = await apiClient.get<ITaskStats>('/tasks/stats', {
			params: {
				from,
				to,
			},
		})

		return data
	},

	async getTopTasks(period: TaskTopPeriod, limit: number, date?: string) {
		const { data } = await apiClient.get<ITaskTopResponse>('/tasks/top', {
			params: {
				date,
				limit,
				period,
			},
		})

		return data
	},
}
