export interface ApiResponse<T> {
  success: boolean
  message: string
  store?: T
  errors?: Record<string, string[]>
}