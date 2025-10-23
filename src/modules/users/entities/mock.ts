import { IUserTable, USER_CATEGORIES } from './IUser'

const mockUsers: IUserTable[] = [
  {
    id: '1',
    image: null,
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    country: 'USA',
    birthday: '1990-05-15',
    email: 'john.doe@example.com',
    category: USER_CATEGORIES.WINE_LOVER,
    isConfirm: true,
  },

  {
    id: '2',
    image: null,
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+0987654321',
    country: 'France',
    birthday: '1985-08-22',
    email: 'jane.smith@example.com',
    category: USER_CATEGORIES.WINE_EXPERT,
    isConfirm: false,
  },

  {
    id: '3',
    image: null,
    firstName: 'Alice',
    lastName: 'Brown',
    phoneNumber: '+1122334455',
    country: 'Italy',
    birthday: '1995-01-01',
    email: 'alice.brown@example.com',
    category: USER_CATEGORIES.WINE_LOVER,
    isConfirm: true,
  },

  {
    id: '4',
    image: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    category: USER_CATEGORIES.WINE_EXPERT,
    isConfirm: false,
  },
  {
    id: '5',
    image: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    category: USER_CATEGORIES.WINEMAKER,
    isConfirm: false,
  },
  {
    id: '6',
    image: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    category: USER_CATEGORIES.WINEMAKER,
    isConfirm: false,
  },
]

export const MOCK_USERS = {
  rows: mockUsers,
  count: mockUsers.length,
}
