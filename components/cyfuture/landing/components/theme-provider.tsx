import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({ children, defaultTheme = 'dark', storageKey = 'theme' }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme)

  React.useEffect(() => {
    // Apply the theme to the document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  )
}
