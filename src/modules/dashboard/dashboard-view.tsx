import { useTranslation } from 'react-i18next'

export const DashboardView = () => {
  const { t } = useTranslation('nav')
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[18px] justify-center mt-8 p-2">
        <p>{t("dashboard")}</p>
      </div>
    </div>
  )
}
