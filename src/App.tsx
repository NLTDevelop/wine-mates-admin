import { useInitTranslations } from './locales/useInitTranslations'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/react-query'
import { ThemeProvider } from 'next-themes'

function App() {
  useInitTranslations()
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          {/* Хедер */}
          <header className="border-b border-border bg-card shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">🍷 Wine Admin</h1>
                <nav className="flex gap-6">
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    Дашборд
                  </a>
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    Користувачі
                  </a>
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    Товари
                  </a>
                  <a href="#" className="text-foreground hover:text-primary transition-colors">
                    Замовлення
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Основний контент */}
          <main className="container mx-auto px-4 py-8">
            <div className="grid gap-6 max-w-4xl">
              {/* Картка привітання */}
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">Вітаємо в адмін-панелі!</h2>
                <p className="text-muted-foreground mb-4">
                  Ваш виний магазин готовий до налаштування. Почніть з додавання товарів та
                  керування замовленнями.
                </p>
                <div className="flex gap-3">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Додати товар
                  </button>
                  <button className="border border-border bg-background px-4 py-2 rounded-md hover:bg-accent transition-colors">
                    Переглянути замовлення
                  </button>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-medium text-muted-foreground">Користувачі</h3>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-medium text-muted-foreground">Товари</h3>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-medium text-muted-foreground">Замовлення</h3>
                  <p className="text-2xl font-bold mt-2">0</p>
                </div>
              </div>

              {/* Швидкі дії */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Швидкі дії</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                    <div className="font-medium">Додати вино</div>
                    <div className="text-sm text-muted-foreground">Новий товар</div>
                  </button>
                  <button className="text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                    <div className="font-medium">Користувачі</div>
                    <div className="text-sm text-muted-foreground">Керування</div>
                  </button>
                  <button className="text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                    <div className="font-medium">Аналітика</div>
                    <div className="text-sm text-muted-foreground">Статистика</div>
                  </button>
                  <button className="text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                    <div className="font-medium">Налаштування</div>
                    <div className="text-sm text-muted-foreground">Система</div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
