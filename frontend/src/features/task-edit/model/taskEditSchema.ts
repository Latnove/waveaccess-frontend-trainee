import type { Task, TaskPriority, TaskStatus } from '@/entities/task'
import { z } from 'zod'

export interface ITaskEditFormValues {
	title: string
	description: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
}

export const taskEditSchema = z.object({
	title: z.string().min(1, 'Введите название'),
	description: z.string(),
	startAt: z.string().min(1, 'Выберите дату и время'),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['todo', 'in_progress', 'done']),
})

export const getTaskEditDefaultValues = (task: Task): ITaskEditFormValues => ({
	title: task.title,
	description: task.description ?? '',
	startAt: task.startAt,
	priority: task.priority,
	status: task.status,
})

export const mergeTaskEditValues = (
	task: Task,
	values: ITaskEditFormValues,
): Task => ({
	...task,
	title: values.title,
	description: values.description || undefined,
	startAt: values.startAt,
	priority: values.priority,
	status: values.status,
	updatedAt: new Date().toISOString(),
})
