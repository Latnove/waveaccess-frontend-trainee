import type { Task } from './task.types.js'

export interface TaskRow {
	id: string
	title: string
	description: string | null
	start_at: Date
	priority: Task['priority']
	status: Task['status']
	created_at: Date
	updated_at: Date
}

export const mapTaskRow = (row: TaskRow): Task => ({
	id: row.id,
	title: row.title,
	description: row.description ?? undefined,
	startAt: row.start_at.toISOString(),
	priority: row.priority,
	status: row.status,
	createdAt: row.created_at.toISOString(),
	updatedAt: row.updated_at.toISOString(),
})
