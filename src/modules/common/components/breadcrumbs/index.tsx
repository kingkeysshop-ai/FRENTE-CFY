import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Crumb = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  crumbs: Crumb[]
}

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  if (!crumbs?.length) return null

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#888888] mb-4 overflow-x-auto whitespace-nowrap">
      <LocalizedClientLink href="/store" className="hover:text-[#facc15] transition-colors">
        Tienda
      </LocalizedClientLink>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span>/</span>
          {crumb.href ? (
            <LocalizedClientLink href={crumb.href} className="hover:text-[#facc15] transition-colors">
              {crumb.label}
            </LocalizedClientLink>
          ) : (
            <span className="text-[#888888] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
