import { taskApi, type Task } from '@/entities/task'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ITaskOverviewList } from './types'
import { useTaskOverviewList } from './useTaskOverviewList'
import { useTaskSource } from './useTaskSource'

interface IUseUpcomingTaskOverviewResult {
	totalTasksCount: number
	activeTasksCount: number
	highPriorityCount: number
	list: ITaskOverviewList
	deleteTask: (taskId: string) => Promise<void>
	updateTask: (task: Task) => Promise<void>
	isTaskExists: (taskId: string) => boolean
}

export const useUpcomingTaskOverview = (): IUseUpcomingTaskOverviewResult => {
	const [refreshKey, setRefreshKey] = useState(0)
	const [summaryTasks, setSummaryTasks] = useState<Task[]>([])
	const refreshTasks = useCallback(() => {
		setRefreshKey(currentKey => currentKey + 1)
	}, [])
	const list = useTaskOverviewList({
		refreshKey,
		withPagination: true,
	})

	useEffect(() => {
		let isActive = true

		const fetchSummaryTasks = async () => {
			try {
				const response = await taskApi.getTasks({
					limit: 100,
					page: 1,
					sortBy: 'priority',
				})

				if (isActive) {
					setSummaryTasks(response.items)
				}
			} catch {
				if (isActive) {
					setSummaryTasks([])
				}
			}
		}

		void fetchSummaryTasks()

		return () => {
			isActive = false
		}
	}, [refreshKey])

	const knownTasks = useMemo(
		() => [...summaryTasks, ...list.tasks],
		[list.tasks, summaryTasks],
	)
	const activeTasks = useMemo(
		() => summaryTasks.filter(task => task.status !== 'done'),
		[summaryTasks],
	)
	const highPriorityCount = useMemo(
		() => activeTasks.filter(task => task.priority === 'high').length,
		[activeTasks],
	)
	const { deleteTask, isTaskExists, updateTask } = useTaskSource(
		knownTasks,
		refreshTasks,
	)

	return {
		totalTasksCount: list.sourceCount,
		activeTasksCount: activeTasks.length,
		highPriorityCount,
		list,
		deleteTask,
		updateTask,
		isTaskExists,
	}
}
