import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { css } from '@/styled-system/css'
import { Text, H } from '@/primitives'
import { Spinner } from '@/primitives/Spinner'
import { keys } from '@/api/queryKeys'
import { useUser } from '@/features/auth/api/useUser'
import { fetchRooms } from '@/features/rooms/api/fetchRooms'
import { RoomListRow } from '@/features/rooms/components/RoomListRow'

const MAX_ROOMS = 5

export const QuickAccessRooms = () => {
  const { t, i18n } = useTranslation('home', { keyPrefix: 'quickAccessRooms' })
  const { isLoggedIn } = useUser()

  const { data, isLoading } = useQuery({
    queryKey: [keys.rooms, { role: 'owner', pageSize: MAX_ROOMS }],
    queryFn: () => fetchRooms({ role: 'owner', pageSize: MAX_ROOMS }),
    enabled: isLoggedIn === true,
  })

  if (isLoggedIn !== true) {
    return null
  }

  const rooms = data?.results ?? []

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '28rem',
        gap: '0.75rem',
        '& ul': {
          width: '100%',
          padding: 0,
          margin: 0,
          listStyle: 'none',
        },
      })}
    >
      <H lvl={3} margin="sm">
        {t('heading')}
      </H>
      {isLoading ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <Text variant="note">{t('empty')}</Text>
      ) : (
        <ul>
          {rooms.slice(0, MAX_ROOMS).map((room) => (
            <RoomListRow key={room.id} room={room} locale={i18n.language} />
          ))}
        </ul>
      )}
    </div>
  )
}
