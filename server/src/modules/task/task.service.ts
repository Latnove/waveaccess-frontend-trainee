import { HttpError } from '../../shared/http/httpError.js'
import { taskRepository } from './task.repository.js'
import type {
	TaskCreateRequest,
	TaskListQuery,
	TaskTopPeriod,
	TaskUpdateRequest,
} from './task.types.js'

const normalizeDescription = (description?: string) => {
	const nextDescription = description?.trim()

	return nextDescription || undefined
}

const validateDateRange = (from?: string, to?: string) => {
	if (!from || !to) return

	if (new Date(from).getTime() > new Date(to).getTime()) {
		throw new HttpError(
			400,
			'INVALID_DATE_RANGE',
			'Дата начала периода не может быть позже даты конца',
		)
	}
}

const getStartOfDay = (date: Date) => {
	const nextDate = new Date(date)

	nextDate.setHours(0, 0, 0, 0)

	return nextDate
}

const getEndOfDay = (date: Date) => {
	const nextDate = new Date(date)

	nextDate.setHours(23, 59, 59, 999)

	return nextDate
}

const getWeekRange = (date: Date) => {
	const start = getStartOfDay(date)
	const day = start.getDay()
	const mondayOffset = day === 0 ? -6 : 1 - day

	start.setDate(start.getDate() + mondayOffset)

	const end = getEndOfDay(start)

	end.setDate(start.getDate() + 6)

	return {
		from: start.toISOString(),
		to: end.toISOString(),
	}
}

const getMonthRange = (date: Date) => {
	const from = getStartOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
	const to = getEndOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))

	return {
		from: from.toISOString(),
		to: to.toISOString(),
	}
}

const getTopRange = (period: TaskTopPeriod, date?: string) => {
	const baseDate = date ? new Date(`${date}T00:00:00.000Z`) : new Date()

	return period === 'week' ? getWeekRange(baseDate) : getMonthRange(baseDate)
}

export const taskService = {
	async list(query: TaskListQuery) {
		validateDateRange(query.from, query.to)

		return taskRepository.list(query)
	},

	async getById(taskId: string) {
		const task = await taskRepository.findById(taskId)

		if (!task) {
			throw new HttpError(404, 'TASK_NOT_FOUND', 'Задача не найдена')
		}

		return task
	},

	async create(payload: TaskCreateRequest) {
		return taskRepository.create({
			...payload,
			description: normalizeDescription(payload.description),
		})
	},

	async update(taskId: string, payload: TaskUpdateRequest) {
		const task = await taskRepository.update(taskId, {
			...payload,
			description:
				payload.description === undefined
					? undefined
					: normalizeDescription(payload.description),
		})

		if (!task) {
			throw new HttpError(404, 'TASK_NOT_FOUND', 'Задача не найдена')
		}

		return task
	},

	async delete(taskId: string) {
		const isDeleted = await taskRepository.delete(taskId)

		if (!isDeleted) {
			throw new HttpError(404, 'TASK_NOT_FOUND', 'Задача не найдена')
		}
	},

	async stats(from: string, to: string) {
		validateDateRange(from, to)

		return taskRepository.stats(from, to)
	},

	async top(period: TaskTopPeriod, date: string | undefined, limit: number) {
		const range = getTopRange(period, date)

		return {
			items: await taskRepository.top(range.from, range.to, limit),
			limit,
		}
	},
}
