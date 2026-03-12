import i18n from 'i18next'

export const sortOptions = [
  { value: 'newest', label: i18n.t('filters.sort.newest') },
  { value: 'oldest', label: i18n.t('filters.sort.oldest') },
  { value: 'name_asc', label: i18n.t('filters.sort.name_asc') },
  { value: 'name_desc', label: i18n.t('filters.sort.name_desc') },
  { value: 'producer_asc', label: i18n.t('filters.sort.producer_asc') },
  { value: 'producer_desc', label: i18n.t('filters.sort.producer_desc') },
]

export const SORT_FIELDS: Record<string, string> = {
  name: 'name',
  vintage: 'vintage',
  producer: 'producer',
  country: 'country',
  region: 'region',
  grapeVariety: 'grape_variety',
  type: 'type',
  color: 'color',
} as const

export const EVENT_SORT_FIELDS: Record<string, string> = {
  theme: 'theme',
  restaurantName: 'restaurantName',
  locationLabel: 'locationLabel',
  eventDate: 'eventDate',
  eventTime: 'eventTime',
  price: 'price',
  speakerName: 'speakerName',
  seats: 'seats',
  distanceKm: 'distanceKm',
} as const

export const FILTER_COLUMN_MAP: Record<string, string> = {
  country: 'countryId',
  region: 'regionId',
  type: 'typeId',
  color: 'colorId',
  vintage: 'vintage',
}
