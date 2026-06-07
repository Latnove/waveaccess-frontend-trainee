import { describe, expect, it } from 'vitest'
import type { Task } from '@/entities/task'
import type { ITaskOverviewQuery } from '../model/types'
import { getTaskOverviewResult } from './getTaskOverviewResult'

const createTask = (
	id: string,
	startAt: string,
	priority: Task['priority'],
	status: Task['status'],
): Task => ({
	id,
	title: `Задача ${id}`,
	startAt,
	priority,
	status,
	createdAt: '2026-06-01T00:00:00.000Z',
	updatedAt: '2026-06-01T00:00:00.000Z',
})

const tasks: Task[] = [
	createTask('low-active', '2026-06-06T08:00:00.000Z', 'low', 'todo'),
	createTask('high-active', '2026-06-06T10:00:00.000Z', 'high', 'in_progress'),
	createTask('medium-done', '2026-06-06T09:00:00.000Z', 'medium', 'done'),
	createTask('medium-active', '2026-06-06T07:00:00.000Z', 'medium', 'todo'),
]

const createQuery = (
	query: Partial<ITaskOverviewQuery> = {},
): ITaskOverviewQuery => ({
	page: 1,
	limit: 2,
	sortMode: 'priority',
	filters: {
		status: 'all',
		priority: 'all',
	},
	...query,
})

describe('getTaskOverviewResult', () => {
	it('фильтрует задачи по статусу и приоритету', () => {
		const result = getTaskOverviewResult(
			tasks,
			createQuery({
				filters: {
					status: 'todo',
					priority: 'medium',
				},
			}),
			{ withFilters: true },
		)

		expect(result.sourceCount).toBe(4)
		expect(result.filteredCount).toBe(1)
		expect(result.tasks).toHaveLength(1)
		expect(result.tasks[0]?.id).toBe('medium-active')
	})

	it('сортирует по приоритету и опускает выполненные задачи вниз', () => {
		const result = getTaskOverviewResult(tasks, createQuery())

		expect(result.tasks.map(task => task.id)).toEqual([
			'high-active',
			'medium-active',
			'low-active',
			'medium-done',
		])
		expect(result.tasks.at(-1)?.status).toBe('done')
	})

	it('показывает задачи порциями для дозагрузки', () => {
		const firstPage = getTaskOverviewResult(tasks, createQuery(), {
			withPagination: true,
		})
		const secondPage = getTaskOverviewResult(
			tasks,
			createQuery({ page: 2 }),
			{ withPagination: true },
		)

		expect(firstPage.tasks).toHaveLength(2)
		expect(firstPage.hasMore).toBe(true)
		expect(secondPage.tasks).toHaveLength(4)
		expect(secondPage.hasMore).toBe(false)
	})
})
