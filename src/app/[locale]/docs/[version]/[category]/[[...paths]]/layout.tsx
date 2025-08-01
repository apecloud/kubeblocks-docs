import { setStaticParamsLocale } from 'next-international/server';

export default async function DocsDetail({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: 'en' }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return children;
}
