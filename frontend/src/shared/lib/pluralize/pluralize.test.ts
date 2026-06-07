import { describe, expect, it } from 'vitest'
import { pluralize } from './pluralize'

const forms = ['задача', 'задачи', 'задач'] as [string, string, string]

describe('pluralize', () => {
	it('выбирает форму единственного числа', () => {
		expect(pluralize(1, forms)).toBe('задача')
		expect(pluralize(21, forms)).toBe('задача')
		expect(pluralize(101, forms)).toBe('задача')
	})

	it('выбирает форму для нескольких элементов', () => {
		expect(pluralize(2, forms)).toBe('задачи')
		expect(pluralize(4, forms)).toBe('задачи')
		expect(pluralize(22, forms)).toBe('задачи')
	})

	it('учитывает исключения от 11 до 14 и форму множества', () => {
		expect(pluralize(5, forms)).toBe('задач')
		expect(pluralize(11, forms)).toBe('задач')
		expect(pluralize(14, forms)).toBe('задач')
		expect(pluralize(25, forms)).toBe('задач')
	})
})
