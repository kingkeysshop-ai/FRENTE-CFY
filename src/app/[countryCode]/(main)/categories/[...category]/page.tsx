import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const countryCodes = await listRegions().then((regions: any[]) =>
      regions
        ?.flatMap((region: any) =>
          region.countries?.
            map((country: any) => country.iso_2)
            .filter(Boolean) ?? []
        )
        .filter((code: any): code is string => typeof code === "string")
    )

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    const staticParams = countryCodes
      ? countryCodes.flatMap((countryCode: string) =>
          categoryHandles.map((handle: any) => ({
            countryCode,
            category: [handle],
          }))
        )
      : []

    return staticParams
  } catch (error) {
    console.warn("Backend not available during build, skipping static generation")
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    // 1. Obtenemos la categoría por su handle
    const category = await getCategoryByHandle(params.category)

    // 2. Validación explícita para evitar errores de ejecución
    if (!category) {
      return {
        title: "Category | Medusa Store",
        description: "Category not found",
      }
    }

    // 3. Construcción segura de metadatos
    const title = `${category.name} | Medusa Store`
    const description = category.description ?? `${title} category.`

    return {
      title,
      description,
      alternates: {
        // 5. Aseguramos que la canonical tenga la barra inicial para rutas correctas
        canonical: `/${params.category.join("/")}`,
      },
    }
  } catch (error) {
    // Manejo de errores global
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
