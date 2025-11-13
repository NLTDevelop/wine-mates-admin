import { Input } from '@/UIKit/shadcn/ui/input'

interface FlavorFormData {
  name: string
  nameEn: string
}

interface FlavorFormProps {
  data: FlavorFormData
  onDataChange: (field: 'name' | 'nameEn', value: string) => void
  nameLabel: string
  nameEnLabel: string
  namePlaceholder: string
  nameEnPlaceholder: string
  autoFocus?: boolean
}

export const FlavorForm: React.FC<FlavorFormProps> = ({ data, onDataChange, nameLabel, nameEnLabel, namePlaceholder, nameEnPlaceholder, autoFocus = false }) => {
  return (
    <div className="border-1 border-input py-2 rounded-b-md bg-muted w-full">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{nameLabel} *</label>
            <Input value={data.name} onChange={e => onDataChange('name', e.target.value)} placeholder={namePlaceholder} className="w-full" autoFocus={autoFocus} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{nameEnLabel} *</label>
            <Input value={data.nameEn} onChange={e => onDataChange('nameEn', e.target.value)} placeholder={nameEnPlaceholder} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
