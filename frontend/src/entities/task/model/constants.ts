import type { TaskPriority, TaskStatus } from './types'

export const taskPriorityLabels: Record<TaskPriority, string> = {
	low: 'Низкий',
	medium: 'Средний',
	high: 'Высокий',
}

export const taskStatusLabels: Record<TaskStatus, string> = {
	todo: 'Запланировано',
	in_progress: 'Выполняется',
	done: 'Выполнено',
}

export const taskPriorityWeight: Record<TaskPriority, number> = {
	high: 3,
	medium: 2,
	low: 1,
}
