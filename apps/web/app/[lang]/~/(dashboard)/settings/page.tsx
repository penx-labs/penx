'use client'

import { GeneralSettingForm } from './GeneralSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  return (
    <div className="space-y-6">
      <GeneralSettingForm />
    </div>
  )
}
