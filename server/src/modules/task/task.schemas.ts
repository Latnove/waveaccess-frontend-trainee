import { z } from 'zod'

const taskPrioritySchema = z.enum(['low', 'medium', 'high'])
const taskStatusSchema = z.enum(['todo', 'in_progress', 'done'])
const taskSortBySchema = z.enum(['priority', 'time'])

const optionalIsoDateSchema = z
	.string()
	.datetime()
	.optional()

const requiredIsoDateSchema = z.string().datetime()

export const taskListQuerySchema = z.object({
	from: optionalIsoDateSchema,
	to: optionalIsoDateSchema,
	status: z.union([taskStatusSchema, z.literal('all')]).default('all'),
	priority: z.union([taskPrioritySchema, z.literal('all')]).default('all'),
	sortBy: taskSortBySchema.default('priority'),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
})

export const taskCreateSchema = z.object({
	title: z.string().trim().min(3).max(120),
	description: z.string().trim().max(255).optional(),
	startAt: requiredIsoDateSchema,
	priority: taskPrioritySchema,
	status: taskStatusSchema,
})

export const taskUpdateSchema = z
	.object({
		title: z.string().trim().min(3).max(120).optional(),
		description: z.string().trim().max(255).optional(),
		startAt: requiredIsoDateSchema.optional(),
		priority: taskPrioritySchema.optional(),
		status: taskStatusSchema.optional(),
	})
	.refine(value => Object.keys(value).length > 0, {
		message: 'Нужно передать хотя бы одно поле для обновления',
	})

export const taskStatsQuerySchema = z.object({
	from: requiredIsoDateSchema,
	to: requiredIsoDateSchema,
})

export const taskTopQuerySchema = z.object({
	period: z.enum(['week', 'month']),
	date: z.string().date().optional(),
	limit: z.coerce.number().int().positive().max(20).default(3),
})
