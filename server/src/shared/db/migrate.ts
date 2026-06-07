import { pool } from './pool.js'

export const migrate = async () => {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS tasks (
			id UUID PRIMARY KEY,
			title VARCHAR(120) NOT NULL,
			description VARCHAR(255),
			start_at TIMESTAMPTZ NOT NULL,
			priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
			status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);

		CREATE INDEX IF NOT EXISTS tasks_start_at_idx ON tasks(start_at);
		CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
		CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
	`)
}
