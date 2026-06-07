import { taskApi, type Task } from '@/entities/task'
import { useCallback } from 'react'

interface IUseTaskSourceResult {
	deleteTask: (taskId: string) => Promise<void>
	updateTask: (task: Task) => Promise<void>
	isTaskExists: (taskId: string) => boolean
}

export const useTaskSource = (
	tasks: Task[],
	onChange: () => void,
): IUseTaskSourceResult => {
	const deleteTask = useCallback(
		async (taskId: string) => {
			await taskApi.deleteTask(taskId)
			onChange()
		},
		[onChange],
	)

	const updateTask = useCallback(
		async (task: Task) => {
			await taskApi.updateTask(task.id, {
				description: task.description,
				priority: task.priority,
				startAt: task.startAt,
				status: task.status,
				title: task.title,
			})
			onChange()
		},
		[onChange],
	)

	const isTaskExists = useCallback(
		(taskId: string) => tasks.some(task => task.id === taskId),
		[tasks],
	)

	return {
		deleteTask,
		updateTask,
		isTaskExists,
	}
}
