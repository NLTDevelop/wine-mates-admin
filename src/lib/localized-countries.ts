import { countryDisplayNames } from '@/constatnts/country-display-names'
import countries from 'world-countries'

type RegionDisplayNames = { of: (code: string) => string | undefined }

export interface ICountry {
  name: string
  cca2: string
  callingCode: string
}

interface ICountryFull {
  name: { common: string; official: string }
  cca2: string
  translations?: Record<string, { common: string; official: string }>
  idd: { root: string; suffixes: string[] }
}

const iso2ToWorldCountriesTranslation: Record<string, string> = {
  ar: 'ara',
  cs: 'ces',
  de: 'deu',
  et: 'est',
  fi: 'fin',
  fr: 'fra',
  hr: 'hrv',
  hu: 'hun',
  it: 'ita',
  ja: 'jpn',
  ko: 'kor',
  nl: 'nld',
  fa: 'per',
  pl: 'pol',
  pt: 'por',
  ru: 'rus',
  sk: 'slk',
  es: 'spa',
  sr: 'srp',
  sv: 'swe',
  tr: 'tur',
  ur: 'urd',
  zh: 'zho',
  uk: 'ukr',
}

const buildDisplayNames = (locale: string): RegionDisplayNames | null => {
  const DisplayNames = (Intl as typeof Intl & { DisplayNames?: any }).DisplayNames
  if (typeof DisplayNames !== 'function') return null

  try {
    return new DisplayNames([locale], { type: 'region' })
  } catch {
    return null
  }
}

const getLocalizedCountries = (locale: string, displayNames: RegionDisplayNames | null): ICountry[] => {
  const resolvedLocale = locale.toLowerCase()
  const translationKey = iso2ToWorldCountriesTranslation[resolvedLocale]
  const customNames = countryDisplayNames[resolvedLocale] || null

  return countries.map((c: any) => {
    const manualOverrides: Record<string, string> = {
      AQ: '+672',
      HM: '+672',
    }

    const phoneCode = manualOverrides[c.cca2] || (c.idd?.root && c.idd?.suffixes ? `${c.idd.root}${c.idd.suffixes[0]}` : '')

    const localizedName = customNames?.[c.cca2] || (displayNames?.of(c.cca2) as string | undefined) || (translationKey ? c.translations?.[translationKey]?.common : undefined) || c.name.common

    return {
      name: localizedName,
      cca2: c.cca2,
      callingCode: phoneCode,
    }
  })
}

export const getCountryName = (countryCode: string, locale: string = 'en'): string => {
  const displayNames = buildDisplayNames(locale)
  const countries = getLocalizedCountries(locale, displayNames)
  const country = countries.find(c => c.cca2 === countryCode)

  if (country) {
    return country.name
  }

  const fallbackCountry = countries.find(c => c.cca2 === countryCode) as ICountryFull | undefined
  if (!fallbackCountry) {
    return locale === 'uk' ? 'Невідома країна' : 'Unknown country'
  }

  const translationKey = iso2ToWorldCountriesTranslation[locale]
  const translatedName = translationKey ? fallbackCountry.translations?.[translationKey]?.common : null

  return translatedName || fallbackCountry.name.common
}
