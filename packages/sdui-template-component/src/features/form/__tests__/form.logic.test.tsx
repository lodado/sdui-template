import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { z } from 'zod'

import { Form } from '../Form'

describe('Form - Logic Tests', () => {
  describe('as is: Form with zod schema validation', () => {
    describe('when: user submits form with invalid data', () => {
      it('to be: validation errors displayed, onSubmit not called', async () => {
        const user = userEvent.setup()
        const handleSubmit = jest.fn()

        const schema = z.object({
          email: z.string().email('올바른 이메일을 입력해주세요'),
          password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
        })

        render(
          <Form schema={schema} onSubmit={handleSubmit}>
            <Form.Field name="email" label="이메일" data-testid="email-field" />
            <Form.Field name="password" label="비밀번호" type="password" data-testid="password-field" />
            <button type="submit" data-testid="submit-button">
              제출
            </button>
          </Form>,
        )

        const emailInput = screen.getByLabelText('이메일')
        const passwordInput = screen.getByLabelText('비밀번호')
        const submitButton = screen.getByTestId('submit-button')

        await user.type(emailInput, 'invalid-email')
        await user.type(passwordInput, '123')
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('올바른 이메일을 입력해주세요')).toBeInTheDocument()
          expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다')).toBeInTheDocument()
        })

        expect(handleSubmit).not.toHaveBeenCalled()
      })
    })

    describe('when: user submits form with valid data', () => {
      it('to be: onSubmit called with form data', async () => {
        const user = userEvent.setup()
        const handleSubmit = jest.fn()

        const schema = z.object({
          email: z.string().email('올바른 이메일을 입력해주세요'),
          password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
        })

        render(
          <Form schema={schema} onSubmit={handleSubmit}>
            <Form.Field name="email" label="이메일" />
            <Form.Field name="password" label="비밀번호" type="password" />
            <button type="submit" data-testid="submit-button">
              제출
            </button>
          </Form>,
        )

        const emailInput = screen.getByLabelText('이메일')
        const passwordInput = screen.getByLabelText('비밀번호')
        const submitButton = screen.getByTestId('submit-button')

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.click(submitButton)

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
          })
        })
      })
    })
  })

  describe('as is: Form without schema', () => {
    describe('when: user submits form', () => {
      it('to be: onSubmit called without validation', async () => {
        const user = userEvent.setup()
        const handleSubmit = jest.fn()

        render(
          <Form onSubmit={handleSubmit}>
            <Form.Field name="email" label="이메일" />
            <Form.Field name="password" label="비밀번호" type="password" />
            <button type="submit" data-testid="submit-button">
              제출
            </button>
          </Form>,
        )

        const emailInput = screen.getByLabelText('이메일')
        const passwordInput = screen.getByLabelText('비밀번호')
        const submitButton = screen.getByTestId('submit-button')

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, '123')
        await user.click(submitButton)

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: '123',
          })
        })
      })
    })
  })

  describe('as is: FormField with label', () => {
    describe('when: component renders', () => {
      it('to be: label displayed and connected to input', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" />
          </Form>,
        )

        const label = screen.getByText('이메일')
        const input = screen.getByLabelText('이메일')

        expect(label).toBeInTheDocument()
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('aria-labelledby', expect.stringContaining('label'))
      })
    })
  })

  describe('as is: FormField with required prop', () => {
    describe('when: required=true', () => {
      it('to be: required indicator displayed, aria-required set', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" required />
          </Form>,
        )

        const label = screen.getByText('이메일')
        // getByLabelText matches by label textContent, so include the required indicator (*) for exact matching
        // Alternatively, you can query by role
        const input = screen.getByRole('textbox', { name: /이메일/ })

        expect(label).toHaveTextContent('이메일*')
        expect(input).toHaveAttribute('aria-required', 'true')
        expect(input).toHaveAttribute('required')
      })
    })
  })

  describe('as is: FormField with helpMessage', () => {
    describe('when: helpMessage provided and no error', () => {
      it('to be: help message displayed', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" helpMessage="이메일 주소를 입력해주세요" />
          </Form>,
        )

        expect(screen.getByText('이메일 주소를 입력해주세요')).toBeInTheDocument()
      })
    })
  })

  describe('as is: FormField with error state', () => {
    describe('when: validation fails', () => {
      it('to be: error message displayed, helpMessage hidden', async () => {
        const user = userEvent.setup()

        const schema = z.object({
          email: z.string().email('올바른 이메일을 입력해주세요'),
        })

        render(
          <Form schema={schema} onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" helpMessage="도움말 메시지" />
            <button type="submit">제출</button>
          </Form>,
        )

        const input = screen.getByLabelText('이메일')
        const submitButton = screen.getByRole('button', { name: '제출' })

        await user.type(input, 'invalid')
        await user.click(submitButton)

        await waitFor(() => {
          expect(screen.getByText('올바른 이메일을 입력해주세요')).toBeInTheDocument()
          expect(screen.queryByText('도움말 메시지')).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: FormField with disabled state', () => {
    describe('when: disabled=true', () => {
      it('to be: input disabled, not editable', async () => {
        const user = userEvent.setup()

        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" disabled />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')

        expect(input).toBeDisabled()
        expect(input).toHaveAttribute('tabIndex', '-1')

        await user.type(input, 'test')

        expect(input).toHaveValue('')
      })
    })
  })

  describe('as is: FormField with type prop', () => {
    describe('when: type="password"', () => {
      it('to be: password input type applied', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="password" label="비밀번호" type="password" />
          </Form>,
        )

        const input = screen.getByLabelText('비밀번호')
        expect(input).toHaveAttribute('type', 'password')
      })
    })

    describe('when: type="email"', () => {
      it('to be: email input type applied', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" type="email" />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')
        expect(input).toHaveAttribute('type', 'email')
      })
    })
  })

  describe('as is: FormField with placeholder', () => {
    describe('when: placeholder provided', () => {
      it('to be: placeholder displayed', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" placeholder="example@email.com" />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')
        expect(input).toHaveAttribute('placeholder', 'example@email.com')
      })
    })
  })

  describe('as is: FormField with inputProps', () => {
    describe('when: inputProps provided', () => {
      it('to be: inputProps applied to input', () => {
        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field
              name="email"
              label="이메일"
              inputProps={{
                maxLength: 50,
                autocomplete: 'email',
              }}
            />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')
        expect(input).toHaveAttribute('maxLength', '50')
        expect(input).toHaveAttribute('autoComplete', 'email')
      })
    })
  })

  describe('as is: Form with async onSubmit', () => {
    describe('when: onSubmit is async function', () => {
      it('to be: form waits for async operation', async () => {
        const user = userEvent.setup()
        const handleSubmit = jest.fn().mockResolvedValue(undefined)

        const schema = z.object({
          email: z.string().email('올바른 이메일을 입력해주세요'),
        })

        render(
          <Form schema={schema} onSubmit={handleSubmit}>
            <Form.Field name="email" label="이메일" />
            <button type="submit" data-testid="submit-button">
              제출
            </button>
          </Form>,
        )

        const emailInput = screen.getByLabelText('이메일')
        const submitButton = screen.getByTestId('submit-button')

        await user.type(emailInput, 'test@example.com')
        await user.click(submitButton)

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('as is: FormField value updates', () => {
    describe('when: user types in input', () => {
      it('to be: value updates correctly', async () => {
        const user = userEvent.setup()

        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')

        await user.type(input, 'test@example.com')

        expect(input).toHaveValue('test@example.com')
      })
    })
  })

  describe('as is: FormField with custom inputProps onChange', () => {
    describe('when: inputProps.onChange provided', () => {
      it('to be: both form onChange and custom onChange called', async () => {
        const user = userEvent.setup()
        const customOnChange = jest.fn()

        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" inputProps={{ onChange: customOnChange }} />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')

        await user.type(input, 't')

        expect(customOnChange).toHaveBeenCalled()
        expect(input).toHaveValue('t')
      })
    })
  })

  describe('as is: FormField with custom inputProps onBlur', () => {
    describe('when: inputProps.onBlur provided', () => {
      it('to be: both form onBlur and custom onBlur called', async () => {
        const user = userEvent.setup()
        const customOnBlur = jest.fn()

        render(
          <Form onSubmit={jest.fn()}>
            <Form.Field name="email" label="이메일" inputProps={{ onBlur: customOnBlur }} />
          </Form>,
        )

        const input = screen.getByLabelText('이메일')

        await user.click(input)
        await user.tab()

        expect(customOnBlur).toHaveBeenCalled()
      })
    })
  })

  describe('as is: Form with multiple fields', () => {
    describe('when: form has multiple FormFields', () => {
      it('to be: all fields work independently', async () => {
        const user = userEvent.setup()
        const handleSubmit = jest.fn()

        const schema = z.object({
          email: z.string().email('올바른 이메일을 입력해주세요'),
          password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
          name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
        })

        render(
          <Form schema={schema} onSubmit={handleSubmit}>
            <Form.Field name="email" label="이메일" />
            <Form.Field name="password" label="비밀번호" type="password" />
            <Form.Field name="name" label="이름" />
            <button type="submit">제출</button>
          </Form>,
        )

        const emailInput = screen.getByLabelText('이메일')
        const passwordInput = screen.getByLabelText('비밀번호')
        const nameInput = screen.getByLabelText('이름')

        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'password123')
        await user.type(nameInput, '홍길동')

        expect(emailInput).toHaveValue('test@example.com')
        expect(passwordInput).toHaveValue('password123')
        expect(nameInput).toHaveValue('홍길동')
      })
    })
  })
})
