import type { Task } from '@/entities/task'
import type { IDateRangeValue } from '@/shared/ui/DateTimePicker'
import { endOfDay, startOfDay } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import type { ITaskOverviewList } from './types'
import { useTaskOverviewList } from './useTaskOverviewList'
import { useTaskSource } from './useTaskSource'

interface IUsePeriodTaskOverviewOptions {
	range: IDateRangeValue
}

interface IUsePeriodTaskOverviewResult {
	hasSelectedPeriod: boolean
	list: ITaskOverviewList
	deleteTask: (taskId: string) => Promise<void>
	updateTask: (task: Task) => Promise<void>
	isTaskExists: (taskId: string) => boolean
}

export const usePeriodTaskOverview = ({
	range,
}: IUsePeriodTaskOverviewOptions): IUsePeriodTaskOverviewResult => {
	const [refreshKey, setRefreshKey] = useState(0)
	const hasSelectedPeriod = Boolean(range.from && range.to)
	const normalizedRange = useMemo(
		() =>
			hasSelectedPeriod
				? {
						from: startOfDay(new Date(range.from!)).toISOString(),
						to: endOfDay(new Date(range.to!)).toISOString(),
					}
				: undefined,
		[hasSelectedPeriod, range.from, range.to],
	)
	const refreshTasks = useCallback(() => {
		setRefreshKey(currentKey => currentKey + 1)
	}, [])
	const list = useTaskOverviewList({
		enabled: hasSelectedPeriod,
		range: normalizedRange,
		refreshKey,
		withFilters: true,
		withPagination: true,
	})
	const { deleteTask, isTaskExists, updateTask } = useTaskSource(
		list.tasks,
		refreshTasks,
	)

	return {
		hasSelectedPeriod,
		list,
		deleteTask,
		updateTask,
		isTaskExists,
	}
}
