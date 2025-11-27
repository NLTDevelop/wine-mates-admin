import { mockBaseWineColors } from '../../general/entities/mockBaseColor'
import { WineTasteCharacteristics } from './taste-characteristics'

export const mockWineTasteCharacteristics: WineTasteCharacteristics[] = [
  {
    id: 'body',
    translations: [
      { name: 'Тіло вина', language: 'uk' },
      { name: 'Wine Body', language: 'en' },
    ],
    description: 'Щільність та текстура вина у роті',
    colorHex: '#8B4513',
    colors: [mockBaseWineColors[0], mockBaseWineColors[1]],
    sortNumber: 0,
    levels: [
      {
        id: 'light',
        translations: [
          { name: 'Легке', language: 'uk' },
          { name: 'Light', language: 'en' },
        ],
        sortNumber: 0,
      },
      {
        id: 'medium',
        translations: [
          { name: 'Середнє', language: 'uk' },
          { name: 'Medium', language: 'en' },
        ],
        sortNumber: 1,
      },
      {
        id: 'full',
        translations: [
          { name: 'Повнотіле', language: 'uk' },
          { name: 'Full-bodied', language: 'en' },
        ],
        sortNumber: 2,
      },
    ],
  },
  {
    id: 'acidity',
    translations: [
      { name: 'Кислотність', language: 'uk' },
      { name: 'Acidity', language: 'en' },
    ],
    description: 'Рівень кислоти у вині',
    colorHex: '#90EE90',
    colors: [mockBaseWineColors[1], mockBaseWineColors[2]],
    sortNumber: 1,
    levels: [
      {
        id: 'low',
        translations: [
          { name: 'Низька', language: 'uk' },
          { name: 'Low', language: 'en' },
        ],
        sortNumber: 0,
      },
      {
        id: 'medium',
        translations: [
          { name: 'Середня', language: 'uk' },
          { name: 'Medium', language: 'en' },
        ],
        sortNumber: 1,
      },
      {
        id: 'high',
        translations: [
          { name: 'Висока', language: 'uk' },
          { name: 'High', language: 'en' },
        ],
        sortNumber: 2,
      },
    ],
  },
  {
    id: 'tannins',
    translations: [
      { name: 'Таніни', language: 'uk' },
      { name: 'Tannins', language: 'en' },
    ],
    description: 'Рівень танінів у червоних винах',
    colorHex: '#A0522D',
    colors: [mockBaseWineColors[2], mockBaseWineColors[3]],
    sortNumber: 2,
    levels: [
      {
        id: 'soft',
        translations: [
          { name: "М'які", language: 'uk' },
          { name: 'Soft', language: 'en' },
        ],
        sortNumber: 0,
      },
      {
        id: 'medium',
        translations: [
          { name: 'Середні', language: 'uk' },
          { name: 'Medium', language: 'en' },
        ],
        sortNumber: 1,
      },
      {
        id: 'firm',
        translations: [
          { name: 'Міцні', language: 'uk' },
          { name: 'Firm', language: 'en' },
        ],
        sortNumber: 2,
      },
    ],
  },
  {
    id: 'sweetness',
    translations: [
      { name: 'Солодкість', language: 'uk' },
      { name: 'Sweetness', language: 'en' },
    ],
    description: 'Рівень залишкового цукру',
    colorHex: '#FFD700',
    colors: [mockBaseWineColors[3], mockBaseWineColors[4]],
    sortNumber: 3,
    levels: [
      {
        id: 'dry',
        translations: [
          { name: 'Сухе', language: 'uk' },
          { name: 'Dry', language: 'en' },
        ],
        sortNumber: 0,
      },
      {
        id: 'off-dry',
        translations: [
          { name: 'Напівсухе', language: 'uk' },
          { name: 'Off-dry', language: 'en' },
        ],
        sortNumber: 1,
      },
      {
        id: 'sweet',
        translations: [
          { name: 'Солодке', language: 'uk' },
          { name: 'Sweet', language: 'en' },
        ],
        sortNumber: 2,
      },
    ],
  },
  {
    id: 'alcohol',
    translations: [
      { name: 'Алкоголь', language: 'uk' },
      { name: 'Alcohol', language: 'en' },
    ],
    description: 'Рівень алкоголю у вині',
    colorHex: '#FF6B6B',
    colors: [mockBaseWineColors[4], mockBaseWineColors[0]],
    sortNumber: 4,
    levels: [
      {
        id: 'low',
        translations: [
          { name: 'Низький', language: 'uk' },
          { name: 'Low', language: 'en' },
        ],
        sortNumber: 0,
      },
      {
        id: 'medium',
        translations: [
          { name: 'Середній', language: 'uk' },
          { name: 'Medium', language: 'en' },
        ],
        sortNumber: 1,
      },
      {
        id: 'high',
        translations: [
          { name: 'Високий', language: 'uk' },
          { name: 'High', language: 'en' },
        ],
        sortNumber: 2,
      },
    ],
  },
]
