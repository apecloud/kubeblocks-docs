const DEFAULT_SITE_URL = 'https://kubeblocks.io';

export const getSiteUrl = (): string => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_SITE_URL;

  return raw.replace(/\/+$/, '');
};

export const toAbsoluteUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
};
