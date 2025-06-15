import SessionHeader from '@/components/session-header'
import React from 'react'
import removedUser from "@/assets/icons/remove_user.svg"
import Session from '@/components/session/session'
import RemovedUserSession from '@/components/removed-user-session'
const RemovedUser = () => {
  return (
    <>
    <SessionHeader />
    <Session imgName={removedUser}>
    <RemovedUserSession />
    </Session>
    </>
  )
}

export default RemovedUser