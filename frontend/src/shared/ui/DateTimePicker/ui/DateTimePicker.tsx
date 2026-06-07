import { Button } from '@/shared/ui/Button'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Popover, TimePicker } from 'antd'
import clsx from 'clsx'
import { format, isSameDay } from 'date-fns'
import { ru as dateFnsRu } from 'date-fns/locale'
import dayjs from 'dayjs'
import { useState, type FC } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import styles from './DateTimePicker.module.css'

export interface IDateRangeValue {
	from?: string
	to?: string
}

interface IDateTimePicker {
	className?: string
	label?: string
	mode?: 'single' | 'range'
	value?: string
	rangeValue?: IDateRangeValue
	placeholder?: string
	onChange?: (value: string) => void
	onRangeChange?: (value: IDateRangeValue) => void
	withTime?: boolean
	defaultTime?: string
	disablePast?: boolean
}

export const DateTimePicker: FC<IDateTimePicker> = ({
	className,
	defaultTime = '09:00',
	disablePast = true,
	label,
	mode = 'single',
	onChange,
	onRangeChange,
	placeholder,
	rangeValue,
	value,
	withTime = true,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
	const [draftRange, setDraftRange] = useState<DateRange>()
	const isRangeMode = mode === 'range'
	const currentDate = value ? new Date(value) : undefined
	const currentRange: DateRange | undefined = rangeValue
		? {
				from: rangeValue.from ? new Date(rangeValue.from) : undefined,
				to: rangeValue.to ? new Date(rangeValue.to) : undefined,
			}
		: undefined
	const today = new Date()

	today.setHours(0, 0, 0, 0)

	const handleDateSelect = (date?: Date) => {
		if (!date) return

		const nextDate = new Date(date)
		const oldDate = currentDate ?? dayjs(defaultTime, 'HH:mm').toDate()

		if (withTime) {
			nextDate.setHours(oldDate.getHours())
			nextDate.setMinutes(oldDate.getMinutes())
		} else {
			nextDate.setHours(0)
			nextDate.setMinutes(0)
		}

		nextDate.setSeconds(0)
		nextDate.setMilliseconds(0)

		onChange?.(nextDate.toISOString())
	}

	const handleRangeSelect = (range?: DateRange) => {
		const nextFrom = range?.from ? new Date(range.from) : undefined
		const nextTo = range?.to ? new Date(range.to) : undefined

		nextFrom?.setHours(0, 0, 0, 0)
		nextTo?.setHours(0, 0, 0, 0)

		setDraftRange({
			from: nextFrom,
			to: nextTo,
		})
	}

	const handleRangeApply = () => {
		if (!draftRange?.from) return

		const nextFrom = new Date(draftRange.from)
		const nextTo = new Date(draftRange.to ?? draftRange.from)

		nextFrom.setHours(0, 0, 0, 0)
		nextTo.setHours(0, 0, 0, 0)

		onRangeChange?.({
			from: nextFrom.toISOString(),
			to: nextTo.toISOString(),
		})
		setIsOpen(false)
	}

	const handleRangeCancel = () => {
		setDraftRange(currentRange)
		setIsOpen(false)
	}

	const handleTimeChange = (time: dayjs.Dayjs | null) => {
		if (!time) return

		const nextDate = currentDate ? new Date(currentDate) : new Date()

		nextDate.setHours(time.hour())
		nextDate.setMinutes(time.minute())
		nextDate.setSeconds(0)
		nextDate.setMilliseconds(0)

		onChange?.(nextDate.toISOString())
	}

	const handleTimeCalendarChange = (
		time: dayjs.Dayjs | dayjs.Dayjs[] | null,
	) => {
		if (!time || Array.isArray(time)) return

		handleTimeChange(time)
	}

	const handlePickerOpenChange = (nextOpen: boolean) => {
		if (isRangeMode && nextOpen) {
			setDraftRange(currentRange)
		}

		setIsOpen(nextOpen)

		if (!nextOpen) {
			setIsTimePickerOpen(false)
		}
	}

	const handleDone = () => {
		setIsTimePickerOpen(false)
	}

	const displaySingleValue = currentDate
		? format(currentDate, withTime ? 'd MMMM yyyy, HH:mm' : 'd MMMM yyyy', {
				locale: dateFnsRu,
			})
		: (placeholder ?? 'Выберите дату')
	const displayRangeValue =
		currentRange?.from && currentRange.to
			? isSameDay(currentRange.from, currentRange.to)
				? format(currentRange.from, 'd MMMM yyyy', { locale: dateFnsRu })
				: `${format(currentRange.from, 'd MMMM yyyy', { locale: dateFnsRu })} - ${format(currentRange.to, 'd MMMM yyyy', { locale: dateFnsRu })}`
			: currentRange?.from
				? `${format(currentRange.from, 'd MMMM yyyy', { locale: dateFnsRu })} - выберите конец`
				: (placeholder ?? 'Выберите период')
	const displayValue = isRangeMode ? displayRangeValue : displaySingleValue
	const selectedRange = isRangeMode && isOpen ? draftRange : currentRange

	const calendarClassNames = {
		months: styles.months,
		month: styles.month,
		caption_label: styles.captionLabel,
		nav: styles.nav,
		button_previous: styles.navButton,
		button_next: styles.navButton,
		weekdays: styles.weekdays,
		weekday: styles.weekday,
		weeks: styles.weeks,
		week: styles.week,
		day: styles.day,
		day_button: styles.dayButton,
		selected: styles.selected,
		today: styles.today,
		outside: styles.outside,
		disabled: styles.disabled,
		range_start: styles.rangeStart,
		range_middle: styles.rangeMiddle,
		range_end: styles.rangeEnd,
	}

	const calendar = isRangeMode ? (
		<DayPicker
			mode='range'
			selected={selectedRange}
			onSelect={handleRangeSelect}
			locale={ru}
			weekStartsOn={1}
			disabled={disablePast ? { before: today } : undefined}
			showOutsideDays
			className={styles.calendar}
			classNames={calendarClassNames}
		/>
	) : (
		<DayPicker
			mode='single'
			selected={currentDate}
			onSelect={handleDateSelect}
			locale={ru}
			weekStartsOn={1}
			disabled={disablePast ? { before: today } : undefined}
			showOutsideDays
			className={styles.calendar}
			classNames={calendarClassNames}
		/>
	)

	const pickerContent = (
		<div className={styles.panel}>
			<div className={styles.calendarWrapper}>{calendar}</div>

			{withTime && !isRangeMode && (
				<div className={styles.footer}>
					<TimePicker
						format='HH:mm'
						minuteStep={1}
						value={
							currentDate ? dayjs(currentDate) : dayjs(defaultTime, 'HH:mm')
						}
						onChange={handleTimeChange}
						className={styles.timePicker}
						classNames={{
							popup: {
								root: styles.timePickerPopup,
							},
						}}
						getPopupContainer={triggerNode =>
							triggerNode.parentElement ?? document.body
						}
						needConfirm
						onCalendarChange={handleTimeCalendarChange}
						onOk={handleDone}
						open={isTimePickerOpen}
						onOpenChange={setIsTimePickerOpen}
						placeholder='Выберите время'
						size='large'
					/>
				</div>
			)}

			{isRangeMode && (
				<div className={styles.rangeFooter}>
					<Button htmlType='button' onClick={handleRangeCancel}>
						Отмена
					</Button>
					<Button
						disabled={!draftRange?.from}
						htmlType='button'
						type='primary'
						onClick={handleRangeApply}
					>
						Применить
					</Button>
				</div>
			)}
		</div>
	)

	return (
		<div className={clsx(styles.field, className)}>
			{label && <label className={styles.label}>{label}</label>}

			<Popover
				arrow={false}
				classNames={{ root: styles.popover }}
				content={pickerContent}
				destroyOnHidden
				onOpenChange={handlePickerOpenChange}
				open={isOpen}
				placement='bottomLeft'
				trigger='click'
			>
				<Button
					className={styles.trigger}
					htmlType='button'
					icon={<CalendarOutlined />}
				>
					<span className={styles.value}>{displayValue}</span>
					{withTime && !isRangeMode ? <ClockCircleOutlined /> : null}
				</Button>
			</Popover>
		</div>
	)
}
