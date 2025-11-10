import { useMemo } from 'react'

export const useObjectTransform = <T extends Record<string, any>>(
  objects: T[],
  valueKey: keyof T,
  labelKey: keyof T
) => {
  const values = useMemo(() => 
    objects.map(obj => obj[valueKey]), 
    [objects, valueKey]
  )
  
  const labels = useMemo(() => 
    objects.map(obj => obj[labelKey]), 
    [objects, labelKey]
  )
  
  const options = useMemo(() => 
    objects.map(obj => ({
      label: String(obj[labelKey]),
      value: String(obj[valueKey])
    })), 
    [objects, labelKey, valueKey]
  )

  const findObjectByValue = useMemo(() => 
    (value: string) => 
      objects.find(obj => String(obj[valueKey]) === value),
    [objects, valueKey]
  )

  const getObjectsByValues = useMemo(() => 
    (values: string[]) => 
      values.map(value => findObjectByValue(value)).filter(Boolean) as T[],
    [findObjectByValue]
  )

  return {
    values,
    labels,
    options,
    findObjectByValue,
    getObjectsByValues
  }
}