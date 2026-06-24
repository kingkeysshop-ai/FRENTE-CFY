import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Table, Badge, toast } from "@medusajs/ui"
import { useState } from "react"

type TestResult = {
  success: boolean
  order: {
    id: string
    email: string
    status: string
    payment_status: string
    currency_code: string
    total: number
    subtotal: number
    items: Array<{
      id: string
      title: string
      product_id: string
      quantity: number
      unit_price: number
    }>
  }
  license_keys: Array<{
    id: string
    key: string
    product_id: string
    status: string
    delivery_status: string
    delivery_error: string | null
    customer_email: string | null
  }>
  summary: {
    total: number
    assigned: number
    available: number
    revoked: number
    sent: number
    failed: number
    pending: number
  }
  flow: {
    order_created: boolean
    payment_captured: boolean
    subscriber_fired: boolean
    license_assigned: boolean
    email_sent: boolean
    email_failed: boolean
    email_pending: boolean
  }
}

const api = {
  async get(path: string) {
    const res = await fetch(path, { credentials: "include" })
    if (!res.ok) throw new Error((await res.json()).message || "Request failed")
    return res.json()
  },
  async post(path: string, body?: any) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error((await res.json()).message || (await res.json()).error || "Request failed")
    return res.json()
  },
}

const CheckIcon = () => (
  <span className="text-green-500 font-bold mr-2">✓</span>
)
const CrossIcon = () => (
  <span className="text-red-500 font-bold mr-2">✗</span>
)
const ClockIcon = () => (
  <span className="text-yellow-500 font-bold mr-2">⏳</span>
)

const TestLicensePage = () => {
  const [cartId, setCartId] = useState("")
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState("")

  const handleTest = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const payload: any = {}
      if (orderId.trim()) payload.order_id = orderId.trim()
      else if (cartId.trim()) payload.cart_id = cartId.trim()
      else {
        setError("Ingresa un cart_id o order_id")
        setLoading(false)
        return
      }
      const res = await api.post("/admin/test-license-flow", payload)
      setResult(res)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  const flowSteps = result ? [
    { label: "Orden creada", ok: result.flow.order_created },
    { label: "Pago capturado", ok: result.flow.payment_captured },
    { label: "Subscriber disparado", ok: result.flow.subscriber_fired },
    { label: "Licencias asignadas", ok: result.flow.license_assigned },
    { label: "Email enviado", ok: result.flow.email_sent },
    { label: "Email fallido", ok: result.flow.email_failed, bad: true },
    { label: "Email pendiente", ok: result.flow.email_pending, warn: true },
  ] : []

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Test de Licencias</Heading>
          <Text className="text-gray-400 mt-1">
            Prueba el flujo completo: pago → licencia → email
          </Text>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <Text className="text-sm text-gray-400 mb-4">
          Ingresa un order_id para probar una orden existente.
        </Text>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Order ID</label>
            <Input
              placeholder="order_xxx"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleTest} disabled={loading || !orderId.trim()}>
            {loading ? "Ejecutando prueba..." : "Ejecutar Test de Flujo"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
          <Text className="text-red-400 text-sm">{error}</Text>
        </div>
      )}

      {result && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <Heading level="h2" className="mb-4">Flujo de pago → licencia</Heading>
            <div className="space-y-2">
              {flowSteps.map((step) => (
                <div key={step.label} className="flex items-center">
                  {step.ok && step.bad ? <CrossIcon /> : step.ok && step.warn ? <ClockIcon /> : step.ok ? <CheckIcon /> : <CrossIcon />}
                  <Text className={step.ok && step.bad ? "text-red-400" : step.ok && step.warn ? "text-yellow-400" : step.ok ? "text-green-400" : "text-red-400"}>
                    {step.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <Heading level="h2" className="mb-4">Orden</Heading>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Text className="text-gray-500">ID:</Text>
              <code className="text-xs">{result.order.id}</code>
              <Text className="text-gray-500">Email:</Text>
              <Text>{result.order.email}</Text>
              <Text className="text-gray-500">Estado:</Text>
              <Badge color={result.order.status === "completed" ? "green" : "orange"}>{result.order.status}</Badge>
              <Text className="text-gray-500">Pago:</Text>
              <Badge color={result.order.payment_status === "captured" ? "green" : "red"}>{result.order.payment_status}</Badge>
              <Text className="text-gray-500">Total:</Text>
              <Text>{(result.order.total / 100).toFixed(2)} {result.order.currency_code?.toUpperCase()}</Text>
            </div>

            {result.order.items?.length > 0 && (
              <>
                <Text className="text-gray-400 text-sm mt-4 mb-2">Items:</Text>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Producto</Table.HeaderCell>
                      <Table.HeaderCell>Cant</Table.HeaderCell>
                      <Table.HeaderCell>Precio</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {result.order.items.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell><Text className="text-sm">{item.title}</Text></Table.Cell>
                        <Table.Cell><Text>{item.quantity}</Text></Table.Cell>
                        <Table.Cell><Text>{(item.unit_price / 100).toFixed(2)}</Text></Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <Heading level="h2" className="mb-4">
              Licencias ({result.license_keys.length})
              <span className="text-sm text-gray-500 ml-2">
                {result.summary.sent} enviadas · {result.summary.failed} fallidas · {result.summary.pending} pendientes
              </span>
            </Heading>

            {result.license_keys.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Text>No se encontraron licencias para esta orden.</Text>
                <Text className="text-sm mt-2">
                  Asegúrate de que los productos tengan metadata.is_digital = true y que haya keys disponibles.
                </Text>
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Key</Table.HeaderCell>
                    <Table.HeaderCell>Producto</Table.HeaderCell>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell>Delivery</Table.HeaderCell>
                    <Table.HeaderCell>Error</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {result.license_keys.map((lk) => (
                    <Table.Row key={lk.id}>
                      <Table.Cell>
                        <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono">
                          {lk.key?.slice(0, 25)}...
                        </code>
                      </Table.Cell>
                      <Table.Cell><code className="text-xs">{lk.product_id?.slice(0, 20)}</code></Table.Cell>
                      <Table.Cell>
                        <Badge color={lk.status === "assigned" ? "green" : lk.status === "revoked" ? "red" : "orange"}>
                          {lk.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={lk.delivery_status === "sent" ? "green" : lk.delivery_status === "failed" ? "red" : "orange"}>
                          {lk.delivery_status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-xs text-red-400 max-w-[200px] truncate">
                          {lk.delivery_error || "—"}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Test Licencias",
})

export default TestLicensePage
