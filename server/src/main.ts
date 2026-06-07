import { createApp } from './app.js'
import { env } from './shared/config/env.js'
import { closePool } from './shared/db/pool.js'
import { migrate } from './shared/db/migrate.js'
import { seedTasks } from './modules/task/task.seed.js'

const bootstrap = async () => {
	await migrate()

	if (env.seedOnStart) {
		await seedTasks()
	}

	const app = createApp()
	const server = app.listen(env.port, () => {
		console.log(`Server is running on http://localhost:${env.port}`)
	})

	const shutdown = async () => {
		server.close(async () => {
			await closePool()
			process.exit(0)
		})
	}

	process.on('SIGINT', shutdown)
	process.on('SIGTERM', shutdown)
}

bootstrap().catch(error => {
	console.error(error)
	process.exit(1)
})
