import type { Task } from '@/entities/task'
import { Modal, Typography } from 'antd'
import type { FC } from 'react'
import { TaskEditForm } from './TaskEditForm'
import styles from './TaskEditModal.module.css'

interface ITaskEditModal {
	open: boolean
	task: Task
	onCancel: () => void
	onSave: (task: Task) => void
}

export const TaskEditModal: FC<ITaskEditModal> = ({
	onCancel,
	onSave,
	open,
	task,
}) => {
	return (
		<Modal
			centered
			footer={null}
			open={open}
			title={null}
			width={560}
			onCancel={onCancel}
		>
			<div className={styles.modal}>
				<Typography.Title className={styles.title} level={2}>
					Редактирование задачи
				</Typography.Title>
				<TaskEditForm task={task} onCancel={onCancel} onSave={onSave} />
			</div>
		</Modal>
	)
}
