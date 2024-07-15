import React from 'react'
import DesktopSidebar from '../DesktopSidebar'

 async function SideBar ({children}:{children:React.ReactNode}) {
  return (
    <div className='h-full'>
        <DesktopSidebar/>
      <main className='lg:pl-24 h-full'>
      {children}
      </main>
    </div>
  )
}

export default SideBar