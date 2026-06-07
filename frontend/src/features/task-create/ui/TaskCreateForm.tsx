import { taskApi, taskPriorityLabels, taskStatusLabels } from '@/entities/task'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { DateTimePicker } from '@/shared/ui/DateTimePicker'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { notification } from 'antd'
import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
	taskCreateSchema,
	type ITaskCreateFormValues,
} from '../model/taskCreateSchema'
import styles from './TaskCreateForm.module.css'

const priorityOptions = Object.entries(taskPriorityLabels).map(
	([value, label]) => ({
		label,
		value,
	}),
)

const statusOptions = Object.entries(taskStatusLabels).map(
	([value, label]) => ({
		label,
		value,
	}),
)

const getDefaultStartAt = () => {
	const startAt = new Date()

	startAt.setHours(9)
	startAt.setMinutes(0)
	startAt.setSeconds(0)
	startAt.setMilliseconds(0)

	return startAt.toISOString()
}

export const TaskCreateForm: FC = () => {
	const navigate = useNavigate()
	const {
		control,
		handleSubmit,
		formState: { isDirty, isSubmitting, isValid },
	} = useForm<ITaskCreateFormValues>({
		defaultValues: {
			title: '',
			description: '',
			startAt: getDefaultStartAt(),
			priority: 'medium',
			status: 'todo',
		},
		mode: 'onBlur',
		resolver: zodResolver(taskCreateSchema),
	})

	const handleCancel = () => {
		navigate(-1)
	}

	const handleCreate = handleSubmit(async values => {
		try {
			await taskApi.createTask({
				...values,
				description: values.description?.trim() || undefined,
				title: values.title.trim(),
			})
			notification.success({
				message: 'Задача создана',
			})
			navigate(ROUTES.home)
		} catch {
			notification.error({
				message: 'Не удалось создать задачу',
				description: 'Проверьте соединение с сервером и попробуйте снова.',
			})
		}
	})

	return (
		<form className={styles.form} onSubmit={handleCreate}>
			<InputField
				control={control}
				label='Название'
				name='title'
				placeholder='Например, собрать MVP'
			/>

			<TextAreaField
				control={control}
				label='Описание'
				name='description'
				placeholder='Короткий контекст задачи'
			/>

			<Controller
				control={control}
				name='startAt'
				render={({ field }) => (
					<DateTimePicker
						className={styles.dateTime}
						label='Дата и время начала'
						value={field.value}
						onChange={field.onChange}
						withTime
					/>
				)}
			/>

			<div className={styles.row}>
				<SelectField
					control={control}
					label='Приоритет'
					name='priority'
					options={priorityOptions}
				/>

				<SelectField
					control={control}
					label='Статус'
					name='status'
					options={statusOptions}
				/>
			</div>

			<div className={styles.actions}>
				<Button htmlType='button' onClick={handleCancel}>
					Отмена
				</Button>
				<Button
					htmlType='submit'
					type='primary'
					disabled={isSubmitting || !isDirty || !isValid}
					loading={isSubmitting}
				>
					Создать
				</Button>
			</div>
		</form>
	)
}
