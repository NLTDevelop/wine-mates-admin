import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { WineColorItem } from '../../entities/types/color'

interface SortableShadesProps {
  shades: WineColorItem
  children: (props: { attributes: any; listeners: any; isDragging: boolean }) => React.ReactNode
}

export const SortableShades = ({ shades, children }: SortableShadesProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shades.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    height: '100%',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        dnd-kit-drag transform-gpu will-change-transform
        ${isDragging ? 'z-50' : ''}
      `}
    >
      {/* <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 cursor-grab active:cursor-grabbing p-2 rounded hover:bg-accent transition-colors select-none touch-none"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div> */}

      {children({ attributes, listeners, isDragging })}
    </div>
  )
}
