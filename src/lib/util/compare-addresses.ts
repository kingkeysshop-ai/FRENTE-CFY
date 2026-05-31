const ADDRESS_FIELDS = [
  "first_name",
  "last_name",
  "address_1",
  "company",
  "postal_code",
  "city",
  "country_code",
  "province",
  "phone",
] as const

function pick(obj: any, keys: readonly string[]): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key of keys) {
    if (key in obj) result[key] = obj[key]
  }
  return result
}

export default function compareAddresses(address1: any, address2: any) {
  const a = pick(address1, ADDRESS_FIELDS)
  const b = pick(address2, ADDRESS_FIELDS)
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => a[key] === b[key])
}
