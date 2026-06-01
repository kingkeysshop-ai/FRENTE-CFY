import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <LocalizedClientLink href="/account">
      <button
        className="px-4 py-2 bg-[#facc15] text-[#0a0a0a] font-bold text-sm rounded-lg hover:bg-[#e6b800] transition-all duration-200 whitespace-nowrap"
        data-testid="sign-in-button"
      >
        Iniciar Sesión
      </button>
    </LocalizedClientLink>
  )
}

export default SignInPrompt
