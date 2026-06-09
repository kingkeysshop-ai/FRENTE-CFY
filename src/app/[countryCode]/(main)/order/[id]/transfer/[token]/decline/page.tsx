import { notFound } from "next/navigation"
import { declineTransferRequest } from "@lib/data/orders"
import type { StoreOrder } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  try {
    const response = await declineTransferRequest(id, token)
    const order: StoreOrder = "order" in response ? response.order : response

    if (!order) {
      notFound()
    }

    return (
      <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
        <TransferImage />
        <div className="flex flex-col gap-y-6">
          <Heading level="h1" className="text-xl text-zinc-900">
            Transferencia Rechazada
          </Heading>
          <Text className="text-zinc-600">
            La transferencia del pedido <strong>{order.id}</strong> ha sido rechazada correctamente.
          </Text>
          <div className="flex gap-x-4 mt-4">
            <a
              href={`/orders/${order.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Ver Pedido
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al rechazar transferencia:", error)

    return (
      <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
        <Heading level="h1" className="text-xl text-red-600">
          Error
        </Heading>
        <Text className="text-gray-600">
          No se pudo rechazar la transferencia del pedido. Verifica que el token sea válido.
        </Text>
        <a
          href="/"
          className="text-blue-500 underline hover:text-blue-700 mt-2"
        >
          Volver al Inicio
        </a>
      </div>
    )
  }
}
