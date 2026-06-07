import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

import ProfileName from "@modules/account/components/profile-name"
import User from "@modules/common/icons/user"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfilePhone from "@modules/account/components/profile-phone"
import ProfilePassword from "@modules/account/components/profile-password"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"

export const metadata: Metadata = {
  title: "Mi Perfil | King Keys",
  description: "Administra tu información personal, dirección y contraseña.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) notFound()

  return (
    <div className="w-full flex flex-col gap-6" data-testid="profile-page-wrapper">

      {/* Page header */}
      <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[#facc15] text-lg"><User size="20" color="#facc15" /></span>
          <h1 className="text-2xl font-black text-white">
            Mi <span className="text-[#facc15]">Perfil</span>
          </h1>
        </div>
        <p className="text-[#888888] text-sm ml-8">
          Administra tu información personal, contraseña y dirección de facturación.
        </p>
      </div>

      {/* Section: Personal info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#facc15] rounded-full" />
          <h2 className="text-white font-black text-sm uppercase tracking-widest">Información Personal</h2>
        </div>
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
      </div>

      {/* Section: Security */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#facc15] rounded-full" />
          <h2 className="text-white font-black text-sm uppercase tracking-widest">Seguridad</h2>
        </div>
        <ProfilePassword customer={customer} />
      </div>

      {/* Section: Billing */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#facc15] rounded-full" />
          <h2 className="text-white font-black text-sm uppercase tracking-widest">Dirección de Facturación</h2>
        </div>
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>

    </div>
  )
}
