import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { Fragment, useMemo } from "react"

import Radio from "@modules/common/components/radio"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: any[]
  addressInput: any | null
  onSelect: (
    address: any | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as any)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <Listbox.Button
          className="relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-gray-800 cursor-default focus:outline-none border border-gray-600 rounded-xl focus-visible:ring-2 focus-visible:ring-yellow-400/50 focus-visible:border-yellow-400 text-sm text-white"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : "Seleccionar dirección"}
              </span>
              <ChevronUpDown
                className={`transition-rotate duration-200 ${open ? "transform rotate-180" : ""}`}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-20 w-full overflow-auto text-sm bg-gray-800 border border-gray-600 rounded-xl max-h-60 focus:outline-none mt-1"
            data-testid="shipping-address-options"
          >
            {addresses.map((address: any) => {
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className="cursor-default select-none relative pl-6 pr-10 hover:bg-gray-700 py-4 border-b border-gray-700 last:border-0"
                  data-testid="shipping-address-option"
                >
                  <div className="flex gap-x-4 items-start">
                    <Radio
                      checked={selectedAddress?.id === address.id}
                      data-testid="shipping-address-radio"
                    />
                    <div className="flex flex-col">
                      <span className="text-left font-semibold text-white">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && (
                        <span className="text-sm text-gray-400">
                          {address.company}
                        </span>
                      )}
                      <div className="flex flex-col text-left text-sm text-gray-400 mt-2">
                        <span>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
