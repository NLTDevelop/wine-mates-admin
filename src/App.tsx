import { useInitTranslations } from './locales/useInitTranslations'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/UIKit/shadcn/ui/toaster.tsx'
import { ReactQueryProvider } from './providers/react-query-provider'
import { Router } from './navigation/routes'
import { useAuthInit } from './hooks/ui/useAuthInit'
import { ToastInitializer } from './providers/toast-initializer'
import { SearchInput } from './UIKit/shadcn/ui/input-search'

function App() {
  useInitTranslations()
  useAuthInit()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider>
        <ToastInitializer />
        <BrowserRouter>
          <Router />
          <Toaster />
        </BrowserRouter>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}

export default App
