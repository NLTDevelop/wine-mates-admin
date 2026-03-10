// EventFormPage.tsx - отдельная страница с формой
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Card } from '@/UIKit/shadcn/ui/card'
import { 
  Wine, Combine, Eye, MapPin, Calendar, Clock, DollarSign, 
  Users, Phone, Globe, Repeat, Check, ArrowLeft 
} from 'lucide-react'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useToast } from '@/hooks/shadcn/use-toast'
import { 
  TASTING_TYPES, CURRENCIES, LANGUAGES, REPEAT_RULES,
  type MapEvent, type TastingType, type Currency, type Language, type RepeatRule, type WineItem 
} from '../../../entities/types'
import { PATHS } from '@/navigation/paths'

// Моковые данные для стран
const COUNTRIES = [
  { id: 1, name: 'Україна' },
  { id: 2, name: 'Польща' },
  { id: 3, name: 'Франція' },
  { id: 4, name: 'Італія' },
  { id: 5, name: 'Іспанія' },
]

// Моковые данные для вин
const WINES: WineItem[] = [
  { id: 1, name: 'Chateau Margaux', year: 2015, producer: 'Chateau Margaux', price: 2500 },
  { id: 2, name: 'Opus One', year: 2018, producer: 'Opus One Winery', price: 3000 },
  { id: 3, name: 'Sassicaia', year: 2016, producer: 'Tenuta San Guido', price: 2800 },
  { id: 4, name: 'Dom Perignon', year: 2012, producer: 'Moët & Chandon', price: 3500 },
  { id: 5, name: 'Vega Sicilia', year: 2014, producer: 'Bodegas Vega Sicilia', price: 2700 },
  { id: 6, name: 'Penfolds Grange', year: 2015, producer: 'Penfolds', price: 3200 },
  { id: 7, name: 'Chateau d\'Yquem', year: 2009, producer: 'Chateau d\'Yquem', price: 4000 },
  { id: 8, name: 'Masseto', year: 2017, producer: 'Tenuta dell\'Ornellaia', price: 3800 },
  { id: 9, name: 'Screaming Eagle', year: 2016, producer: 'Screaming Eagle', price: 4500 },
]

// Конфигурация для типов дегустаций
const TASTING_TYPE_CONFIG: Record<
  TastingType,
  { label: string; labelUk: string; icon: React.ReactNode; color: string }
