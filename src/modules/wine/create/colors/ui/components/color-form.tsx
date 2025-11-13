import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useTranslation } from 'react-i18next'

interface ColorFormData {
  nameUa: string
  nameEn: string
  tonePale: string
  toneMedium: string
  toneDeep: string
  baseColor: string
}

interface ColorFormProps {
  data: ColorFormData
  onDataChange: (field: keyof ColorFormData, value: string) => void
  autoFocus?: boolean
}

export const ColorForm: React.FC<ColorFormProps> = ({ data, onDataChange, autoFocus = false }) => {
  const { t } = useTranslation('wines')
  return (
    <div className="border-1 border-input py-2 rounded-b-md bg-muted w-full">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('colors.shade_name_ua')} *</label>
            <Input value={data.nameUa} onChange={e => onDataChange('nameUa', e.target.value)} placeholder={t('colors.shade_name_ua')} className="w-full" autoFocus={autoFocus} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('colors.shade_name_en')} *</label>
            <Input value={data.nameEn} onChange={e => onDataChange('nameEn', e.target.value)} placeholder={t('colors.shade_name_en')} className="w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TonePicker label={t('pale_tone')} value={data.tonePale} onChange={color => onDataChange('tonePale', color)} baseHexNoHash={data.baseColor} />
          <TonePicker label={t('medium_tone')} value={data.toneMedium} onChange={color => onDataChange('toneMedium', color)} baseHexNoHash={data.baseColor} />
          <TonePicker label={t('deep_tone')} value={data.toneDeep} onChange={color => onDataChange('toneDeep', color)} baseHexNoHash={data.baseColor} />
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{tonePaleLabel}</label>
            <div className="flex items-center gap-2">
              <Input 
                value={data.tonePale} 
                onChange={e => onDataChange('tonePale', e.target.value)} 
                placeholder="#FFFFFF" 
                className="w-full" 
              />
              <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: data.tonePale }} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{toneMediumLabel}</label>
            <div className="flex items-center gap-2">
              <Input 
                value={data.toneMedium} 
                onChange={e => onDataChange('toneMedium', e.target.value)} 
                placeholder="#CCCCCC" 
                className="w-full" 
              />
              <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: data.toneMedium }} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{toneDeepLabel}</label>
            <div className="flex items-center gap-2">
              <Input 
                value={data.toneDeep} 
                onChange={e => onDataChange('toneDeep', e.target.value)} 
                placeholder="#666666" 
                className="w-full" 
              />
              <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: data.toneDeep }} />
            </div>
          </div>
        </div> */}
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
