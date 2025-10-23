import { Feature } from "./types";



export const MOCK_FEATURES: Feature[] = [
  {
    id: 1,
    key: 'tasting_notes',
    name: 'Дегустационные заметки',
    is_enabled: true,
    updated_at: new Date(Date.now() - 3600000).toISOString(), 
  },
  {
    id: 2,
    key: 'wine_clubs',
    name: 'Винные клубы и Группы',
    is_enabled: false, 
    updated_at: new Date(Date.now() - 86400000).toISOString(), 
  },
  {
    id: 3,
    key: 'user_management',
    name: 'Управление пользователями (Админ)',
    is_enabled: true,
    updated_at: new Date().toISOString(), 
  },
  {
    id: 4,
    key: 'sommelier_chat',
    name: 'Чат с сомелье (Премиум)',
    is_enabled: false,
    updated_at: new Date(Date.now() - 600000).toISOString(), 
  },
  {
    id: 5,
    key: 'shop_integration',
    name: 'Интеграция с магазином',
    is_enabled: true,
    updated_at: new Date(Date.now() - 120000).toISOString(), 
  },
];