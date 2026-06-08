import { Metadata } from "next"

import OrderFilters from "@modules/account/components/order-filters"
import OrderOverview from "@modules/account/components/order-overview"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders(props: {
  searchParams: Promise<{ status?: string; days?: string }>
}) {
  const { status, days } = await props.searchParams

  const filters: Record<string, any> = {}
  if (status) filters.status = status
  if (days) {
    const from = new Date()
    from.setDate(from.getDate() - parseInt(days))
    filters["created_at[gte]"] = from.toISOString()
  }

  const orders = await listOrders(10, 0, filters)

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-2">
        <h1 className="text-2xl font-black text-white">
          <span className="text-[#facc15]">📋</span> Mis Pedidos
        </h1>
        <p className="text-sm text-[#888888]">
          Revisa el estado de tus pedidos anteriores y licencias digitales adquiridas.
        </p>
      </div>
      <div className="mb-6">
        <OrderFilters />
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16 border-[#2a2a2a]" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
