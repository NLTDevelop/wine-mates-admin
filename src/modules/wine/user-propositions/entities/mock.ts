import { IPropositions } from './types/types'

const getRandomDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString()
}

export const aromaPropositionsMock: IPropositions[] = [
  {
    id: 101,
    type: 'aroma',
    aroma: 'Цитрусовые',
    created_at: getRandomDate(30),
  },
  {
    id: 102,
    type: 'aroma',
    aroma: 'Ягодные',
    created_at: getRandomDate(28),
  },
  {
    id: 103,
    type: 'aroma',
    aroma: 'Цветочные',
    created_at: getRandomDate(25),
  },
  {
    id: 104,
    type: 'aroma',
    aroma: 'Травянистые',
    created_at: getRandomDate(22),
  },
  {
    id: 105,
    type: 'aroma',
    aroma: 'Древесные',
    created_at: getRandomDate(20),
  },
  {
    id: 106,
    type: 'aroma',
    aroma: 'Пряные',
    created_at: getRandomDate(18),
  },
  {
    id: 107,
    type: 'aroma',
    aroma: 'Ореховые',
    created_at: getRandomDate(15),
  },
  {
    id: 108,
    type: 'aroma',
    aroma: 'Ванильные',
    created_at: getRandomDate(12),
  },
  {
    id: 109,
    type: 'aroma',
    aroma: 'Медовые',
    created_at: getRandomDate(8),
  },
  {
    id: 110,
    type: 'aroma',
    aroma: 'Шоколадные',
    created_at: getRandomDate(5),
  },
]

export const tastePropositionsMock: IPropositions[] = [
  {
    id: 1,
    type: 'taste',
    taste: 'Сладкий',
    created_at: getRandomDate(30),
  },
  {
    id: 2,
    type: 'taste',
    taste: 'Кислый',
    created_at: getRandomDate(25),
  },
  {
    id: 3,
    type: 'taste',
    taste: 'Горький',
    created_at: getRandomDate(20),
  },
  {
    id: 4,
    type: 'taste',
    taste: 'Соленый',
    created_at: getRandomDate(15),
  },
  {
    id: 5,
    type: 'taste',
    taste: 'Умами',
    created_at: getRandomDate(10),
  },
  {
    id: 6,
    type: 'taste',
    taste: 'Пряный',
    created_at: getRandomDate(5),
  },
  {
    id: 7,
    type: 'taste',
    taste: 'Острый',
    created_at: getRandomDate(3),
  },
  {
    id: 8,
    type: 'taste',
    taste: 'Терпкий',
    created_at: getRandomDate(2),
  },
  {
    id: 9,
    type: 'taste',
    taste: 'Металлический',
    created_at: getRandomDate(1),
  },
  {
    id: 10,
    type: 'taste',
    taste: 'Миндальный',
    created_at: getRandomDate(30),
  },
]

export const allPropositionsMock: IPropositions[] = [...tastePropositionsMock, ...aromaPropositionsMock]
