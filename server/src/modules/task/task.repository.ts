import { randomUUID } from 'node:crypto'
import { pool } from '../../shared/db/pool.js'
import { mapTaskRow, type TaskRow } from './task.mapper.js'
import type {
	Task,
	TaskCreateRequest,
	TaskListQuery,
	TaskStats,
	TaskUpdateRequest,
} from './task.types.js'

interface SqlParts {
	whereSql: string
	params: unknown[]
}

const getPrioritySortSql = () =>
	"CASE priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END"

const getSortSql = (sortBy: TaskListQuery['sortBy']) => {
	const completionSort = "CASE WHEN status = 'done' THEN 1 ELSE 0 END ASC"

	if (sortBy === 'time') {
		return `${completionSort}, start_at ASC`
	}

	return `${completionSort}, ${getPrioritySortSql()} DESC, start_at ASC`
}

const buildWhere = (
	query: Pick<TaskListQuery, 'from' | 'to' | 'status' | 'priority'>,
	withFilters: boolean,
): SqlParts => {
	const params: unknown[] = []
	const clauses: string[] = []

	if (query.from) {
		params.push(query.from)
		clauses.push(`start_at >= $${params.length}`)
	}

	if (query.to) {
		params.push(query.to)
		clauses.push(`start_at <= $${params.length}`)
	}

	if (withFilters && query.status && query.status !== 'all') {
		params.push(query.status)
		clauses.push(`status = $${params.length}`)
	}

	if (withFilters && query.priority && query.priority !== 'all') {
		params.push(query.priority)
		clauses.push(`priority = $${params.length}`)
	}

	return {
		whereSql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
		params,
	}
}

const getCount = async ({ params, whereSql }: SqlParts) => {
	const result = await pool.query<{ count: string }>(
		`SELECT COUNT(*)::int AS count FROM tasks ${whereSql}`,
		params,
	)

	return Number(result.rows[0]?.count ?? 0)
}

export const taskRepository = {
	async list(query: TaskListQuery) {
		const sourceWhere = buildWhere(query, false)
		const filteredWhere = buildWhere(query, true)
		const sourceCount = await getCount(sourceWhere)
		const filteredCount = await getCount(filteredWhere)
		const visibleLimit = query.page * query.limit
		const listParams = [...filteredWhere.params, visibleLimit]

		const result = await pool.query<TaskRow>(
			`
				SELECT *
				FROM tasks
				${filteredWhere.whereSql}
				ORDER BY ${getSortSql(query.sortBy)}
				LIMIT $${listParams.length}
			`,
			listParams,
		)

		return {
			items: result.rows.map(mapTaskRow),
			meta: {
				sourceCount,
				filteredCount,
				page: query.page,
				limit: query.limit,
				hasMore: result.rows.length < filteredCount,
			},
		}
	},

	async findById(taskId: string): Promise<Task | null> {
		const result = await pool.query<TaskRow>(
			'SELECT * FROM tasks WHERE id = $1',
			[taskId],
		)

		const row = result.rows[0]

		return row ? mapTaskRow(row) : null
	},

	async create(payload: TaskCreateRequest): Promise<Task> {
		const now = new Date().toISOString()
		const result = await pool.query<TaskRow>(
			`
				INSERT INTO tasks (
					id,
					title,
					description,
					start_at,
					priority,
					status,
					created_at,
					updated_at
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
				RETURNING *
			`,
			[
				randomUUID(),
				payload.title,
				payload.description ?? null,
				payload.startAt,
				payload.priority,
				payload.status,
				now,
			],
		)

		return mapTaskRow(result.rows[0]!)
	},

	async update(taskId: string, payload: TaskUpdateRequest): Promise<Task | null> {
		const params: unknown[] = []
		const setters: string[] = []

		const addSetter = (column: string, value: unknown) => {
			params.push(value)
			setters.push(`${column} = $${params.length}`)
		}

		if (payload.title !== undefined) addSetter('title', payload.title)
		if (payload.description !== undefined) {
			addSetter('description', payload.description || null)
		}
		if (payload.startAt !== undefined) addSetter('start_at', payload.startAt)
		if (payload.priority !== undefined) addSetter('priority', payload.priority)
		if (payload.status !== undefined) addSetter('status', payload.status)

		addSetter('updated_at', new Date().toISOString())
		params.push(taskId)

		const result = await pool.query<TaskRow>(
			`
				UPDATE tasks
				SET ${setters.join(', ')}
				WHERE id = $${params.length}
				RETURNING *
			`,
			params,
		)

		const row = result.rows[0]

		return row ? mapTaskRow(row) : null
	},

	async delete(taskId: string) {
		const result = await pool.query('DELETE FROM tasks WHERE id = $1', [taskId])

		return (result.rowCount ?? 0) > 0
	},

	async clear() {
		await pool.query('DELETE FROM tasks')
	},

	async stats(from: string, to: string): Promise<TaskStats> {
		const result = await pool.query<{
			total: string
			planned: string
			in_progress: string
			done: string
			high_priority: string
		}>(
			`
				SELECT
					COUNT(*)::int AS total,
					COUNT(*) FILTER (WHERE status = 'todo')::int AS planned,
					COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
					COUNT(*) FILTER (WHERE status = 'done')::int AS done,
					COUNT(*) FILTER (WHERE priority = 'high')::int AS high_priority
				FROM tasks
				WHERE start_at >= $1 AND start_at <= $2
			`,
			[from, to],
		)

		const stats = result.rows[0]

		return {
			total: Number(stats?.total ?? 0),
			planned: Number(stats?.planned ?? 0),
			inProgress: Number(stats?.in_progress ?? 0),
			done: Number(stats?.done ?? 0),
			highPriority: Number(stats?.high_priority ?? 0),
		}
	},

	async top(from: string, to: string, limit: number): Promise<Task[]> {
		const result = await pool.query<TaskRow>(
			`
				SELECT *
				FROM tasks
				WHERE start_at >= $1
					AND start_at <= $2
					AND status != 'done'
				ORDER BY ${getPrioritySortSql()} DESC, start_at ASC
				LIMIT $3
			`,
			[from, to, limit],
		)

		return result.rows.map(mapTaskRow)
	},
}
