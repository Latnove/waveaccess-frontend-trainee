import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import {
	CalendarOutlined,
	CheckCircleOutlined,
	PlusOutlined,
	ScheduleOutlined,
} from '@ant-design/icons'
import { Layout } from 'antd'
import clsx from 'clsx'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styles from './AppLayout.module.css'

const navItems = [
	{ to: ROUTES.home, label: 'Обзор', icon: <CheckCircleOutlined /> },
	{ to: ROUTES.daySchedule, label: 'День', icon: <CalendarOutlined /> },
	{ to: ROUTES.periodSchedule, label: 'Период', icon: <ScheduleOutlined /> },
]

export const AppLayout = () => {
	const navigate = useNavigate()

	return (
		<Layout className={styles.layout}>
			<header className={styles.header}>
				<div className={styles.container}>
					<NavLink className={styles.brand} to={ROUTES.home}>
						<span className={styles.brandMark}>
							<CheckCircleOutlined />
						</span>
						<span>
							<b>Todo WaveAccess</b>
							<small>Task manager</small>
						</span>
					</NavLink>

					<nav className={styles.nav} aria-label='Основная навигация'>
						{navItems.map(item => (
							<NavLink
								key={item.label}
								className={({ isActive }) =>
									clsx(styles.navLink, isActive && styles.navLinkActive)
								}
								to={item.to}
							>
								{item.icon}
								{item.label}
							</NavLink>
						))}
					</nav>

					<Button
						icon={<PlusOutlined />}
						type='primary'
						onClick={() => navigate(ROUTES.taskCreate)}
					>
						Новая задача
					</Button>
				</div>
			</header>

			<Layout.Content className={styles.content}>
				<Outlet />
			</Layout.Content>
		</Layout>
	)
}
