interface ContentLayoutProps {
  children: React.ReactNode
  title?: string
}

export const ContentLayout = ({ title, children }: ContentLayoutProps) => {
  return (
    <div className="container mx-auto">
      {title && (
        <div className="flex justify-between items-center mb-4 bg-inherit">
          <h1 className=" text-4xl font-bold">{title}</h1>
        </div>
      )}

      {children}
    </div>
  )
}
