interface ContentLayoutProps {
  children: React.ReactNode
  title: string
  description?: string | React.ReactNode
}

export const ContentLayout = ({ title, description, children }: ContentLayoutProps) => {
  return (
    <div className="container mx-auto">
      <div className="mb-1 md:mb-4 bg-inherit">
        <div className="flex justify-between items-start">
          <h1 className="text-section">{title}</h1>
        </div>

        {description && <div className="text-description">{description}</div>}
      </div>

      {children}
    </div>
  )
}
