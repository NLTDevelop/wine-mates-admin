import { useTranslation } from 'react-i18next'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'

interface AddColorSectionProps {
  formData: {
    name: string
    nameEn: string
    shade: string
    tones?: {
      pale: string
      medium: string
      deep: string
    }
  }
  isLoading: boolean
  canAddColor?: boolean
  baseColor?: string
  onNameChange: (value: string) => void
  onNameEnChange: (value: string) => void
  onShadeChange: (value: string) => void
  onToneChange?: (tone: 'pale' | 'medium' | 'deep', value: string) => void
  onSave: () => void
  isEditing?: boolean
  editingItemName?: string
  showTones?: boolean
}

export const AddColorSection = ({
  formData,
  isLoading,
  canAddColor,
  baseColor,
  onNameChange,
  onNameEnChange,
  onShadeChange,
  onToneChange,
  onSave,
  isEditing = false,
  showTones = false,
}: AddColorSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  return (
    <div className="border-1 border-input p-4 pt-0 rounded-b-md w-full">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <Label>{t('shade_name_ua')} *</Label>
            <Input value={formData.name} onChange={e => onNameChange(e.target.value)} placeholder="Білі вина" className="w-full" autoFocus />
          </div>

          <div>
            <Label>{t('shade_name_en')} *</Label>
            <Input value={formData.nameEn} onChange={e => onNameEnChange(e.target.value)} placeholder="White wines" className="w-full" />
          </div>
        </div>
        <div>
          <TonePicker label={t('colors.main_tone')} value={formData.shade} onChange={onShadeChange} baseHexNoHash={baseColor} />
        </div>
        {showTones && onToneChange && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TonePicker label={t('pale_tone')} value={formData.tones?.pale} onChange={color => onToneChange('pale', color)} baseHexNoHash={baseColor} />
              <TonePicker label={t('medium_tone')} value={formData.tones?.medium} onChange={color => onToneChange('medium', color)} baseHexNoHash={baseColor} />
              <TonePicker label={t('deep_tone')} value={formData.tones?.deep} onChange={color => onToneChange('deep', color)} baseHexNoHash={baseColor} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onSave} disabled={!canAddColor || isLoading} size="sm">
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              {isLoading ? tc('button.saving') : tc('button.save')}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              {isLoading ? tc('button.saving') : tc('button.add')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

interface TonePickerProps {
  label: string
  value?: string
  onChange: (color: string) => void
  baseHexNoHash?: string
}

const TonePicker = ({ label, value, onChange, baseHexNoHash }: TonePickerProps) => (
  <div className="space-y-3">
    <Label>{label}</Label>
    <ColorPicker value={value || ''} onChange={onChange} baseHexNoHash={baseHexNoHash} />
  </div>
)
