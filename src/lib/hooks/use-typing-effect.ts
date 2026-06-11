"use client"

import { useState, useEffect, useRef } from "react"

type UseTypingEffectOptions = {
  text: string
  speed?: number
  onComplete?: () => void
}

type UseTypingEffectReturn = {
  displayedText: string
  isComplete: boolean
  cursor: string
}

export function useTypingEffect({
  text,
  speed = 40,
  onComplete,
}: UseTypingEffectOptions): UseTypingEffectReturn {
  const [index, setIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const onCompleteRef = useRef(onComplete)
  const textRef = useRef(text)

  useEffect(() => {
    if (textRef.current !== text) {
      textRef.current = text
      setIndex(0)
      setIsComplete(false)
    }
  }, [text])

  useEffect(() => {
    if (index >= text.length) {
      setIsComplete(true)
      onCompleteRef.current?.()
      return
    }
    const timeout = setTimeout(() => setIndex((i) => i + 1), speed)
    return () => clearTimeout(timeout)
  }, [index, text.length, speed])

  useEffect(() => {
    if (isComplete) {
      setCursorVisible(false)
      return
    }
    const interval = setInterval(() => setCursorVisible((c) => !c), 500)
    return () => clearInterval(interval)
  }, [isComplete])

  return {
    displayedText: text.slice(0, index),
    isComplete,
    cursor: cursorVisible ? "▊" : " ",
  }
}
