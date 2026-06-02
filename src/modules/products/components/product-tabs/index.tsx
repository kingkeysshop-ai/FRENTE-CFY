"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import Key from "@modules/common/icons/key"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import Globe from "@modules/common/icons/globe"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Información del Producto",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Envío y Devoluciones",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm px-6 py-6">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-3">
          <Key size="20" color="#F5C518" />
          <div>
            <p className="text-white font-semibold text-sm">Licencia Digital</p>
            <p className="text-gray-400 text-xs">Activación inmediata vía email</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Lightning size="20" color="#F5C518" />
          <div>
            <p className="text-white font-semibold text-sm">Entrega Instantánea</p>
            <p className="text-gray-400 text-xs">Recibe tu clave en minutos después del pago</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck size="20" color="#F5C518" />
          <div>
            <p className="text-white font-semibold text-sm">Pago Seguro</p>
            <p className="text-gray-400 text-xs">Transacciones protegidas con cifrado SSL</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe size="20" color="#F5C518" />
          <div>
            <p className="text-white font-semibold text-sm">Válido Mundialmente</p>
            <p className="text-gray-400 text-xs">Funciona en cualquier idioma y región</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm px-6 py-6">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-start gap-3">
          <span className="text-[#F5C518] text-lg shrink-0 mt-0.5">📧</span>
          <div>
            <p className="text-white font-semibold text-sm">Entrega por Email</p>
            <p className="text-gray-400 text-xs mt-1">
              Todas las licencias se entregan digitalmente a tu correo electrónico inmediatamente después de la confirmación del pago.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#F5C518] text-lg shrink-0 mt-0.5">🔄</span>
          <div>
            <p className="text-white font-semibold text-sm">Garantía de Funcionamiento</p>
            <p className="text-gray-400 text-xs mt-1">
              Si tu licencia no funciona como se espera, nuestro equipo de soporte te ayudará a resolverlo o te reemplazaremos la clave.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#F5C518] text-lg shrink-0 mt-0.5">💬</span>
          <div>
            <p className="text-white font-semibold text-sm">Soporte 24/7</p>
            <p className="text-gray-400 text-xs mt-1">
              Nuestro equipo está disponible las 24 horas para ayudarte con cualquier problema o duda sobre tu compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
