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
    label: 'v1.0.1-beta.6',
    value: 'v1.0.1-beta.6',
    description: 'Latest beta release',
  },
  {
    id: 'previous',
    label: 'v0.9.3',
    value: 'v0.9.3',
    description: 'Previous stable release',
  },
];

// 文档路径到版本的映射
export const docPathToVersion: Record<string, string> = {
  'release-1_0': 'v1.0.0',
  preview: 'v1.0.1-beta.6',
  'release-0_9': 'v0.9.3', // 添加其他路径映射
};

// 从路径推断版本
export function getVersionFromPath(pathname: string): string {
  // 提取文档版本路径，如 /docs/release-1_0/... -> release-1_0
  const pathSegments = pathname.split('/');
  const docVersionPath = pathSegments[2]; // /docs/[version]/...

  return docPathToVersion[docVersionPath] || versionOptions[0].value;
}
