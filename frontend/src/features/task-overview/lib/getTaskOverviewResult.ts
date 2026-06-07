import { taskPriorityWeight, type Task } from '@/entities/task'
import type { ITaskOverviewQuery } from '../model/types'

interface IGetTaskOverviewResultOptions {
	withFilters?: boolean
	withPagination?: boolean
}

interface ITaskOverviewResult {
	tasks: Task[]
	sourceCount: number
	filteredCount: number
	hasMore: boolean
}

const getCompletionWeight = (task: Task) => (task.status === 'done' ? 1 : 0)

const getFilteredTasks = (
	tasks: Task[],
	query: ITaskOverviewQuery,
	withFilters?: boolean,
) => {
	if (!withFilters) return tasks

	return tasks.filter(task => {
		const isStatusMatched =
			query.filters.status === 'all' || task.status === query.filters.status
		const isPriorityMatched =
			query.filters.priority === 'all' ||
			task.priority === query.filters.priority

		return isStatusMatched && isPriorityMatched
	})
}

const getSortedTasks = (tasks: Task[], query: ITaskOverviewQuery) =>
	[...tasks].sort((a, b) => {
		const completionDelta = getCompletionWeight(a) - getCompletionWeight(b)

		if (completionDelta) return completionDelta

		if (query.sortMode === 'time') {
			return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
		}

		const priorityDelta =
			taskPriorityWeight[b.priority] - taskPriorityWeight[a.priority]

		return (
			priorityDelta ||
			new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
		)
	})

export const getTaskOverviewResult = (
	tasks: Task[],
	query: ITaskOverviewQuery,
	options: IGetTaskOverviewResultOptions = {},
): ITaskOverviewResult => {
	const filteredTasks = getFilteredTasks(tasks, query, options.withFilters)
	const sortedTasks = getSortedTasks(filteredTasks, query)
	const visibleCount = query.page * query.limit
	const visibleTasks = options.withPagination
		? sortedTasks.slice(0, visibleCount)
		: sortedTasks

	return {
		tasks: visibleTasks,
		sourceCount: tasks.length,
		filteredCount: sortedTasks.length,
		hasMore: options.withPagination
			? visibleTasks.length < sortedTasks.length
			: false,
	}
}
