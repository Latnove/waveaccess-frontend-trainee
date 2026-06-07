import { z } from 'zod'
import type { TaskPriority, TaskStatus } from '@/entities/task'

export const taskCreateSchema = z.object({
	title: z.string().trim().min(3, 'Минимум 3 символа'),
	description: z
		.string()
		.max(255, 'Максимальное количество символов 255')
		.optional(),
	startAt: z.string().min(1, 'Выберите дату и время'),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['todo', 'in_progress', 'done']),
})

export interface ITaskCreateFormValues {
	title: string
	description?: string
	startAt: string
	priority: TaskPriority
	status: TaskStatus
}
