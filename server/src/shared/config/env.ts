import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config } from 'dotenv'

const envPath = [
	resolve(process.cwd(), '.env'),
	resolve(process.cwd(), '../.env'),
].find(path => existsSync(path))

if (envPath) {
	config({ path: envPath })
} else {
	config()
}

const DEFAULT_CORS_ORIGINS = [
	'http://localhost:5173',
	'http://127.0.0.1:5173',
	'http://localhost:3000',
	'http://127.0.0.1:3000',
]

const getNumberEnv = (name: string, fallback: number) => {
	const value = process.env[name]

	if (!value) return fallback

	const parsed = Number(value)

	if (Number.isNaN(parsed)) {
		throw new Error(`${name} must be a number`)
	}

	return parsed
}

const getCorsOrigins = () => {
	const value = process.env.CORS_ORIGIN

	if (!value) return DEFAULT_CORS_ORIGINS

	return value
		.split(',')
		.map(origin => origin.trim())
		.filter(Boolean)
}

export const env = {
	port: getNumberEnv('PORT', getNumberEnv('SERVER_PORT', 4000)),
	databaseUrl:
		process.env.DATABASE_URL ??
		'postgres://todo:todo@localhost:5433/todo_waveaccess',
	corsOrigins: getCorsOrigins(),
	seedOnStart: process.env.SEED_ON_START !== 'false',
}
