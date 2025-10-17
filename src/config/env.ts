export const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[`VITE_${key}`]) {
    return import.meta.env[`VITE_${key}`] as string
  }

  if (process.env[`REACT_APP_${key}`]) {
    return process.env[`REACT_APP_${key}`] as string
  }

  if (process.env[key]) {
    return process.env[key] as string
  }

  if (defaultValue !== undefined) {
    return defaultValue
  }

  console.warn(`Environment variable ${key} is not defined`)
  return ''
}
