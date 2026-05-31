import { isEmpty } from "./isEmpty"

const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif",
  "djf", "gnf", "kmf", "mga", "rwf", "xpf", "htg", "vuv",
  "xag", "xdr", "xau",
]

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "es-CO",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const dividedAmount = noDivisionCurrencies.includes(currency_code.toLowerCase())
    ? amount
    : amount / 100

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(dividedAmount)
}
