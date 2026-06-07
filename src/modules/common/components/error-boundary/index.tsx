"use client"

import React from "react"

type ErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] p-8">
          <div className="text-center max-w-md">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-white font-black text-lg mb-2">Algo sali&oacute; mal</h2>
            <p className="text-[#888888] text-sm mb-4">
              Ocurri&oacute; un error inesperado. Por favor, intenta de nuevo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary