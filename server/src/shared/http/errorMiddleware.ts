import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { HttpError } from './httpError.js'

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
	if (error instanceof HttpError) {
		res.status(error.status).json({
			code: error.code,
			message: error.message,
			details: error.details,
		})
		return
	}

	if (error instanceof ZodError) {
		res.status(400).json({
			code: 'VALIDATION_ERROR',
			message: 'Некорректные данные запроса',
			details: error.issues,
		})
		return
	}

	console.error(error)

	res.status(500).json({
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Внутренняя ошибка сервера',
	})
}
