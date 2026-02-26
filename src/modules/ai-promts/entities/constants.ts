export const FIXED_THRESHOLDS = [
  {
    name: 'VECTOR_MIN_SIMILARITY',
    description: 'Мінімальний поріг векторного пошуку. Вина нижче цього значення ігноруються повністю.',
  },
  {
    name: 'VECTOR_CONFIDENT_SIMILARITY',
    description: 'Поріг впевненого збігу по вектору. Якщо знайдено — AI не викликається, одразу повертаємо результат.',
  },
  {
    name: 'FTS_MIN_SIMILARITY',
    description: 'Мінімальний поріг текстового пошуку (після AI). Вина нижче відфільтровуються.',
  },
  {
    name: 'FTS_CONFIDENT_SIMILARITY',
    description: 'Поріг впевненого текстового збігу. TOP-1 має перевищувати це значення.',
  },
  {
    name: 'FTS_CONFIDENT_RATIO',
    description: 'Коефіцієнт переваги TOP-1 над TOP-2. Наприклад 1.2 означає TOP-1 має бути мінімум на 20% кращим.',
  },
] as const
