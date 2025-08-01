'use client';

import { I18nProviderClient } from '@/locales/client';

interface Props {
  locale: 'en';
  children?: React.ReactNode;
}
export default function I18nProvider({ locale, children }: Props) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
