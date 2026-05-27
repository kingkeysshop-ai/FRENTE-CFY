import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-2">
        <h1 className="text-2xl font-black text-white">
          <span className="text-yellow-400">📋</span> Mis Pedidos
        </h1>
        <p className="text-sm text-gray-400">
          Revisa el estado de tus pedidos anteriores y licencias digitales adquiridas.
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16 border-gray-700" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
