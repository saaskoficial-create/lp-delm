const brazilDigits = 11
const internationalDigits = 15

function formatBrazilian(digits: string) {
  const value = digits.slice(0, brazilDigits)
  if (value.length <= 2) return value && `(${value}`
  const local = value.slice(2)
  // Landlines use 4+4 digits; mobiles switch to 5+4 once the 9th local digit arrives.
  const split = local.length > 8 ? 5 : 4
  return `(${value.slice(0, 2)}) ${local.slice(0, split)}${local.length > split ? `-${local.slice(split)}` : ''}`
}

function formatInternational(digits: string) {
  const value = digits.slice(0, internationalDigits)
  if (value.startsWith('55') && value.length > 2) return `+55 ${formatBrazilian(value.slice(2))}`
  return `+${value}`
}

// Brazilian numbers get (DD) 99999-9999; a leading + keeps room for other countries.
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (value.trimStart().startsWith('+')) return formatInternational(digits)
  // Pasted or autofilled numbers like 5511999999999 carry the country code without +.
  if (!value.includes('(') && digits.startsWith('55') && digits.length > brazilDigits && digits.length <= 13) return formatInternational(digits)
  return formatBrazilian(digits)
}

// Keeps the caret after the same digit it followed before the mask added symbols.
export function caretAfterDigits(formatted: string, digitCount: number) {
  if (digitCount === 0) return /^[+(]/.test(formatted) ? 1 : 0
  let seen = 0
  for (let index = 0; index < formatted.length; index++) {
    if (/\d/.test(formatted[index]!) && ++seen === digitCount) return index + 1
  }
  return formatted.length
}