> = {
  wine_set: {
    label: 'Wine set',
    labelUk: 'Вина сети',
    icon: <Wine className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  comparative: {
    label: 'Comparative',
    labelUk: 'Порівняльна',
    icon: <Combine className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  blind: {
    label: 'Blind',
    labelUk: 'Сліпа',
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
}

export const CreateEventForm = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const isEditMode = !!id
  const eventData = location.state?.event
  const newEventLocation = location.state

  // Инициализация формы
  const [formData, setFormData] = useState<Partial<MapEvent>>(() => {
    if (isEditMode && eventData) {
      return eventData
    } else if (newEventLocation) {
      return {
        userId: newEventLocation.userId,
        theme: '',
        restaurantName: '',
        locationLabel: newEventLocation.locationLabel,
        latitude: newEventLocation.latitude,
        longitude: newEventLocation.longitude,
        countryId: 1,
        eventDate: new Date().toISOString().split('T')[0],
        eventTime: '18:00',
        price: 0,
        currency: 'UAH' as Currency,
        speakerName: '',
        language: 'UA' as Language,
        seats: 0,
        phoneNumber: '',
        tastingType: 'wine_set' as TastingType,
        repeatRule: 'never' as RepeatRule,
        isActive: true,
        isOnline: false,
        wineSet: [],
      }
    } else {
      navigate(PATHS.MAP)
      return {}
    }
  })

  const [selectedWines, setSelectedWines] = useState<number[]>(formData.wineSet || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Здесь будет отправка на сервер
    toast({
      title: isEditMode ? 'Оновлено' : 'Створено',
      description: isEditMode ? 'Подію успішно оновлено' : 'Нову подію успішно створено',
    })
    
    // Возвращаемся на карту
    navigate(-1)
  }

  const toggleWine = (wineId: number) => {
    setSelectedWines(prev => 
      prev.includes(wineId)
        ? prev.filter(id => id !== wineId)
        : [...prev, wineId]
    )
  }

  const totalWinePrice = selectedWines.reduce((sum, id) => {
    const wine = WINES.find(w => w.id === id)
    return sum + (wine?.price || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
   
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(PATHS.MAP)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            На карту
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Редагування події' : 'Створення нової події'}
          </h1>
        </div>


        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
   
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Обране місце:</p>
                  <p className="text-sm text-blue-600">{formData.locationLabel}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    Координати: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

    
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Основна інформація</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Тема *</Label>
                  <Input
                    id="theme"
                    required
                    value={formData.theme}
                    onChange={e => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="Natural Wine & Pet-Nats"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Назва ресторану *</Label>
                  <Input
                    id="restaurantName"
                    required
                    value={formData.restaurantName}
                    onChange={e => setFormData({ ...formData, restaurantName: e.target.value })}
                    placeholder="Catch"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationLabel">Локація (текст) *</Label>
                <Input
                  id="locationLabel"
                  required
                  value={formData.locationLabel}
                  onChange={e => setFormData({ ...formData, locationLabel: e.target.value })}
                  placeholder="Ukraine, Kyiv Reg, Irpin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Країна</Label>
                <Select
                  value={formData.countryId?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, countryId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть країну" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

   
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Дата та час</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Дата *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime">Час *</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    required
                    value={formData.eventTime}
                    onChange={e => setFormData({ ...formData, eventTime: e.target.value })}
                  />
                </div>
              </div>
            </div>


            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Ціна та місця</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Ціна *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: Currency) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(currency => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">Кількість місць *</Label>
                <Input
                  id="seats"
                  type="number"
                  required
                  value={formData.seats}
                  onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                />
              </div>
            </div>

   
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Спікер та контакти</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speakerName">Ім'я спікера</Label>
                  <Input
                    id="speakerName"
                    value={formData.speakerName || ''}
                    onChange={e => setFormData({ ...formData, speakerName: e.target.value })}
                    placeholder="Ihor Postoiankin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Мова *</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: Language) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Телефон *</Label>
                <Input
                  id="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+380501234567"
                />
              </div>
            </div>

  
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Тип та налаштування</h2>
              
              <div className="space-y-2">
                <Label>Тип дегустації *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TASTING_TYPES.map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.tastingType === type ? 'primary' : 'outline'}
                      onClick={() => setFormData({ ...formData, tastingType: type })}
                      className="flex items-center justify-center gap-1"
                    >
                      {TASTING_TYPE_CONFIG[type].icon}
                      <span className="text-xs">{TASTING_TYPE_CONFIG[type].labelUk}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repeatRule">Повторення</Label>
                  <Select
                    value={formData.repeatRule}
                    onValueChange={(value: RepeatRule) => setFormData({ ...formData, repeatRule: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Ніколи</SelectItem>
                      <SelectItem value="daily">Щодня</SelectItem>
                      <SelectItem value="weekly">Щотижня</SelectItem>
                      <SelectItem value="monthly">Щомісяця</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isOnline"
                    checked={formData.isOnline}
                    onCheckedChange={(checked) => setFormData({ ...formData, isOnline: checked })}
                  />
                  <Label htmlFor="isOnline">Online подія</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Активна подія</Label>
              </div>
            </div>

  
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Вина в сеті</h2>
              
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border rounded-md p-3">
                {WINES.map(wine => (
                  <div
                    key={wine.id}
                    className={`
                      flex items-center justify-between p-3 rounded-md cursor-pointer
                      ${selectedWines.includes(wine.id) 
                        ? 'bg-purple-100 border-purple-300' 
                        : 'hover:bg-gray-50 border-transparent'
                      } border
                    `}
                    onClick={() => toggleWine(wine.id)}
                  >
                    <div>
                      <p className="font-medium text-sm">{wine.name}</p>
                      <p className="text-xs text-gray-500">
                        {wine.producer} {wine.year && `(${wine.year})`}
                      </p>
                      {wine.price && (
                        <p className="text-xs text-gray-600 mt-1">{wine.price} грн</p>
                      )}
                    </div>
                    {selectedWines.includes(wine.id) && (
                      <Check className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                ))}
              </div>
              
              {selectedWines.length > 0 && (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="text-sm text-gray-600">
                    Вибрано вин: <span className="font-bold">{selectedWines.length}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    Загальна вартість: <span className="font-bold">{totalWinePrice} {formData.currency}</span>
                  </span>
                </div>
              )}
            </div>

 
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Скасувати
              </Button>
              <Button type="submit">
                {isEditMode ? 'Зберегти зміни' : 'Створити подію'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}