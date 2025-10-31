import { WineAromaGroup } from './types/flavor'

export const mockAromaGroups: WineAromaGroup[] = [
  {
    id: '1',
    label: 'Фруктові аромати',
    labelEn: 'Fruit Aromas',
    value: '#FF6B6B',
    items: [
      {
        id: '1-1',
        name: 'Яблуко',
        nameEn: 'Apple',
        value: '#FF9B9B',
        state: [
          { id: '1-1-1', stateName: 'зелене', order: 0 },
          { id: '1-1-2', stateName: 'червоне', order: 1 },
          { id: '1-1-3', stateName: 'печене', order: 2 },
          { id: '1-1-4', stateName: 'сушене', order: 3 },
        ],
      },
      {
        id: '1-2',
        name: 'Груша',
        nameEn: 'Pear',
        value: '#FF9B9B',
        state: [
          { id: '1-2-1', stateName: 'стигла', order: 0 },
          { id: '1-2-2', stateName: 'консервована', order: 1 },
        ],
      },
      {
        id: '1-3',
        name: 'Персик',
        nameEn: 'Peach',
        value: '#FF9B9B',
        state: [
          { id: '1-3-1', stateName: 'стиглий', order: 0 },
          { id: '1-3-2', stateName: 'нектарин', order: 1 },
        ],
      },
      {
        id: '1-4',
        name: 'Абрикос',
        nameEn: 'Apricot',
        value: '#FF9B9B',
        state: [], // пустой массив состояний
      },
      {
        id: '1-5',
        name: 'Вишня',
        nameEn: 'Cherry',
        value: '#FF9B9B',
        state: [
          { id: '1-5-1', stateName: 'свіжа', order: 0 },
          { id: '1-5-2', stateName: 'маринована', order: 1 },
          { id: '1-5-3', stateName: 'вишневий лікер', order: 2 },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Ягідні аромати',
    labelEn: 'Berry Aromas',
    value: '#E84393',
    items: [
      {
        id: '2-1',
        name: 'Полуниця',
        nameEn: 'Strawberry',
        value: '#F075B3',
        state: [
          { id: '2-1-1', stateName: 'лісова', order: 0 },
          { id: '2-1-2', stateName: 'садова', order: 1 },
          { id: '2-1-3', stateName: 'сушена', order: 2 },
        ],
      },
      {
        id: '2-2',
        name: 'Малина',
        nameEn: 'Raspberry',
        value: '#F075B3',
        state: [], // пустой массив состояний
      },
      {
        id: '2-3',
        name: 'Чорниця',
        nameEn: 'Blueberry',
        value: '#F075B3',
        state: [
          { id: '2-3-1', stateName: 'свіжа', order: 0 },
          { id: '2-3-2', stateName: 'варена', order: 1 },
        ],
      },
      {
        id: '2-4',
        name: 'Чорна смородина',
        nameEn: 'Blackcurrant',
        value: '#F075B3',
        state: [
          { id: '2-4-1', stateName: 'свіжа', order: 0 },
          { id: '2-4-2', stateName: 'листя', order: 1 },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'Цитрусові аромати',
    labelEn: 'Citrus Aromas',
    value: '#FFD93D',
    items: [
      {
        id: '3-1',
        name: 'Лимон',
        nameEn: 'Lemon',
        value: '#FFE785',
        state: [
          { id: '3-1-1', stateName: 'цедра', order: 0 },
          { id: '3-1-2', stateName: 'сік', order: 1 },
          { id: '3-1-3', stateName: 'конфі', order: 2 },
        ],
      },
      {
        id: '3-2',
        name: 'Лайм',
        nameEn: 'Lime',
        value: '#FFE785',
        state: [], // пустой массив состояний
      },
      {
        id: '3-3',
        name: 'Грейпфрут',
        nameEn: 'Grapefruit',
        value: '#FFE785',
        state: [
          { id: '3-3-1', stateName: 'рожевий', order: 0 },
          { id: '3-3-2', stateName: 'білий', order: 1 },
        ],
      },
      {
        id: '3-4',
        name: 'Апельсин',
        nameEn: 'Orange',
        value: '#FFE785',
        state: [
          { id: '3-4-1', stateName: 'цедра', order: 0 },
          { id: '3-4-2', stateName: 'мармелад', order: 1 },
        ],
      },
    ],
  },
  {
    id: '4',
    label: 'Квіткові аромати',
    labelEn: 'Floral Aromas',
    value: '#A29BFE',
    items: [
      {
        id: '4-1',
        name: 'Троянда',
        nameEn: 'Rose',
        value: '#C7C3FF',
        state: [
          { id: '4-1-1', stateName: 'червона', order: 0 },
          { id: '4-1-2', stateName: 'біла', order: 1 },
          { id: '4-1-3', stateName: 'шипшина', order: 2 },
        ],
      },
      {
        id: '4-2',
        name: 'Бузок',
        nameEn: 'Lilac',
        value: '#C7C3FF',
        state: [], // пустой массив состояний
      },
      {
        id: '4-3',
        name: 'Жасмин',
        nameEn: 'Jasmine',
        value: '#C7C3FF',
        state: [
          { id: '4-3-1', stateName: 'свіжий', order: 0 },
          { id: '4-3-2', stateName: 'чай', order: 1 },
        ],
      },
      {
        id: '4-4',
        name: 'Фіалка',
        nameEn: 'Violet',
        value: '#C7C3FF',
        state: [], // пустой массив состояний
      },
    ],
  },
  {
    id: '5',
    label: 'Пряні аромати',
    labelEn: 'Spicy Aromas',
    value: '#6BCF7F',
    items: [
      {
        id: '5-1',
        name: 'Ваніль',
        nameEn: 'Vanilla',
        value: '#9DDFAB',
        state: [
          { id: '5-1-1', stateName: 'стручок', order: 0 },
          { id: '5-1-2', stateName: 'екстракт', order: 1 },
          { id: '5-1-3', stateName: 'цукор', order: 2 },
        ],
      },
      {
        id: '5-2',
        name: 'Кориця',
        nameEn: 'Cinnamon',
        value: '#9DDFAB',
        state: [
          { id: '5-2-1', stateName: 'молота', order: 0 },
          { id: '5-2-2', stateName: 'паличка', order: 1 },
        ],
      },
      {
        id: '5-3',
        name: 'Перець',
        nameEn: 'Pepper',
        value: '#9DDFAB',
        state: [], // пустой массив состояний
      },
      {
        id: '5-4',
        name: 'Гвоздика',
        nameEn: 'Clove',
        value: '#9DDFAB',
        state: [
          { id: '5-4-1', stateName: 'цвіт', order: 0 },
          { id: '5-4-2', stateName: 'пряність', order: 1 },
        ],
      },
    ],
  },
  {
    id: '6',
    label: 'Горіхові аромати',
    labelEn: 'Nutty Aromas',
    value: '#8B4513',
    items: [
      {
        id: '6-1',
        name: 'Мигдаль',
        nameEn: 'Almond',
        value: '#B57945',
        state: [
          { id: '6-1-1', stateName: 'свіжий', order: 0 },
          { id: '6-1-2', stateName: 'смажений', order: 1 },
          { id: '6-1-3', stateName: 'солодкий', order: 2 },
        ],
      },
      {
        id: '6-2',
        name: 'Фундук',
        nameEn: 'Hazelnut',
        value: '#B57945',
        state: [], // пустой массив состояний
      },
      {
        id: '6-3',
        name: 'Горіх',
        nameEn: 'Walnut',
        value: '#B57945',
        state: [
          { id: '6-3-1', stateName: 'свіжий', order: 0 },
          { id: '6-3-2', stateName: 'горіхова скорлупа', order: 1 },
        ],
      },
    ],
  },
  {
    id: '7',
    label: 'Деревні аромати',
    labelEn: 'Woody Aromas',
    value: '#CD6133',
    items: [
      {
        id: '7-1',
        name: 'Дуб',
        nameEn: 'Oak',
        value: '#DE8B65',
        state: [
          { id: '7-1-1', stateName: 'французький', order: 0 },
          { id: '7-1-2', stateName: 'американський', order: 1 },
          { id: '7-1-3', stateName: 'обпалений', order: 2 },
        ],
      },
      {
        id: '7-2',
        name: 'Кедр',
        nameEn: 'Cedar',
        value: '#DE8B65',
        state: [], // пустой массив состояний
      },
      {
        id: '7-3',
        name: 'Дим',
        nameEn: 'Smoke',
        value: '#DE8B65',
        state: [
          { id: '7-3-1', stateName: 'вологий', order: 0 },
          { id: '7-3-2', stateName: 'сухий', order: 1 },
        ],
      },
    ],
  },
  {
    id: '8',
    label: 'Земляні аромати',
    labelEn: 'Earthy Aromas',
    value: '#795548',
    items: [
      {
        id: '8-1',
        name: 'Гриби',
        nameEn: 'Mushroom',
        value: '#9E7A6B',
        state: [
          { id: '8-1-1', stateName: 'свіжі', order: 0 },
          { id: '8-1-2', stateName: 'сушені', order: 1 },
          { id: '8-1-3', stateName: 'трюфель', order: 2 },
        ],
      },
      {
        id: '8-2',
        name: 'Трюфель',
        nameEn: 'Truffle',
        value: '#9E7A6B',
        state: [
          { id: '8-2-1', stateName: 'чорний', order: 0 },
          { id: '8-2-2', stateName: 'білий', order: 1 },
        ],
      },
      {
        id: '8-3',
        name: 'Земля',
        nameEn: 'Earth',
        value: '#9E7A6B',
        state: [], // пустой массив состояний
      },
    ],
  },
  {
    id: '9',
    label: 'Фруктові',
    labelEn: 'Fruity',
    value: '#FF6B6B',
    items: [], // группа без элементов
  },
  {
    id: '10',
    label: 'Квіткові',
    labelEn: 'Floral',
    value: '#A29BFE',
    items: [], // группа без элементов
  },
  {
    id: '11',
    label: 'Пряні',
    labelEn: 'Spicy',
    value: '#6BCF7F',
    items: [], // группа без элементов
  },
  {
    id: '12',
    label: 'Деревні',
    labelEn: 'Woody',
    value: '#CD6133',
    items: [], // группа без элементов
  },
]

export const mockAromaItems = [
  {
    id: '1-1',
    name: 'Яблуко',
    nameEn: 'Apple',
    value: '#FF9B9B',
    state: [
      { id: '1-1-1', stateName: 'зелене', order: 0 },
      { id: '1-1-2', stateName: 'червоне', order: 1 },
      { id: '1-1-3', stateName: 'печене', order: 2 },
    ],
  },
  {
    id: '1-2',
    name: 'Груша',
    nameEn: 'Pear',
    value: '#FF9B9B',
    state: [
      { id: '1-2-1', stateName: 'стигла', order: 0 },
      { id: '1-2-2', stateName: 'консервована', order: 1 },
    ],
  },
  {
    id: '4-1',
    name: 'Троянда',
    nameEn: 'Rose',
    value: '#C7C3FF',
    state: [
      { id: '4-1-1', stateName: 'червона', order: 0 },
      { id: '4-1-2', stateName: 'біла', order: 1 },
    ],
  },
  {
    id: '5-1',
    name: 'Ваніль',
    nameEn: 'Vanilla',
    value: '#9DDFAB',
    state: [
      { id: '5-1-1', stateName: 'стручок', order: 0 },
      { id: '5-1-2', stateName: 'екстракт', order: 1 },
    ],
  },
]
