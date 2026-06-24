import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Table, Badge, Input, Textarea, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"

type LicenseKey = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  order_id: string | null
  customer_email: string | null
}

const api = {
  async get(path: string) {
    const res = await fetch(path, { credentials: "include" })
    if (!res.ok) throw new Error((await res.json()).message || "Request failed")
    return res.json()
  },
  async post(path: string, body: any) {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error((await res.json()).message || "Request failed")
    return res.json()
  },
  async patch(path: string, body: any) {
    const res = await fetch(path, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error((await res.json()).message || "Request failed")
    return res.json()
  },
  async del(path: string) {
    const res = await fetch(path, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) throw new Error((await res.json()).message || "Request failed")
    return res.json()
  },
}

const LicenseKeysPage = () => {
  const [keys, setKeys] = useState<LicenseKey[]>([])
  const [loading, setLoading] = useState(false)
  const [productFilter, setProductFilter] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [newKeys, setNewKeys] = useState("")
  const [newProductId, setNewProductId] = useState("")
  const [creating, setCreating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchKeys = async (productId?: string) => {
    setLoading(true)
    try {
      const pid = productId ?? productFilter
      const data = await api.get(`/admin/license-keys${pid ? `?product_id=${pid}` : ""}`)
      setKeys(data.license_keys || [])
    } catch { setKeys([]) }
    setLoading(false)
  }

  useEffect(() => { fetchKeys() }, [])

  const keyList = newKeys
    .split("\n")
    .flatMap(k => { const t = k.trim(); return t ? [t] : [] })

  const hasUpload = keyList.length > 0 && newProductId.trim().length > 0

  const handleCreate = async () => {
    if (!hasUpload) {
      toast.error("Agrega al menos una clave y un product_id")
      return
    }
    setShowConfirm(false)
    setCreating(true)
    try {
      const res = await api.post("/admin/license-keys", {
        keys: keyList.map(key => ({ key, product_id: newProductId.trim() })),
      })
      toast.success(`${res.created?.length || 0} licencias creadas (${res.skipped?.length || 0} omitidas)`)
      setShowCreate(false)
      setNewKeys("")
      setNewProductId("")
      fetchKeys(newProductId.trim())
    } catch (e: any) {
      toast.error(e.message)
    }
    setCreating(false)
  }

  const handleRevoke = async (id: string) => {
    try {
      await api.patch("/admin/license-keys", { id })
      toast.success("Licencia revocada")
      fetchKeys()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleResend = async (id: string) => {
    try {
      const res = await api.post("/admin/license-keys/resend", { license_key_id: id })
      toast.success(res.message || "Reenviada")
      fetchKeys()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.del(`/admin/license-keys?id=${id}`)
      toast.success("Licencia eliminada")
      fetchKeys()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const Cell = ({ children, colSpan }: any) => (
    <td colSpan={colSpan} className="text-center py-8">
      <Text className="text-gray-500">{children}</Text>
    </td>
  )

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Licencias Digitales</Heading>
          <Text className="text-gray-400 mt-1">Gestiona las claves de licencia del inventario</Text>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancelar" : "Agregar Licencias"}
        </Button>
      </div>

      {showCreate && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6 flex flex-col gap-4">
          <Heading level="h2">Nuevas Licencias</Heading>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Product ID</label>
            <Input
              placeholder="prod_xxx"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Claves (una por línea)</label>
            <Textarea
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
              rows={8}
              value={newKeys}
              onChange={(e) => setNewKeys(e.target.value)}
            />
            {keyList.length > 0 && (
              <Text className="text-xs text-gray-500 mt-1">
                {keyList.length} clave{keyList.length !== 1 ? "s" : ""} detectada{keyList.length !== 1 ? "s" : ""}
              </Text>
            )}
          </div>
          <div className="flex gap-2">
            {showConfirm ? (
              <>
                <Button variant="danger" onClick={handleCreate} disabled={creating}>
                  {creating ? "Creando..." : `Confirmar ${keyList.length} licencia${keyList.length !== 1 ? "s" : ""}`}
                </Button>
                <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancelar</Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => setShowConfirm(true)}
                disabled={!hasUpload}
              >
                Crear {keyList.length || ""} licencia{keyList.length !== 1 ? "s" : ""}
              </Button>
            )}
            {!showConfirm && (
              <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-400">Product ID:</label>
        <Input
          placeholder="prod_xxx"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="secondary" size="small" onClick={() => fetchKeys()}>Buscar</Button>
        <Button variant="secondary" size="small" onClick={() => { setProductFilter(""); fetchKeys() }}>
          Limpiar
        </Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Clave</Table.HeaderCell>
            <Table.HeaderCell>Producto</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Delivery</Table.HeaderCell>
            <Table.HeaderCell>Orden</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell>
                <Cell colSpan={7}>Cargando...</Cell>
              </Table.Cell>
            </Table.Row>
          ) : keys.length === 0 ? (
            <Table.Row>
              <Table.Cell>
                <Cell colSpan={7}>
                  {productFilter ? "No se encontraron licencias" : "No hay licencias creadas aún"}
                </Cell>
              </Table.Cell>
            </Table.Row>
          ) : keys.map((lk) => (
            <Table.Row key={lk.id}>
              <Table.Cell>
                <code className="text-xs bg-gray-800 px-2 py-1 rounded font-mono">{lk.key?.slice(0, 30)}...</code>
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
              <Table.Cell><code className="text-xs text-gray-400">{lk.order_id?.slice(0, 15) || "—"}</code></Table.Cell>
              <Table.Cell><span className="text-xs text-gray-400">{lk.customer_email || "—"}</span></Table.Cell>
              <Table.Cell>
                <div className="flex gap-1">
                  {lk.status === "assigned" && (
                    <Button variant="secondary" size="small" onClick={() => handleResend(lk.id)}>Reenviar</Button>
                  )}
                  {lk.status !== "revoked" && (
                    <Button variant="secondary" size="small" onClick={() => handleRevoke(lk.id)}>Revocar</Button>
                  )}
                  <Button variant="danger" size="small" onClick={() => handleDelete(lk.id)}>Eliminar</Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Licencias",
})

export default LicenseKeysPage
