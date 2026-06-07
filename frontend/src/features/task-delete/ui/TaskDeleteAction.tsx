import type { Task } from '@/entities/task'
import { Button } from '@/shared/ui/Button'
import { TooltipTrigger } from '@/shared/ui/TooltipTrigger'
import { DeleteOutlined } from '@ant-design/icons'
import { Modal, Typography, notification } from 'antd'
import type { FC } from 'react'
import { useState } from 'react'
import styles from './TaskDeleteAction.module.css'

interface ITaskDeleteAction {
	task: Task
	isTaskExists: (taskId: string) => boolean
	onDelete: (taskId: string) => void | Promise<void>
}

export const TaskDeleteAction: FC<ITaskDeleteAction> = ({
	isTaskExists,
	onDelete,
	task,
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const notifyTaskNotFound = () => {
		notification.warning({
			message: 'Задача не найдена',
			description: 'Возможно, она уже была удалена из списка.',
		})
	}

	const handleOpen = () => {
		if (!isTaskExists(task.id)) {
			notifyTaskNotFound()
			return
		}

		setIsOpen(true)
	}

	const handleClose = () => {
		setIsOpen(false)
	}

	const handleDelete = async () => {
		if (!isTaskExists(task.id)) {
			notifyTaskNotFound()
			handleClose()
			return
		}

		try {
			await onDelete(task.id)
			notification.success({
				message: 'Задача удалена',
			})
			handleClose()
		} catch {
			notification.error({
				message: 'Не удалось удалить задачу',
				description: 'Проверьте соединение с сервером и попробуйте снова.',
			})
		}
	}

	return (
		<>
			<TooltipTrigger title='Удалить'>
				<Button
					danger
					aria-label='Удалить задачу'
					icon={<DeleteOutlined />}
					shape='circle'
					onClick={handleOpen}
				/>
			</TooltipTrigger>

			<Modal
				centered
				footer={null}
				open={isOpen}
				title={null}
				width={460}
				onCancel={handleClose}
			>
				<div className={styles.modal}>
					<Typography.Title className={styles.title} level={2}>
						Удалить задачу?
					</Typography.Title>
					<Typography.Paragraph className={styles.text}>
						{task.title} будет удалена из текущего списка.
					</Typography.Paragraph>
					<div className={styles.actions}>
						<Button onClick={handleClose}>Отмена</Button>
						<Button danger type='primary' onClick={handleDelete}>
							Удалить
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}
