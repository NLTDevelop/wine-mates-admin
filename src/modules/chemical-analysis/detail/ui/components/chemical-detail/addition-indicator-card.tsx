interface AdditionIndicatorCardProps {
  title: string
  value: string | boolean | number
  unit?: string
}
export const AdditionIndicatorCard = ({ title, value, unit }: AdditionIndicatorCardProps) => {
  return (
    <div className="bg-input p-2 rounded-md flex flex-col">
      <h4 className="text-sm font-medium text-gray-500 flex-1">{title}</h4>
      <p className="text-xl font-bold mt-2 mx-auto">
        {value} {unit && <span className="text-sm font-normal">{unit}</span>}
      </p>
    </div>
  )
}
