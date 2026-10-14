import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTitle } from 'hoofd'
import { css } from '@/styled-system/css'
import { Center, VStack } from '@/styled-system/jsx'
import { Screen } from '@/layout/Screen'
import { CenteredContent } from '@/layout/CenteredContent'
import { Button, Text, LinkButton } from '@/primitives'
import { Spinner } from '@/primitives/Spinner'
import { keys } from '@/api/queryKeys'
import { useUser } from '@/features/auth/api/useUser'
import { LoginButton } from '@/components/LoginButton'
import { fetchRooms } from '@/features/rooms/api/fetchRooms'
import { RoomListRow } from '@/features/rooms/components/RoomListRow'
import { getRoutePath } from '@/navigation/getRoutePath'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'

const PAGE_SIZE = 25

const listClass = css({
  width: '100%',
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

const paginationClass = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
})

export const Meetings = () => {
  const { t, i18n } = useTranslation('home', { keyPrefix: 'meetings' })
  const { t: tPagination } = useTranslation('rooms', {
    keyPrefix: 'pagination',
  })
  const { isLoggedIn, isLoading: isAuthLoading } = useUser()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: [keys.rooms, { role: 'owner', page, pageSize: PAGE_SIZE }],
    queryFn: () => fetchRooms({ role: 'owner', page, pageSize: PAGE_SIZE }),
    enabled: isLoggedIn === true,
  })

  useTitle(t('pageTitle'))

  if (isLoggedIn === undefined || isAuthLoading) {
    return (
      <Screen layout="centered" footer={false}>
        <Spinner />
      </Screen>
    )
  }

  if (isLoggedIn === false) {
    return (
      <Screen layout="centered" footer={false}>
        <CenteredContent title={t('loginTitle')} withBackButton>
          <Center>
            <LoginButton />
          </Center>
        </CenteredContent>
      </Screen>
    )
  }

  const rooms = data?.results ?? []
  const totalPageCount = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 1
  const hasMultiplePages = totalPageCount > 1

  return (
    <Screen layout="centered" footer={false}>
      <CenteredContent title={t('heading')} withBackButton>
        <VStack gap={4}>
          {isLoading ? (
            <Center>
              <Spinner />
            </Center>
          ) : rooms.length === 0 ? (
            <Text variant="note">{t('empty')}</Text>
          ) : (
            <ul className={listClass}>
              {rooms.map((room) => (
                <RoomListRow key={room.id} room={room} locale={i18n.language} />
              ))}
            </ul>
          )}
          {hasMultiplePages && (
            <div className={paginationClass}>
              <Button
                isDisabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                size="sm"
                square
                variant="secondary"
                aria-label={tPagination('previous')}
              >
                <RiArrowLeftSLine />
              </Button>
              <Text variant="sm" centered>
                {tPagination('count', { currentPage: page, totalPageCount })}
              </Text>
              <Button
                isDisabled={page >= totalPageCount}
                onPress={() => setPage((p) => p + 1)}
                size="sm"
                square
                variant="secondary"
                aria-label={tPagination('next')}
              >
                <RiArrowRightSLine />
              </Button>
            </div>
          )}
          <Center>
            <LinkButton
              href={String(getRoutePath('home'))}
              variant="secondary"
              size="sm"
            >
              {t('backButton')}
            </LinkButton>
          </Center>
        </VStack>
      </CenteredContent>
    </Screen>
  )
}

export default Meetings
