import {
	taskPriorityLabels,
	taskStatusLabels,
	type Task,
} from '@/entities/task'
import { Button } from '@/shared/ui/Button'
import { DateTimePicker } from '@/shared/ui/DateTimePicker'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	getTaskEditDefaultValues,
	mergeTaskEditValues,
	taskEditSchema,
	type ITaskEditFormValues,
} from '../model/taskEditSchema'
import styles from './TaskEditForm.module.css'

interface ITaskEditForm {
	task: Task
	onCancel: () => void
	onSave: (task: Task) => void | Promise<void>
}

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

export const TaskEditForm: FC<ITaskEditForm> = ({ onCancel, onSave, task }) => {
	const {
		control,
		handleSubmit,
		formState: { isDirty, isSubmitting, isValid },
	} = useForm<ITaskEditFormValues>({
		defaultValues: getTaskEditDefaultValues(task),
		resolver: zodResolver(taskEditSchema),
		mode: 'onBlur',
	})

	const handleSave = handleSubmit(async values => {
		await onSave(mergeTaskEditValues(task, values))
	})

	return (
		<form className={styles.form} onSubmit={handleSave}>
			<InputField control={control} label='Название' name='title' />

			<TextAreaField control={control} label='Описание' name='description' />

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
				<Button htmlType='button' onClick={onCancel}>
					Закрыть
				</Button>

				<Button
					htmlType='submit'
					type='primary'
					disabled={isSubmitting || !isValid || !isDirty}
					loading={isSubmitting}
				>
					Сохранить
				</Button>
			</div>
		</form>
	)
}
