import type { RequestHandler } from 'express'
import { HttpError } from '../../shared/http/httpError.js'
import {
	taskCreateSchema,
	taskListQuerySchema,
	taskStatsQuerySchema,
	taskTopQuerySchema,
	taskUpdateSchema,
} from './task.schemas.js'
import { taskService } from './task.service.js'

const getTaskId = (params: Record<string, string | string[] | undefined>) => {
	const taskId = params.taskId

	if (!taskId || Array.isArray(taskId)) {
		throw new HttpError(400, 'TASK_ID_REQUIRED', 'Не передан id задачи')
	}

	return taskId
}

export const taskController = {
	list: (async (req, res) => {
		const query = taskListQuerySchema.parse(req.query)
		const result = await taskService.list(query)

		res.json(result)
	}) satisfies RequestHandler,

	getById: (async (req, res) => {
		const task = await taskService.getById(getTaskId(req.params))

		res.json(task)
	}) satisfies RequestHandler,

	create: (async (req, res) => {
		const payload = taskCreateSchema.parse(req.body)
		const task = await taskService.create(payload)

		res.status(201).json(task)
	}) satisfies RequestHandler,

	update: (async (req, res) => {
		const payload = taskUpdateSchema.parse(req.body)
		const task = await taskService.update(getTaskId(req.params), payload)

		res.json(task)
	}) satisfies RequestHandler,

	delete: (async (req, res) => {
		await taskService.delete(getTaskId(req.params))

		res.status(204).send()
	}) satisfies RequestHandler,

	stats: (async (req, res) => {
		const query = taskStatsQuerySchema.parse(req.query)
		const stats = await taskService.stats(query.from, query.to)

		res.json(stats)
	}) satisfies RequestHandler,

	top: (async (req, res) => {
		const query = taskTopQuerySchema.parse(req.query)
		const result = await taskService.top(query.period, query.date, query.limit)

		res.json(result)
	}) satisfies RequestHandler,
}
