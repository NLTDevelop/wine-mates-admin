import { mockBaseWineColors } from '../../general/entities/mockBaseColor'
import { WineAromaGroup } from './types/flavor-types'

export const mockAromaGroups: WineAromaGroup[] = [
  {
    id: '1',
    translations: [
      { name: 'Фруктові аромати', language: 'ua' },
      { name: 'Fruit Aromas', language: 'en' },
      { name: 'Arômes Fruités', language: 'fr' }
    ],
    colorHex: '#FF6B6B',
    sortNumber: 1,
    subgroups: [
      {
        id: '1-1',
        translations: [
          { name: 'Цитрусові', language: 'ua' },
          { name: 'Citrus', language: 'en' },
          { name: 'Cítricos', language: 'es' }
        ],
        colorHex: '#FFD93D',
        sortNumber: 1,
        aromas: [
          {
            id: '1-1-1',
            translations: [
              { name: 'Лимон', language: 'ua' },
              { name: 'Lemon', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 1,
          },
          {
            id: '1-1-2',
            translations: [
              { name: 'Апельсин', language: 'ua' },
              { name: 'Orange', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 2,
          },
          {
            id: '1-1-3',
            translations: [
              { name: 'Грейпфрут', language: 'ua' },
              { name: 'Grapefruit', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 3,
          },
        ],
      },
      {
        id: '1-2',
        translations: [
          { name: 'Ягідні', language: 'ua' },
          { name: 'Berry', language: 'en' }
        ],
        colorHex: '#E84393',
        sortNumber: 2,
        aromas: [
          {
            id: '1-2-1',
            translations: [
              { name: 'Полуниця', language: 'ua' },
              { name: 'Strawberry', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 1,
          },
          {
            id: '1-2-2',
            translations: [
              { name: 'Малина', language: 'ua' },
              { name: 'Raspberry', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 2,
          },
          {
            id: '1-2-3',
            translations: [
              { name: 'Чорниця', language: 'ua' },
              { name: 'Blueberry', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 3,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '2',
    translations: [
      { name: 'Ягідні аромати', language: 'ua' },
      { name: 'Berry Aromas', language: 'en' }
    ],
    colorHex: '#E84393',
    sortNumber: 2,
    subgroups: [
      {
        id: '2-1',
        translations: [
          { name: 'Лісові ягоди', language: 'ua' },
          { name: 'Forest Berries', language: 'en' }
        ],
        colorHex: '#C2185B',
        sortNumber: 1,
        aromas: [
          {
            id: '2-1-1',
            translations: [
              { name: 'Суниця', language: 'ua' },
              { name: 'Wild Strawberry', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 1,
          },
          {
            id: '2-1-2',
            translations: [
              { name: 'Чорна смородина', language: 'ua' },
              { name: 'Blackcurrant', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 2,
          },
          {
            id: '2-1-3',
            translations: [
              { name: 'Журавлина', language: 'ua' },
              { name: 'Cranberry', language: 'en' }
            ],
            colorHex: '#F075B3',
            sortNumber: 3,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '3',
    translations: [
      { name: 'Цитрусові аромати', language: 'ua' },
      { name: 'Citrus Aromas', language: 'en' }
    ],
    colorHex: '#FFD93D',
    sortNumber: 3,
    subgroups: [
      {
        id: '3-1',
        translations: [
          { name: 'Цитрусові', language: 'ua' },
          { name: 'Citrus', language: 'en' }
        ],
        colorHex: '#FFC107',
        sortNumber: 1,
        aromas: [
          {
            id: '3-1-1',
            translations: [
              { name: 'Лимон', language: 'ua' },
              { name: 'Lemon', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 1,
          },
          {
            id: '3-1-2',
            translations: [
              { name: 'Лайм', language: 'ua' },
              { name: 'Lime', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 2,
          },
          {
            id: '3-1-3',
            translations: [
              { name: 'Грейпфрут', language: 'ua' },
              { name: 'Grapefruit', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 3,
          },
          {
            id: '3-1-4',
            translations: [
              { name: 'Помело', language: 'ua' },
              { name: 'Pomelo', language: 'en' }
            ],
            colorHex: '#FFE785',
            sortNumber: 4,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '4',
    translations: [
      { name: 'Квіткові аромати', language: 'ua' },
      { name: 'Floral Aromas', language: 'en' }
    ],
    colorHex: '#A29BFE',
    sortNumber: 4,
    subgroups: [
      {
        id: '4-1',
        translations: [
          { name: 'Квіти', language: 'ua' },
          { name: 'Flowers', language: 'en' }
        ],
        colorHex: '#7E57C2',
        sortNumber: 1,
        aromas: [
          {
            id: '4-1-1',
            translations: [
              { name: 'Троянда', language: 'ua' },
              { name: 'Rose', language: 'en' }
            ],
            colorHex: '#C7C3FF',
            sortNumber: 1,
          },
          {
            id: '4-1-2',
            translations: [
              { name: 'Жасмин', language: 'ua' },
              { name: 'Jasmine', language: 'en' }
            ],
            colorHex: '#C7C3FF',
            sortNumber: 2,
          },
          {
            id: '4-1-3',
            translations: [
              { name: 'Бузок', language: 'ua' },
              { name: 'Lilac', language: 'en' }
            ],
            colorHex: '#C7C3FF',
            sortNumber: 3,
          },
          {
            id: '4-1-4',
            translations: [
              { name: 'Фіалка', language: 'ua' },
              { name: 'Violet', language: 'en' }
            ],
            colorHex: '#C7C3FF',
            sortNumber: 4,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '5',
    translations: [
      { name: 'Пряні аромати', language: 'ua' },
      { name: 'Spicy Aromas', language: 'en' }
    ],
    colorHex: '#6BCF7F',
    sortNumber: 5,
    subgroups: [
      {
        id: '5-1',
        translations: [
          { name: 'Прянощі', language: 'ua' },
          { name: 'Spices', language: 'en' }
        ],
        colorHex: '#388E3C',
        sortNumber: 1,
        aromas: [
          {
            id: '5-1-1',
            translations: [
              { name: 'Ваніль', language: 'ua' },
              { name: 'Vanilla', language: 'en' }
            ],
            colorHex: '#9DDFAB',
            sortNumber: 1,
          },
          {
            id: '5-1-2',
            translations: [
              { name: 'Кориця', language: 'ua' },
              { name: 'Cinnamon', language: 'en' }
            ],
            colorHex: '#9DDFAB',
            sortNumber: 2,
          },
          {
            id: '5-1-3',
            translations: [
              { name: 'Перець', language: 'ua' },
              { name: 'Pepper', language: 'en' }
            ],
            colorHex: '#9DDFAB',
            sortNumber: 3,
          },
          {
            id: '5-1-4',
            translations: [
              { name: 'Гвоздика', language: 'ua' },
              { name: 'Clove', language: 'en' }
            ],
            colorHex: '#9DDFAB',
            sortNumber: 4,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '6',
    translations: [
      { name: 'Горіхові аромати', language: 'ua' },
      { name: 'Nutty Aromas', language: 'en' }
    ],
    colorHex: '#8B4513',
    sortNumber: 6,
    subgroups: [
      {
        id: '6-1',
        translations: [
          { name: 'Горіхи', language: 'ua' },
          { name: 'Nuts', language: 'en' }
        ],
        colorHex: '#5D4037',
        sortNumber: 1,
        aromas: [
          {
            id: '6-1-1',
            translations: [
              { name: 'Мигдаль', language: 'ua' },
              { name: 'Almond', language: 'en' }
            ],
            colorHex: '#B57945',
            sortNumber: 1,
          },
          {
            id: '6-1-2',
            translations: [
              { name: 'Фундук', language: 'ua' },
              { name: 'Hazelnut', language: 'en' }
            ],
            colorHex: '#B57945',
            sortNumber: 2,
          },
          {
            id: '6-1-3',
            translations: [
              { name: 'Горіх', language: 'ua' },
              { name: 'Walnut', language: 'en' }
            ],
            colorHex: '#B57945',
            sortNumber: 3,
          },
          {
            id: '6-1-4',
            translations: [
              { name: 'Кешью', language: 'ua' },
              { name: 'Cashew', language: 'en' }
            ],
            colorHex: '#B57945',
            sortNumber: 4,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '7',
    translations: [
      { name: 'Деревні аромати', language: 'ua' },
      { name: 'Woody Aromas', language: 'en' }
    ],
    colorHex: '#CD6133',
    sortNumber: 7,
    subgroups: [
      {
        id: '7-1',
        translations: [
          { name: 'Деревина', language: 'ua' },
          { name: 'Wood', language: 'en' }
        ],
        colorHex: '#8D6E63',
        sortNumber: 1,
        aromas: [
          {
            id: '7-1-1',
            translations: [
              { name: 'Дуб', language: 'ua' },
              { name: 'Oak', language: 'en' }
            ],
            colorHex: '#DE8B65',
            sortNumber: 1,
          },
          {
            id: '7-1-2',
            translations: [
              { name: 'Кедр', language: 'ua' },
              { name: 'Cedar', language: 'en' }
            ],
            colorHex: '#DE8B65',
            sortNumber: 2,
          },
          {
            id: '7-1-3',
            translations: [
              { name: 'Смола', language: 'ua' },
              { name: 'Resin', language: 'en' }
            ],
            colorHex: '#DE8B65',
            sortNumber: 3,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '8',
    translations: [
      { name: 'Земляні аромати', language: 'ua' },
      { name: 'Earthy Aromas', language: 'en' }
    ],
    colorHex: '#795548',
    sortNumber: 8,
    subgroups: [
      {
        id: '8-1',
        translations: [
          { name: 'Гриби', language: 'ua' },
          { name: 'Mushrooms', language: 'en' }
        ],
        colorHex: '#6D4C41',
        sortNumber: 1,
        aromas: [
          {
            id: '8-1-1',
            translations: [
              { name: 'Трюфель', language: 'ua' },
              { name: 'Truffle', language: 'en' }
            ],
            colorHex: '#9E7A6B',
            sortNumber: 1,
          },
          {
            id: '8-1-2',
            translations: [
              { name: 'Печериці', language: 'ua' },
              { name: 'Champignon', language: 'en' }
            ],
            colorHex: '#9E7A6B',
            sortNumber: 2,
          },
          {
            id: '8-1-3',
            translations: [
              { name: 'Боровики', language: 'ua' },
              { name: 'Porcini', language: 'en' }
            ],
            colorHex: '#9E7A6B',
            sortNumber: 3,
          },
        ],
      },
    ],
    colors: mockBaseWineColors,
  },
  {
    id: '9',
    translations: [
      { name: 'Фруктові', language: 'ua' },
      { name: 'Fruity', language: 'en' }
    ],
    colorHex: '#FF6B6B',
    sortNumber: 9,
    subgroups: [],
    colors: mockBaseWineColors,
  },
  {
    id: '10',
    translations: [
      { name: 'Квіткові', language: 'ua' },
      { name: 'Floral', language: 'en' }
    ],
    colorHex: '#A29BFE',
    sortNumber: 10,
    subgroups: [],
    colors: mockBaseWineColors,
  },
  {
    id: '11',
    translations: [
      { name: 'Пряні', language: 'ua' },
      { name: 'Spicy', language: 'en' }
    ],
    colorHex: '#6BCF7F',
    sortNumber: 11,
    subgroups: [],
    colors: mockBaseWineColors,
  },
  {
    id: '12',
    translations: [
      { name: 'Деревні', language: 'ua' },
      { name: 'Woody', language: 'en' }
    ],
    colorHex: '#CD6133',
    sortNumber: 12,
    subgroups: [],
    colors: mockBaseWineColors,
  },
]

export const mockAromaItems = [
  {
    id: '1-1-1',
    translations: [
      { name: 'Лимон', language: 'ua' },
      { name: 'Lemon', language: 'en' }
    ],
    colorHex: '#FFE785',
    sortNumber: 1,
  },
  {
    id: '1-1-2',
    translations: [
      { name: 'Апельсин', language: 'ua' },
      { name: 'Orange', language: 'en' }
    ],
    colorHex: '#FFE785',
    sortNumber: 2,
  },
  {
    id: '4-1-1',
    translations: [
      { name: 'Троянда', language: 'ua' },
      { name: 'Rose', language: 'en' }
    ],
    colorHex: '#C7C3FF',
    sortNumber: 1,
  },
  {
    id: '5-1-1',
    translations: [
      { name: 'Ваніль', language: 'ua' },
      { name: 'Vanilla', language: 'en' }
    ],
    colorHex: '#9DDFAB',
    sortNumber: 1,
  },
]