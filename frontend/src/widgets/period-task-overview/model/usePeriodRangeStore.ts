import { addDays } from 'date-fns'
import { create } from 'zustand'
import type { IDateRangeValue } from '@/shared/ui/DateTimePicker'

interface IPeriodRangeStore {
	range: IDateRangeValue
	setRange: (range: IDateRangeValue) => void
}

const getStartOfDay = (date: Date) => {
	const nextDate = new Date(date)

	nextDate.setHours(0, 0, 0, 0)

	return nextDate
}

const getDefaultRange = (): IDateRangeValue => {
	const from = getStartOfDay(new Date())
	const to = getStartOfDay(addDays(from, 6))

	return {
		from: from.toISOString(),
		to: to.toISOString(),
	}
}

export const usePeriodRangeStore = create<IPeriodRangeStore>(set => ({
	range: getDefaultRange(),
	setRange: range => set({ range }),
}))
