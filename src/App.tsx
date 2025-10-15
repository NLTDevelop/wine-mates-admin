import { useInitTranslations } from './locales/useInitTranslations'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/UIKit/shadcn/ui/toaster.tsx'
import { ReactQueryProvider } from './providers/react-query-provider'
import { Router } from './navigation/routes'
import { AutorizationForm } from './modules/autorization'

function App() {
  useInitTranslations()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryProvider>
        <BrowserRouter>
          <Router />
          <AutorizationForm />
          <Toaster />
        </BrowserRouter>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}

export default App
