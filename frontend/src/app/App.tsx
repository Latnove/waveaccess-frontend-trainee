import 'react-day-picker/style.css'
import { ThemeProvider } from './providers/theme'
import { AppRouter } from './router'
import './styles/index.css'

export const App = () => (
	<ThemeProvider>
		<AppRouter />
	</ThemeProvider>
)
