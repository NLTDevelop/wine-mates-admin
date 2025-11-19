import { mockColors } from '../../wine-types/entities/mock'
import { WineTasteCharacteristics } from './types/taste-characteristics'

export const mockTasteCharacteristics: WineTasteCharacteristics[] = [
  {
    id: 'sweetness',
    nameUa: 'Солодкість',
    nameEn: 'Sweetness',
    sortNumber: 1,
    levels: [
      {
        id: 'dry',
        nameUa: 'сухе',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'off-dry',
        nameUa: 'напівсухе',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'semi-sweet',
        nameUa: 'напівсолодке',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'sweet',
        nameUa: 'солодке',
        nameEn: '',
        sortNumber: 4,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'acidity',
    nameUa: 'Кислотність',
    nameEn: 'Acidity',

    sortNumber: 2,
    levels: [
      {
        id: 'low-acid',
        nameUa: 'низька',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'medium-acid',
        nameUa: 'середня',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'high-acid',
        nameUa: 'висока',
        nameEn: '',
        sortNumber: 3,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'tannin-level',
    nameUa: 'Рівень танінів',
    nameEn: 'Tannin Level',

    sortNumber: 3,
    levels: [
      {
        id: 'low-tannin',
        nameUa: 'низький',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'medium-tannin',
        nameUa: 'середній',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'high-tannin',
        nameUa: 'високий',
        nameEn: '',
        sortNumber: 3,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'tannin-intensity',
    nameUa: 'Інтенсивність танінів',
    nameEn: 'Tannin Intensity',

    sortNumber: 4,
    levels: [
      {
        id: 'soft-tannin',
        nameUa: 'м"які',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'moderate-tannin',
        nameUa: 'помірні',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'firm-tannin',
        nameUa: 'тверді',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'aggressive-tannin',
        nameUa: 'агресивні',
        nameEn: '',
        sortNumber: 4,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'alcohol',
    nameUa: 'Алкоголь',
    nameEn: 'Alcohol',

    sortNumber: 5,
    levels: [
      {
        id: 'low-alcohol',
        nameUa: 'низький',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'soft-alcohol',
        nameUa: 'м"який',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'moderate-alcohol',
        nameUa: 'помірний',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'high-alcohol',
        nameUa: 'високий',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'powerful-alcohol',
        nameUa: 'потужний',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'body',
    nameUa: 'Тіло',
    nameEn: 'Body',

    sortNumber: 6,
    levels: [
      {
        id: 'very-light',
        nameUa: 'надлегке',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'light',
        nameUa: 'легке',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'medium',
        nameUa: 'середнє',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'full',
        nameUa: 'щільне',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'very-full',
        nameUa: 'насичене',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'finish',
    nameUa: 'Післясмак',
    nameEn: 'Finish',

    sortNumber: 7,
    levels: [
      {
        id: 'instant',
        nameUa: 'миттєвий',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'short',
        nameUa: 'короткий',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'medium-finish',
        nameUa: 'середній',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'long',
        nameUa: 'довгий',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'very-long',
        nameUa: 'дуже довгий',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'wine-peak',
    nameUa: 'Пік вина',
    nameEn: 'Wine Peak',

    sortNumber: 8,
    levels: [
      {
        id: 'young',
        nameUa: 'молоде',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'approaching',
        nameUa: 'на підході',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'at-peak',
        nameUa: 'в піку',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'past-peak',
        nameUa: 'після піку',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'old',
        nameUa: 'старе',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'complexity',
    nameUa: 'Складність',
    nameEn: 'Complexity',

    sortNumber: 9,
    levels: [
      {
        id: 'simple',
        nameUa: 'просте',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'moderately-complex',
        nameUa: 'помірно складне',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'complex',
        nameUa: 'складне',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'very-complex',
        nameUa: 'дуже складне',
        nameEn: '',
        sortNumber: 4,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'viscosity',
    nameUa: "В'язкість",
    nameEn: 'Viscosity',

    sortNumber: 10,
    levels: [
      {
        id: 'watery',
        nameUa: 'водяниста',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'light-viscosity',
        nameUa: 'легка',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'medium-viscosity',
        nameUa: 'середня',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'oily',
        nameUa: 'оліїста',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'syrupy',
        nameUa: 'сиропоподібна',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'oak',
    nameUa: 'Дуб',
    nameEn: 'Oak',

    sortNumber: 11,
    levels: [
      {
        id: 'none',
        nameUa: 'відсутній',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'subtle',
        nameUa: 'легкий',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'noticeable',
        nameUa: 'помірний',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'pronounced',
        nameUa: 'виражений',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'dominant',
        nameUa: 'домінуючий',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
  {
    id: 'fruitness',
    nameUa: 'Фруктовість',
    nameEn: 'Fruitness',

    sortNumber: 12,
    levels: [
      {
        id: 'non-fruity',
        nameUa: 'нефруктове',
        nameEn: '',
        sortNumber: 1,
      },
      {
        id: 'lightly-fruity',
        nameUa: 'легка фруктовість',
        nameEn: '',
        sortNumber: 2,
      },
      {
        id: 'moderately-fruity',
        nameUa: 'помірна фруктовість',
        nameEn: '',
        sortNumber: 3,
      },
      {
        id: 'very-fruity',
        nameUa: 'виражена фруктовість',
        nameEn: '',
        sortNumber: 4,
      },
      {
        id: 'overripe-fruity',
        nameUa: 'переспіла фруктовість',
        nameEn: '',
        sortNumber: 5,
      },
    ],
    colors: mockColors,
  },
]
