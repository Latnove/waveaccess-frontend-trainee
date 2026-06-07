import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import clsx from 'clsx'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HomeHero.module.css'
import { TaskSummary } from './TaskSummary'

interface IHomeHero {
	activeTasksCount: number
	highPriorityCount: number
	totalTasksCount: number
	className?: string
}

export const HomeHero: FC<IHomeHero> = ({
	activeTasksCount,
	highPriorityCount,
	totalTasksCount,
	className,
}) => {
	const navigate = useNavigate()

	return (
		<section className={clsx(className, styles.section)}>
			<div className={styles.heroCopy}>
				<Typography.Text className={styles.eyebrow}>
					Ваш карманный todo-list
				</Typography.Text>
				<Typography.Title className={styles.title} level={1}>
					Задачи на ближайшие дни
				</Typography.Title>
				<Typography.Paragraph className={styles.lead}>
					Организуйте свои дела и достигайте целей легко и эффективно
				</Typography.Paragraph>
				<div className={styles.actions}>
					<Button
						icon={<PlusOutlined />}
						type='primary'
						onClick={() => navigate(ROUTES.taskCreate)}
					>
						Создать задачу
					</Button>
					<Button
						icon={<CalendarOutlined />}
						onClick={() => navigate(ROUTES.daySchedule)}
					>
						Расписание
					</Button>
				</div>
			</div>

			<TaskSummary
				activeTasksCount={activeTasksCount}
				highPriorityCount={highPriorityCount}
				totalTasksCount={totalTasksCount}
			/>
		</section>
	)
}
