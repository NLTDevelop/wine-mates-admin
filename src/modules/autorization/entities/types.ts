export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user?: {
    id: string
    email: string
    name: string
    role: 'admin'
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin'
}
