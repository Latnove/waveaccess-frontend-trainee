import { TaskCreateForm } from '@/features/task-create'
import { Surface } from '@/shared/ui/Surface'
import { Typography } from 'antd'
import type { FC } from 'react'
import styles from './TaskCreatePage.module.css'

export const TaskCreatePage: FC = () => (
	<main className={styles.page}>
		<Surface className={styles.panel}>
			<Typography.Text className={styles.eyebrow}>Создать</Typography.Text>
			<Typography.Title className={styles.title} level={1}>
				Создание задачи
			</Typography.Title>

			<TaskCreateForm />
		</Surface>
	</main>
)
