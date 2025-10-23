import { IUserTable, USER_CATEGORIES } from './IUser'

const mockUsers: IUserTable[] = [
  {
    id: '1',
    avatarUrl: null,
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    country: 'USA',
    birthday: '1990-05-15',
    email: 'john.doe@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINE_LOVER,
    isConfirm: true,
  },

  {
    id: '2',
    avatarUrl: null,
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+0987654321',
    country: 'France',
    birthday: '1985-08-22',
    email: 'jane.smith@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINE_EXPERT,
    isConfirm: false,
  },

  {
    id: '3',
    avatarUrl: null,
    firstName: 'Alice',
    lastName: 'Brown',
    phoneNumber: '+1122334455',
    country: 'Italy',
    birthday: '1995-01-01',
    email: 'alice.brown@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINE_LOVER,
    isConfirm: true,
  },

  {
    id: '4',
    avatarUrl: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINE_EXPERT,
    isConfirm: false,
  },
  {
    id: '5',
    avatarUrl: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINEMAKER,
    isConfirm: false,
  },
  {
    id: '6',
    avatarUrl: null,
    firstName: 'Bob',
    lastName: 'Johnson',
    phoneNumber: '+6677889900',
    country: 'Germany',
    birthday: '1978-11-30',
    email: 'bob.johnson@example.com',
    wineExperienceLevel: USER_CATEGORIES.WINEMAKER,
    isConfirm: false,
  },
]

export const MOCK_USERS = {
  rows: mockUsers,
  count: mockUsers.length,
}
