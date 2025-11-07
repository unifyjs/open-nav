import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// 通用的 media query hook
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => {
      setMatches(mql.matches)
    }
    
    // 初始化状态
    setMatches(mql.matches)
    
    // 监听变化
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}
