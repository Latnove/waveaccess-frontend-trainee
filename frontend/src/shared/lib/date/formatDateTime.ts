import { format, isToday, isTomorrow } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatTaskDate = (isoDate: string) => {
  const date = new Date(isoDate)

  if (isToday(date)) return `Сегодня, ${format(date, 'HH:mm')}`
  if (isTomorrow(date)) return `Завтра, ${format(date, 'HH:mm')}`

  return format(date, 'd MMMM, HH:mm', { locale: ru })
}
