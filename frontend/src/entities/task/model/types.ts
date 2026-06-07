export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
	id: string
	title: string
	description?: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
	createdAt: string
	updatedAt: string
}
