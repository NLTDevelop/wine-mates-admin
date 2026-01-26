import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'

interface CharacteristicItemProps {
  id: string
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  header?: React.ReactNode
}

export const CharacteristicItem: React.FC<CharacteristicItemProps> = ({ label, isOpen, onToggle, children, header }) => {
  return (
    <AccordionWrapper
      label={label}
      isOpen={isOpen}
      onToggle={onToggle}
      style={{ padding: '8px', marginBottom: '12px', backgroundColor: '#d1d1d1' }}
      chevronStyle="#2e2e38"
      header={header || <p>{label}</p>}
    >
      {children}
    </AccordionWrapper>
  )
}
