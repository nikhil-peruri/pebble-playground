export type VersionKey = 'base' | 'v1' | 'v2' | 'v3';

export type ScreenMode = 'default' | 'copy-specific' | 'copy-last-hire';

export type PromptKey = 'upload' | 'copy-specific' | 'copy-last-hire';

export const VERSION_OPTIONS = [
  { label: 'Base version', value: 'base' as const },
  { label: 'V1 (Positioning)', value: 'v1' as const },
  { label: 'V2 (So what)', value: 'v2' as const },
  { label: 'V3 (Click Bait)', value: 'v3' as const },
];
