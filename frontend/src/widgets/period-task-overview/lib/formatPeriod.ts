import { format, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatPeriod = (from?: string, to?: string) => {
	if (!from || !to) return 'Выберите даты, чтобы увидеть задачи'

	if (isSameDay(new Date(from), new Date(to))) {
		return format(new Date(from), 'd MMMM yyyy', { locale: ru })
	}

	return `${format(new Date(from), 'd MMMM yyyy', { locale: ru })} - ${format(new Date(to), 'd MMMM yyyy', { locale: ru })}`
}
