export const wineTypeFormConfig = {
  fields: [
    {
      id: 'label' as const,
      labelKey: 'types.type_name_ua' as const,
      placeholderKey: 'types.type_name_ua' as const,
      required: true,
    },
    {
      id: 'labelEn' as const,
      labelKey: 'types.type_name_en' as const,
      placeholderKey: 'types.type_name_en' as const,
      required: false,
    },
  ],
  multiSelects: [
    {
      id: 'colors' as const,
      labelKey: 'types.color' as const,
      placeholderKey: 'types.choose_color' as const,
      searchLabelKey: 'types.search_color' as const,
      required: true,
      fetchKey: 'colors' as const,
    },
    {
      id: 'aromas' as const,
      labelKey: 'types.aromas' as const,
      placeholderKey: 'types.choose_aromas' as const,
      searchLabelKey: 'types.search_aromas' as const,
      required: true,
      fetchKey: 'aromas' as const,
    },
    {
      id: 'flavorNotes' as const,
      labelKey: 'types.flavor_notes' as const,
      placeholderKey: 'types.choose_flavor_notes' as const,
      searchLabelKey: 'types.search_flavor_notes' as const,
      required: true,
      fetchKey: 'flavorNotes' as const,
    },
    {
      id: 'flavorCharacteristics' as const,
      labelKey: 'types.flavor_characteristics' as const,
      placeholderKey: 'types.choose_flavor_characteristics' as const,
      searchLabelKey: 'types.search_flavor_characteristics' as const,
      required: true,
      fetchKey: 'flavorCharacteristics' as const,
    },
  ],
} as const
