import { type ApiRoom } from './ApiRoom'
import { fetchApi } from '@/api/fetchApi'

export type ApiRoomListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: ApiRoom[]
}

export const fetchRooms = ({
  role,
  pageSize,
  page,
}: {
  role?: 'owner' | 'administrator' | 'member'
  pageSize?: number
  page?: number
} = {}): Promise<ApiRoomListResponse> => {
  const params = new URLSearchParams()
  if (role) params.set('role', role)
  if (pageSize) params.set('page_size', String(pageSize))
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString() ? `?${params.toString()}` : ''
  return fetchApi<ApiRoomListResponse>(`/rooms/${query}`)
}
