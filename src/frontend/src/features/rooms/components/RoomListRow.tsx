import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { css } from '@/styled-system/css'
import { Input, Link, Text } from '@/primitives'
import { ApiAccessLevel, type ApiRoom } from '@/features/rooms/api/ApiRoom'
import { formatDate, formatRelativeDate } from '@/utils/formatDate'
import { getRoutePath } from '@/navigation/getRoutePath'

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
  onRename,
}: {
  room: ApiRoom
  locale: string
  onRename?: (name: string) => void
}) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(room.name)

  const editable = Boolean(onRename)
  const gridTemplateColumns = editable ? '1fr 1fr auto auto' : '1fr auto auto'

  const commitRename = () => {
    setIsEditingName(false)
    const trimmed = nameDraft.trim()
    if (trimmed && trimmed !== room.name) {
      onRename?.(trimmed)
    } else {
      setNameDraft(room.name)
    }
  }

  const cancelRename = () => {
    setIsEditingName(false)
    setNameDraft(room.name)
  }

  const rowClass = css({
    display: 'grid',
    gridTemplateColumns,
    gap: '1rem',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid',
    borderColor: 'greyscale.500',
    '&:last-child': { borderBottom: 0 },
  })

  return (
    <li className={rowClass}>
      {editable && (
        <div className={css({ minWidth: 0 })}>
          {isEditingName ? (
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus -- the row was just click-targeted, focus the rename field
              autoFocus
              value={nameDraft}
              maxLength={500}
              aria-label={room.slug}
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitRename()
                if (event.key === 'Escape') cancelRename()
              }}
            />
          ) : (
            <button
              type="button"
              className={css({
                width: 'full',
                padding: '0.25rem 0.5rem',
                border: '1px solid transparent',
                borderRadius: 4,
                textAlign: 'left',
                cursor: 'pointer',
                color: 'control.text',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                _hover: {
                  borderColor: 'control.border',
                },
                _focusVisible: {
                  outline: '2px solid',
                  outlineColor: 'focusRing',
                  outlineOffset: '2px',
                },
              })}
              data-attr="rename-room"
              onClick={() => {
                setNameDraft(room.name)
                setIsEditingName(true)
              }}
            >
              {room.name}
            </button>
          )}
        </div>
      )}
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
