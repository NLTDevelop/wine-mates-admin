import { WineTasteCharacteristics } from './types/taste-characteristics'

export const mockTasteCharacteristics: WineTasteCharacteristics[] = [
  {
    id: 'sweetness',
    label: 'Солодкість',
    labelEn: 'Sweetness',
    order: 1,
    levels: [
      {
        id: 'dry',
        levelName: 'сухе',
        order: 1,
      },
      {
        id: 'off-dry',
        levelName: 'напівсухе',
        order: 2,
      },
      {
        id: 'semi-sweet',
        levelName: 'напівсолодке',
        order: 3,
      },
      {
        id: 'sweet',
        levelName: 'солодке',
        order: 4,
      },
    ],
  },
  {
    id: 'acidity',
    label: 'Кислотність',
    labelEn: 'Acidity',
    order: 2,
    levels: [
      {
        id: 'low-acid',
        levelName: 'низька',
        order: 1,
      },
      {
        id: 'medium-acid',
        levelName: 'середня',
        order: 2,
      },
      {
        id: 'high-acid',
        levelName: 'висока',
        order: 3,
      },
    ],
  },
  {
    id: 'tannin-level',
    label: 'Рівень танінів',
    labelEn: 'Tannin Level',
    order: 3,
    levels: [
      {
        id: 'low-tannin',
        levelName: 'низький',
        order: 1,
      },
      {
        id: 'medium-tannin',
        levelName: 'середній',
        order: 2,
      },
      {
        id: 'high-tannin',
        levelName: 'високий',
        order: 3,
      },
    ],
  },
  {
    id: 'tannin-intensity',
    label: 'Інтенсивність танінів',
    labelEn: 'Tannin Intensity',
    order: 4,
    levels: [
      {
        id: 'soft-tannin',
        levelName: 'м"які',
        order: 1,
      },
      {
        id: 'moderate-tannin',
        levelName: 'помірні',
        order: 2,
      },
      {
        id: 'firm-tannin',
        levelName: 'тверді',
        order: 3,
      },
      {
        id: 'aggressive-tannin',
        levelName: 'агресивні',
        order: 4,
      },
    ],
  },
  {
    id: 'alcohol',
    label: 'Алкоголь',
    labelEn: 'Alcohol',
    order: 5,
    levels: [
      {
        id: 'low-alcohol',
        levelName: 'низький',
        order: 1,
      },
      {
        id: 'soft-alcohol',
        levelName: 'м"який',
        order: 2,
      },
      {
        id: 'moderate-alcohol',
        levelName: 'помірний',
        order: 3,
      },
      {
        id: 'high-alcohol',
        levelName: 'високий',
        order: 4,
      },
      {
        id: 'powerful-alcohol',
        levelName: 'потужний',
        order: 5,
      },
    ],
  },
  {
    id: 'body',
    label: 'Тіло',
    labelEn: 'Body',
    order: 6,
    levels: [
      {
        id: 'very-light',
        levelName: 'надлегке',
        order: 1,
      },
      {
        id: 'light',
        levelName: 'легке',
        order: 2,
      },
      {
        id: 'medium',
        levelName: 'середнє',
        order: 3,
      },
      {
        id: 'full',
        levelName: 'щільне',
        order: 4,
      },
      {
        id: 'very-full',
        levelName: 'насичене',
        order: 5,
      },
    ],
  },
  {
    id: 'finish',
    label: 'Післясмак',
    labelEn: 'Finish',
    order: 7,
    levels: [
      {
        id: 'instant',
        levelName: 'миттєвий',
        order: 1,
      },
      {
        id: 'short',
        levelName: 'короткий',
        order: 2,
      },
      {
        id: 'medium-finish',
        levelName: 'середній',
        order: 3,
      },
      {
        id: 'long',
        levelName: 'довгий',
        order: 4,
      },
      {
        id: 'very-long',
        levelName: 'дуже довгий',
        order: 5,
      },
    ],
  },
  {
    id: 'wine-peak',
    label: 'Пік вина',
    labelEn: 'Wine Peak',
    order: 8,
    levels: [
      {
        id: 'young',
        levelName: 'молоде',
        order: 1,
      },
      {
        id: 'approaching',
        levelName: 'на підході',
        order: 2,
      },
      {
        id: 'at-peak',
        levelName: 'в піку',
        order: 3,
      },
      {
        id: 'past-peak',
        levelName: 'після піку',
        order: 4,
      },
      {
        id: 'old',
        levelName: 'старе',
        order: 5,
      },
    ],
  },
  {
    id: 'complexity',
    label: 'Складність',
    labelEn: 'Complexity',
    order: 9,
    levels: [
      {
        id: 'simple',
        levelName: 'просте',
        order: 1,
      },
      {
        id: 'moderately-complex',
        levelName: 'помірно складне',
        order: 2,
      },
      {
        id: 'complex',
        levelName: 'складне',
        order: 3,
      },
      {
        id: 'very-complex',
        levelName: 'дуже складне',
        order: 4,
      },
    ],
  },
  {
    id: 'viscosity',
    label: "В'язкість",
    labelEn: 'Viscosity',
    order: 10,
    levels: [
      {
        id: 'watery',
        levelName: 'водяниста',
        order: 1,
      },
      {
        id: 'light-viscosity',
        levelName: 'легка',
        order: 2,
      },
      {
        id: 'medium-viscosity',
        levelName: 'середня',
        order: 3,
      },
      {
        id: 'oily',
        levelName: 'оліїста',
        order: 4,
      },
      {
        id: 'syrupy',
        levelName: 'сиропоподібна',
        order: 5,
      },
    ],
  },
  {
    id: 'oak',
    label: 'Дуб',
    labelEn: 'Oak',
    order: 11,
    levels: [
      {
        id: 'none',
        levelName: 'відсутній',
        order: 1,
      },
      {
        id: 'subtle',
        levelName: 'легкий',
        order: 2,
      },
      {
        id: 'noticeable',
        levelName: 'помірний',
        order: 3,
      },
      {
        id: 'pronounced',
        levelName: 'виражений',
        order: 4,
      },
      {
        id: 'dominant',
        levelName: 'домінуючий',
        order: 5,
      },
    ],
  },
  {
    id: 'fruitness',
    label: 'Фруктовість',
    labelEn: 'Fruitness',
    order: 12,
    levels: [
      {
        id: 'non-fruity',
        levelName: 'нефруктове',
        order: 1,
      },
      {
        id: 'lightly-fruity',
        levelName: 'легка фруктовість',
        order: 2,
      },
      {
        id: 'moderately-fruity',
        levelName: 'помірна фруктовість',
        order: 3,
      },
      {
        id: 'very-fruity',
        levelName: 'виражена фруктовість',
        order: 4,
      },
      {
        id: 'overripe-fruity',
        levelName: 'переспіла фруктовість',
        order: 5,
      },
    ],
  },
]
