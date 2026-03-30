/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as contactInternalNotification } from './contact-internal-notification.tsx'
import { template as contactClientConfirmation } from './contact-client-confirmation.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-internal-notification': contactInternalNotification,
  'contact-client-confirmation': contactClientConfirmation,
}
