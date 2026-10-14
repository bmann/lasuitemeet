import { useTranslation } from 'react-i18next'
import { css } from '@/styled-system/css'
import { Link, Text } from '@/primitives'
import { ApiAccessLevel, type ApiRoom } from '@/features/rooms/api/ApiRoom'
import { formatDate, formatRelativeDate } from '@/utils/formatDate'
import { getRoutePath } from '@/navigation/getRoutePath'

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: '1rem',
  alignItems: 'center',
  padding: '0.5rem 0',
  borderBottom: '1px solid',
  borderColor: 'greyscale.500',
  '&:last-child': { borderBottom: 0 },
})

const AccessLevelLabel = ({ accessLevel }: { accessLevel: ApiAccessLevel }) => {
  const { t } = useTranslation('home', {
    keyPrefix: 'quickAccessRooms.access',
  })
  const labelKey =
    accessLevel === ApiAccessLevel.TRUSTED
      ? 'trusted'
      : accessLevel === ApiAccessLevel.RESTRICTED
        ? 'restricted'
        : 'open'

  return <Text variant="note">{t(labelKey)}</Text>
}

export const RoomListRow = ({
  room,
  locale,
}: {
  room: ApiRoom
  locale: string
}) => {
  return (
    <li className={rowClass}>
      <Link
        to={String(getRoutePath('room', room.slug))}
        data-attr="link-to-room"
      >
        {room.slug}
      </Link>
      <Text
        variant="smNote"
        title={room.created_at ? formatDate(room.created_at) : undefined}
      >
        {room.created_at ? formatRelativeDate(room.created_at, locale) : ''}
      </Text>
      <AccessLevelLabel accessLevel={room.access_level} />
    </li>
  )
}
