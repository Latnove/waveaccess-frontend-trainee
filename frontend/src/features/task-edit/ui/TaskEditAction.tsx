import { EditOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import type { FC } from 'react'
import { useState } from 'react'
import type { Task } from '@/entities/task'
import { Button } from '@/shared/ui/Button'
import { TooltipTrigger } from '@/shared/ui/TooltipTrigger'
import { TaskEditModal } from './TaskEditModal'

interface ITaskEditAction {
	task: Task
	isTaskExists: (taskId: string) => boolean
	onSave: (task: Task) => void | Promise<void>
}

export const TaskEditAction: FC<ITaskEditAction> = ({
	isTaskExists,
	onSave,
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

	const handleSave = async (updatedTask: Task) => {
		if (!isTaskExists(updatedTask.id)) {
			notifyTaskNotFound()
			handleClose()
			return
		}

		try {
			await onSave(updatedTask)
			notification.success({
				message: 'Задача обновлена',
			})
			handleClose()
		} catch {
			notification.error({
				message: 'Не удалось обновить задачу',
				description: 'Проверьте соединение с сервером и попробуйте снова.',
			})
		}
	}

	return (
		<>
			<TooltipTrigger title='Редактировать'>
				<Button
					aria-label='Редактировать задачу'
					icon={<EditOutlined />}
					shape='circle'
					onClick={handleOpen}
				/>
			</TooltipTrigger>

			<TaskEditModal
				open={isOpen}
				task={task}
				onCancel={handleClose}
				onSave={handleSave}
			/>
		</>
	)
}
