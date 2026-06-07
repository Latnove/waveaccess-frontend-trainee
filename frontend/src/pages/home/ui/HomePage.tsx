import {
	TaskOverviewPanel,
	useUpcomingTaskOverview,
} from '@/features/task-overview'
import { HomeHero } from '@/widgets/home-hero'
import styles from './HomePage.module.css'

export const HomePage = () => {
	const {
		activeTasksCount,
		deleteTask,
		highPriorityCount,
		isTaskExists,
		list,
		totalTasksCount,
		updateTask,
	} = useUpcomingTaskOverview()

	return (
		<main className={styles.page}>
			<HomeHero
				activeTasksCount={activeTasksCount}
				highPriorityCount={highPriorityCount}
				totalTasksCount={totalTasksCount}
			/>

			<TaskOverviewPanel
				counter={`${list.tasks.length} из ${list.filteredCount}`}
				emptyDescription='Ближайших задач нет'
				hasMore={list.hasMore}
				sortMode={list.sortMode}
				tasks={list.tasks}
				title='Ближайшие задачи'
				onLoadMore={list.loadMore}
				onSortModeChange={list.setSortMode}
				onTaskDelete={deleteTask}
				onTaskExists={isTaskExists}
				onTaskUpdate={updateTask}
			/>
		</main>
	)
}
