import cors from 'cors'
import express from 'express'
import { env } from './shared/config/env.js'
import { errorMiddleware } from './shared/http/errorMiddleware.js'
import { taskRouter } from './modules/task/task.routes.js'

export const createApp = () => {
	const app = express()

	app.use(
		cors({
			credentials: true,
			origin(origin, callback) {
				if (!origin || env.corsOrigins.includes('*')) {
					callback(null, true)
					return
				}

				if (env.corsOrigins.includes(origin)) {
					callback(null, true)
					return
				}

				callback(null, false)
			},
		}),
	)
	app.use(express.json())

	app.get('/api/v1/health', (_req, res) => {
		res.json({ status: 'ok' })
	})

	app.use('/api/v1', taskRouter)
	app.use(errorMiddleware)

	return app
}
