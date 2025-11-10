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
      labelKey: 'color_wine' as const,
      placeholderKey: 'types.choose_color' as const,
      searchLabelKey: 'types.search_color' as const,
      required: true,
      fetchKey: 'colors' as const,
    },
  ],
} as const
