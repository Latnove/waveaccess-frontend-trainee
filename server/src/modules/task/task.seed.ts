import { taskRepository } from './task.repository.js'
import type { TaskCreateRequest } from './task.types.js'

const getDate = (dayOffset: number, hour: number, minute = 0) => {
	const date = new Date()

	date.setDate(date.getDate() + dayOffset)
	date.setHours(hour, minute, 0, 0)

	return date.toISOString()
}

export const getTaskSeed = (): TaskCreateRequest[] => [
	{
		title: 'Реализовать авторизацию через JWT',
		description:
			'Добавить access и refresh токены, настроить защищённые маршруты.',
		startAt: getDate(0, 9, 15),
		priority: 'high',
		status: 'in_progress',
	},
	{
		title: 'Покрыть сервис задач unit-тестами',
		description: 'Написать тесты для создания, обновления и удаления задач.',
		startAt: getDate(1, 11, 0),
		priority: 'high',
		status: 'todo',
	},
	{
		title: 'Настроить CI/CD для проекта',
		description:
			'Добавить автоматическую сборку и запуск тестов через GitHub Actions.',
		startAt: getDate(2, 14, 30),
		priority: 'high',
		status: 'todo',
	},
	{
		title: 'Оптимизировать SQL-запросы',
		description:
			'Проверить индексы и сократить количество обращений к базе данных.',
		startAt: getDate(3, 10, 45),
		priority: 'medium',
		status: 'todo',
	},
	{
		title: 'Разработать страницу аналитики',
		description:
			'Добавить графики активности пользователей и статистику задач.',
		startAt: getDate(4, 16, 0),
		priority: 'medium',
		status: 'todo',
	},
	{
		title: 'Провести code review',
		description: 'Проверить pull request команды и оставить рекомендации.',
		startAt: getDate(5, 13, 20),
		priority: 'low',
		status: 'todo',
	},
	{
		title: 'Исправить баг с фильтрацией задач',
		description:
			'Устранить проблему некорректного отображения результатов после поиска.',
		startAt: getDate(-2, 15, 40),
		priority: 'high',
		status: 'done',
	},
	{
		title: 'Подготовить документацию API',
		description: 'Описать эндпоинты, параметры запросов и примеры ответов.',
		startAt: getDate(6, 12, 10),
		priority: 'medium',
		status: 'todo',
	},
	{
		title: 'Мигрировать проект на React 19',
		description: 'Обновить зависимости и проверить совместимость компонентов.',
		startAt: getDate(8, 11, 30),
		priority: 'medium',
		status: 'todo',
	},
	{
		title: 'Настроить мониторинг ошибок',
		description:
			'Подключить Sentry и настроить уведомления о критических ошибках.',
		startAt: getDate(10, 17, 15),
		priority: 'high',
		status: 'todo',
	},
	{
		title: 'Рефакторинг формы создания задачи',
		description: 'Упростить логику компонентов и вынести общие хуки.',
		startAt: getDate(12, 9, 45),
		priority: 'low',
		status: 'todo',
	},
	{
		title: 'Подготовить демо для заказчика',
		description: 'Проверить основные сценарии и собрать обратную связь.',
		startAt: getDate(14, 15, 0),
		priority: 'high',
		status: 'todo',
	},
]

export const seedTasks = async () => {
	await taskRepository.clear()

	for (const task of getTaskSeed()) {
		await taskRepository.create(task)
	}
}
