import { ITopic } from '../enteties/types'

export const mockTopics: ITopic[] = [
  {
    id: 1,
    topicName: 'Оплата',
    sortNumber: 1,
    questions: [
      {
        id: 1,
        question: 'Какие способы оплаты?',
        answer: 'Карты Visa/MasterCard, PayPal, Apple Pay, Google Pay.',
        sortNumber: 1,
      },
      {
        id: 2,
        question: 'Безопасно ли платить?',
        answer: 'Да, все данные защищены SSL шифрованием.',
        sortNumber: 2,
      },
    ],
  },
  {
    id: 2,
    topicName: 'Доставка',
    sortNumber: 2,
    questions: [
      {
        id: 3,
        question: 'Сроки доставки?',
        answer: '2-4 рабочих дня.',
        sortNumber: 1,
      },
    ],
  },
  {
    id: 3,
    topicName:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eos esse officia commodi corrupti culpa nobis? Minima, quia distinctio qui, veniam alias vero obcaecati porro doloremque dolor consectetur, rem perspiciatis.',
    sortNumber: 2,
    questions: [
      {
        id: 3,
        question:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eos esse officia commodi corrupti culpa nobis? Minima, quia distinctio qui, veniam alias vero obcaecati porro doloremque dolor consectetur, rem perspiciatis.',
        answer:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eos esse officia commodi corrupti culpa nobis? Minima, quia distinctio qui, veniam alias vero obcaecati porro doloremque dolor consectetur, rem perspiciatis.',
        sortNumber: 1,
      },
    ],
  },
]
