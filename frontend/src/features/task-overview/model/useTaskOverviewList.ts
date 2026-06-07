import { taskApi, type Task } from '@/entities/task'
import { useEffect, useMemo, useState } from 'react'
import type {
	ITaskFilters,
	ITaskOverviewList,
	ITaskOverviewQuery,
	TaskPriorityFilter,
	TaskSortMode,
	TaskStatusFilter,
} from './types'

interface IUseTaskOverviewListOptions {
	withFilters?: boolean
	withPagination?: boolean
	limit?: number
	range?: ITaskOverviewRange
	refreshKey?: number
	enabled?: boolean
}

interface ITaskOverviewState extends ITaskOverviewQuery {
	range?: ITaskOverviewRange
}

interface ITaskOverviewRange {
	from?: string
	to?: string
}

const DEFAULT_LIMIT = 4

const emptyListState = {
	tasks: [] as Task[],
	sourceCount: 0,
	filteredCount: 0,
	hasMore: false,
}

const defaultFilters: ITaskFilters = {
	status: 'all',
	priority: 'all',
}

const createQuery = (
	limit: number,
	range?: ITaskOverviewRange,
): ITaskOverviewState => ({
	page: 1,
	limit,
	sortMode: 'priority',
	filters: defaultFilters,
	range,
})

const isSameRange = (
	currentRange?: ITaskOverviewRange,
	nextRange?: ITaskOverviewRange,
) =>
	currentRange?.from === nextRange?.from && currentRange?.to === nextRange?.to

const resetPaginationQuery = (
	query: ITaskOverviewState,
	limit: number,
	range?: ITaskOverviewRange,
): ITaskOverviewState => {
	if (query.limit === limit && isSameRange(query.range, range)) {
		return query
	}

	return {
		...query,
		page: 1,
		limit,
		range,
	}
}

export const useTaskOverviewList = (
	options: IUseTaskOverviewListOptions = {},
): ITaskOverviewList => {
	const {
		enabled = true,
		limit = DEFAULT_LIMIT,
		range,
		refreshKey = 0,
		withFilters = false,
		withPagination = false,
	} = options
	const [listState, setListState] = useState(emptyListState)
	const [query, setQuery] = useState<ITaskOverviewState>(() =>
		createQuery(limit, range),
	)
	const currentQuery = useMemo(
		() => resetPaginationQuery(query, limit, range),
		[limit, query, range],
	)

	useEffect(() => {
		let isActive = true

		const fetchTasks = async () => {
			if (!enabled) {
				setListState(emptyListState)
				return
			}

			try {
				const response = await taskApi.getTasks({
					from: currentQuery.range?.from,
					to: currentQuery.range?.to,
					priority: withFilters ? currentQuery.filters.priority : undefined,
					status: withFilters ? currentQuery.filters.status : undefined,
					sortBy: currentQuery.sortMode,
					page: withPagination ? currentQuery.page : 1,
					limit: withPagination ? currentQuery.limit : 100,
				})

				if (!isActive) return

				setListState({
					tasks: response.items,
					sourceCount: response.meta.sourceCount,
					filteredCount: response.meta.filteredCount,
					hasMore: withPagination ? response.meta.hasMore : false,
				})
			} catch {
				if (isActive) {
					setListState(emptyListState)
				}
			}
		}

		fetchTasks()

		return () => {
			isActive = false
		}
	}, [currentQuery, enabled, refreshKey, withFilters, withPagination])

	const setSortMode = (sortMode: TaskSortMode) => {
		setQuery(query => ({
			...resetPaginationQuery(query, limit, range),
			page: 1,
			sortMode,
		}))
	}

	const setStatusFilter = (status: TaskStatusFilter) => {
		setQuery(query => ({
			...resetPaginationQuery(query, limit, range),
			page: 1,
			filters: {
				...query.filters,
				status,
			},
		}))
	}

	const setPriorityFilter = (priority: TaskPriorityFilter) => {
		setQuery(query => ({
			...resetPaginationQuery(query, limit, range),
			page: 1,
			filters: {
				...query.filters,
				priority,
			},
		}))
	}

	const loadMore = () => {
		if (!listState.hasMore) return

		setQuery(query => {
			const nextQuery = resetPaginationQuery(query, limit, range)

			return {
				...nextQuery,
				page: nextQuery.page + 1,
			}
		})
	}

	return {
		tasks: listState.tasks,
		sourceCount: listState.sourceCount,
		filteredCount: listState.filteredCount,
		page: currentQuery.page,
		limit: currentQuery.limit,
		hasMore: listState.hasMore,
		sortMode: currentQuery.sortMode,
		filters: currentQuery.filters,
		setSortMode,
		setStatusFilter,
		setPriorityFilter,
		loadMore,
	}
}
