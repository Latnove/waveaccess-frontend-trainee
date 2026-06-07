import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DaySchedulePage } from '@/pages/day-schedule'
import { HomePage } from '@/pages/home'
import { PeriodSchedulePage } from '@/pages/period-schedule'
import { TaskCreatePage } from '@/pages/task-create'
import { ROUTES } from '@/shared/config'
import { AppLayout } from '../ui/AppLayout'

const router = createBrowserRouter([
	{
		path: ROUTES.home,
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: ROUTES.daySchedule,
				element: <DaySchedulePage />,
			},
			{
				path: ROUTES.periodSchedule,
				element: <PeriodSchedulePage />,
			},
			{
				path: ROUTES.taskCreate,
				element: <TaskCreatePage />,
			},
		],
	},
])

export const AppRouter = () => <RouterProvider router={router} />
