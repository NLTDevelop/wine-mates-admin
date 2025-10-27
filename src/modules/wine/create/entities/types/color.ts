export interface WineColorItem {
  name: string;
  nameEn: string;
  tones: WineColorTones;
}

export interface WineColor {
  id: string;
  value: string;
  label: string;
  labelEn?: string;
  items?: WineColorItem[];
  tones?: WineColorTones;
  colorLabel?: string;
  colors?: WineColor[];
}

export interface WineColorCategory {
  id: string;
  value: string;
  label: string;
  labelEn: string;
  tones?: WineColorTones;
  colors?: WineColor[];
}

export interface WineColorFormData {
  category: string;
  colorName: string;
  tones: WineColorTones;
}

export interface WineCategoryFormData {
  value: string;
  label: string;
  labelEn: string;
  tones?: WineColorTones;
}

export interface WineColorTones {
  pale: string;
  medium: string;
  deep: string;
}


export interface CreateCategoryParams {
  value: string;
  label: string;
  labelEn: string;
  tones?: WineColorTones;
}

export interface UpdateCategoryParams {
  categoryId: string;
  data: {
    value: string;
    label: string;
    labelEn: string;
    tones?: WineColorTones;
  };
}

export interface CreateColorParams {
  categoryId: string;
  data: WineColorFormData;
}

export interface UpdateColorParams {
  categoryId: string;
  colorId: string;
  data: Partial<WineColorFormData>;
}