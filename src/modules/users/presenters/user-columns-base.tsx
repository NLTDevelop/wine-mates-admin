// export interface ColumnConfig {
//   accessorKey: string
//   meta: {
//     cellClassName: string
//     headerClassName?: string
//     withFilter?: boolean
//     withSort?: boolean
//     customHeader?: (t: (key: string) => string) => React.ReactNode
//     customCell?: (row: any) => React.ReactNode
//   }
// }

// export const userColumnsBase: Record<string, ColumnConfig> = {
//   username: {
//     accessorKey: 'username',
//     meta: {
//       cellClassName: 'w-[200px]',
//       withFilter: false,
//       withSort: false,
//     },
//   },
//   phoneNumber: {
//     accessorKey: 'phoneNumber',
//     meta: {
//       cellClassName: 'w-[150px]',
//       withFilter: false,
//     },
//   },
//   country: {
//     accessorKey: 'country',
//     meta: {
//       cellClassName: 'w-[120px]',
//       withSort: false,
//     },
//   },
//   birthday: {
//     accessorKey: 'birthday',
//     meta: {
//       cellClassName: 'w-[120px]',
//     },
//   },
//   category: {
//     accessorKey: 'category',
//     meta: {
//       cellClassName: 'w-[140px]',
//       withFilter: false,
//     },
//   },
// } as const

// export const createUserColumns = (t, userStatusOptions, openModalStatusChange) => {
//   return Object.entries(userColumnsBase).map(([key, config]) => {

//     let header = () => <div className="text-left">{t(key)}</div>

//     if (config.meta.withFilter) {
//      //можно будет прописать хедер с фильтром если понадобиться
//     }
//     if (config.meta.withSort) {
//      //можно будет прописать хедер с сортом если понадобиться
//     }

//     return {
//       accessorKey: config.accessorKey,
//       header,
//       cell: ({ row }) => <div className="text-left">{row.getValue(config.accessorKey)}</div>,
//       meta: config.meta,
//     }
//   })
// }
