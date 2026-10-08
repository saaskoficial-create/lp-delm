import { describe, expect, it } from 'vitest'
import { caretAfterDigits, formatPhone } from '../src/lib/phone-mask'
import { leadSchema } from '../src/lib/lead-schema'

describe('WhatsApp mask', () => {
  it.each([
    ['', ''],
    ['1', '(1'],
    ['11', '(11'],
    ['119', '(11) 9'],
    ['1133334444', '(11) 3333-4444'],
    ['11999999999', '(11) 99999-9999'],
    ['(11) 99999-99999', '(11) 99999-9999'],
    ['11 9 9999 9999', '(11) 99999-9999'],
    ['+', '+'],
    ['+5', '+5'],
    ['+55 11 99999-9999', '+55 (11) 99999-9999'],
    ['5511999999999', '+55 (11) 99999-9999'],
    ['+1 212 555 1234', '+12125551234'],
    ['+351912345678', '+351912345678'],
  ])('formats %j as %j', (input, expected) => {
    expect(formatPhone(input)).toBe(expected)
  })

  it('is stable when reapplied', () => {
    for (const value of ['(11) 99999-9999', '(11) 3333-4444', '+55 (11) 99999-9999', '+12125551234']) expect(formatPhone(value)).toBe(value)
  })

  it('produces complete numbers the lead schema accepts', () => {
    for (const value of ['11999999999', '1133334444', '+5511999999999', '+12125551234']) {
      expect(leadSchema.shape.whatsapp.safeParse(formatPhone(value)).success).toBe(true)
    }
  })

  it('keeps the caret after the same digit', () => {
    expect(caretAfterDigits('(11) 99999-9999', 0)).toBe(1)
    expect(caretAfterDigits('(11) 99999-9999', 2)).toBe(3)
    expect(caretAfterDigits('(11) 99999-9999', 3)).toBe(6)
    expect(caretAfterDigits('(11) 99999-9999', 8)).toBe(12)
    expect(caretAfterDigits('(11) 99999-9999', 20)).toBe(15)
  })
})
