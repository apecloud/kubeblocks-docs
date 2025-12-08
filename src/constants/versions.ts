export const versionOptions = [
  {
    id: 'stable',
    label: 'v1.0.0',
    value: 'v1.0.0',
    description: 'Latest stable release',
    recommended: true,
  },
  {
    id: 'beta',
    label: 'v1.0.1',
    value: 'v1.0.1',
    description: 'Latest beta release',
  },
  {
    id: 'previous',
    label: 'v0.9.5',
    value: 'v0.9.5',
    description: 'Previous stable release',
  },
];

// Document path to version mapping
export const docPathToVersion: Record<string, string> = {
  preview: 'v1.0.2-beta.15',
  'release-1_0': 'v1.0.0',
  'release-1_0_1': 'v1.0.1',
  'release-0_9': 'v0.9.5', // Add other path mappings
};

// Infer version from path
export function getVersionFromPath(pathname: string): string {
  // Extract document version path, e.g. /docs/release-1_0/... -> release-1_0
  const pathSegments = pathname.split('/');
  const docVersionPath = pathSegments[2]; // /docs/[version]/...

  return docPathToVersion[docVersionPath] || versionOptions[0].value;
}
