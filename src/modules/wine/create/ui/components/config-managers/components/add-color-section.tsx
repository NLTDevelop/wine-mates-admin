import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Plus, Save } from 'lucide-react'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'

interface AddColorSectionProps {
  categoryFormData: {
    label: string
    labelEn: string
    tones?: {
      pale: string
      medium: string
      deep: string
    }
  }
  baseHex: string
  isLoading: boolean
  canAddColor?: string
  onLabelChange: (value: string) => void
  onLabelEnChange: (value: string) => void
  onToneChange: (tone: 'pale' | 'medium' | 'deep', value: string) => void
  onSave: () => void
  onCancel: () => void
  isEditing?: boolean
  editingColorName?: string
}

export const AddColorSection = ({
  categoryFormData,
  baseHex,
  isLoading,
  canAddColor,
  onLabelChange,
  onLabelEnChange,
  onToneChange,
  onSave,
  isEditing = false,
  editingColorName,
}: AddColorSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  return (
    <div className="border-1 border-input p-4 rounded-b-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {isEditing ? (
            <>
              {t('edit_subcolor')} <span>{editingColorName}</span>{' '}
            </>
          ) : (
            t('add_subcolor')
          )}
        </h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <Label>{t('subcategory_name_ua')} *</Label>
            <Input value={categoryFormData.label} onChange={e => onLabelChange(e.target.value)} placeholder="Білі вина" className="w-full" autoFocus />
          </div>

          <div>
            <Label>{t('subcategory_name_en')} *</Label>
            <Input value={categoryFormData.labelEn} onChange={e => onLabelEnChange(e.target.value)} placeholder="White wines" className="w-full" />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TonePicker label={t('pale_tone')} value={categoryFormData.tones?.pale} onChange={color => onToneChange('pale', color)} baseHexNoHash={baseHex} />

            <TonePicker label={t('medium_tone')} value={categoryFormData.tones?.medium} onChange={color => onToneChange('medium', color)} baseHexNoHash={baseHex} />

            <TonePicker label={t('deep_tone')} value={categoryFormData.tones?.deep} onChange={color => onToneChange('deep', color)} baseHexNoHash={baseHex} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onSave} disabled={!canAddColor || isLoading}>
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? tc('button.saving') : tc('button.save')}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
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
  baseHexNoHash: string
}

const TonePicker = ({ label, value, onChange, baseHexNoHash }: TonePickerProps) => (
  <div className="space-y-3">
    <Label>{label}</Label>
    <ColorPicker value={value ? `${value}` : ''} onChange={onChange} baseHexNoHash={baseHexNoHash} />
  </div>
)
