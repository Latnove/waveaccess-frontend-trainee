import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TaskCreateForm } from './TaskCreateForm'

afterEach(() => {
	cleanup()
})

globalThis.ResizeObserver = class {
	observe = vi.fn()
	unobserve = vi.fn()
	disconnect = vi.fn()
}

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

const renderTaskCreateForm = () =>
	render(
		<MemoryRouter>
			<TaskCreateForm />
		</MemoryRouter>,
	)

describe('TaskCreateForm', () => {
	it('не разрешает создать задачу без корректного названия', async () => {
		const user = userEvent.setup()

		renderTaskCreateForm()

		const titleInput = screen.getByLabelText('Название')
		const submitButton = screen.getByRole('button', { name: 'Создать' })

		expect(submitButton).toBeDisabled()

		await user.type(titleInput, 'ab')
		await user.tab()

		expect(await screen.findByText('Минимум 3 символа')).toBeInTheDocument()
		expect(submitButton).toBeDisabled()
	})

	it('разрешает отправку после заполнения обязательных данных', async () => {
		const user = userEvent.setup()

		renderTaskCreateForm()

		const titleInput = screen.getByLabelText('Название')
		const submitButton = screen.getByRole('button', { name: 'Создать' })

		await user.type(titleInput, 'Собрать MVP')
		await user.tab()

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled()
		})

		expect(titleInput).toHaveValue('Собрать MVP')
	})
})
