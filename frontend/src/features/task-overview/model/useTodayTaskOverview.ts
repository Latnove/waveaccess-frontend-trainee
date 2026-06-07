import { taskApi, type Task } from '@/entities/task'
import { endOfDay, format, startOfDay } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ITaskDayStats, ITaskOverviewList } from './types'
import { useTaskOverviewList } from './useTaskOverviewList'
import { useTaskSource } from './useTaskSource'

interface ITaskTopGroups {
	week: Task[]
	month: Task[]
}

interface IUseTodayTaskOverviewResult {
	today: Date
	stats: ITaskDayStats
	topTasks: ITaskTopGroups
	list: ITaskOverviewList
	deleteTask: (taskId: string) => Promise<void>
	updateTask: (task: Task) => Promise<void>
	isTaskExists: (taskId: string) => boolean
}

const TOP_LIMIT = 3

const emptyStats: ITaskDayStats = {
	total: 0,
	planned: 0,
	inProgress: 0,
	done: 0,
	highPriority: 0,
}

const emptyTopTasks: ITaskTopGroups = {
	week: [],
	month: [],
}

export const useTodayTaskOverview = (): IUseTodayTaskOverviewResult => {
	const [refreshKey, setRefreshKey] = useState(0)
	const [stats, setStats] = useState<ITaskDayStats>(emptyStats)
	const [topTasks, setTopTasks] = useState<ITaskTopGroups>(emptyTopTasks)
	const today = useMemo(() => new Date(), [])
	const todayRange = useMemo(
		() => ({
			from: startOfDay(today).toISOString(),
			to: endOfDay(today).toISOString(),
		}),
		[today],
	)
	const topDate = useMemo(() => format(today, 'yyyy-MM-dd'), [today])
	const refreshTasks = useCallback(() => {
		setRefreshKey(currentKey => currentKey + 1)
	}, [])
	const list = useTaskOverviewList({
		limit: 4,
		range: todayRange,
		refreshKey,
		withFilters: true,
	})

	useEffect(() => {
		let isActive = true

		const fetchTodayData = async () => {
			try {
				const [nextStats, weekTop, monthTop] = await Promise.all([
					taskApi.getStats(todayRange.from, todayRange.to),
					taskApi.getTopTasks('week', TOP_LIMIT, topDate),
					taskApi.getTopTasks('month', TOP_LIMIT, topDate),
				])

				if (!isActive) return

				setStats(nextStats)
				setTopTasks({
					week: weekTop.items,
					month: monthTop.items,
				})
			} catch {
				if (!isActive) return

				setStats(emptyStats)
				setTopTasks(emptyTopTasks)
			}
		}

		fetchTodayData()

		return () => {
			isActive = false
		}
	}, [refreshKey, todayRange, topDate])

	const knownTasks = useMemo(
		() => [...list.tasks, ...topTasks.week, ...topTasks.month],
		[list.tasks, topTasks.month, topTasks.week],
	)
	const { deleteTask, isTaskExists, updateTask } = useTaskSource(
		knownTasks,
		refreshTasks,
	)

	return {
		today,
		stats,
		topTasks,
		list,
		deleteTask,
		updateTask,
		isTaskExists,
	}
}
