import { BaseWineColor } from "./types";

export const mockBaseWineColors: BaseWineColor[] = [
  {
    id: '1',
    translations: [
      { language: 'ua', name: 'Біле' },
      { language: 'en', name: 'White' }
    ],
    colorHex: '#fdffd4',
    
  },
  {
    id: '2',
    translations: [
      { language: 'ua', name: 'Червоне' },
      { language: 'en', name: 'Red' }
    ],
    colorHex: '#7c060d',
 
  },
  {
    id: '3',
    translations: [
      { language: 'ua', name: 'Рожеве' },
      { language: 'en', name: 'purple' }
    ],
    colorHex: '#7c060d',
 
  }
]