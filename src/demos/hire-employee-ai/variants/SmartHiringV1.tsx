import React from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  AiSectionSubtitle,
  AiSectionTitle,
  HookBanner,
  HookBody,
  HookCtaPill,
  HookHeadline,
  HookIconBox,
} from '../styles';
import { VariantMainLayout } from '../shared/VariantMainLayout';
import type { PromptKey, ScreenMode } from '../types';

interface SmartHiringV1Props {
  isCopyMode: boolean;
  screenMode: ScreenMode;
  onPromptClick: (key: PromptKey) => void;
}

export const SmartHiringV1: React.FC<SmartHiringV1Props> = ({
  isCopyMode,
  screenMode,
  onPromptClick,
}) => {
  const { theme } = usePebbleTheme();

  return (
    <VariantMainLayout
      isCopyMode={isCopyMode}
      screenMode={screenMode}
      onPromptClick={onPromptClick}
    >
      <AiSectionTitle theme={theme}>Hire faster with AI</AiSectionTitle>
      <AiSectionSubtitle theme={theme}>
        Skip repetitive fields — AI pre-fills from your team member&apos;s existing data.
      </AiSectionSubtitle>

      <HookBanner theme={theme}>
        <HookIconBox theme={theme}>
          <Icon type={Icon.TYPES.COPY_OUTLINE} size={18} color="white" />
        </HookIconBox>
        <div>
          <HookHeadline theme={theme}>
            Hiring someone similar to your team member&apos;s role?
          </HookHeadline>
          <HookBody theme={theme}>
            Say &apos;Hire someone like Nikhil&apos; and AI copies role, comp, location, and entity
            — ready to review in seconds.
          </HookBody>
          <HookCtaPill type="button">✦ Try: &apos;Hire someone like Nikhil&apos;</HookCtaPill>
        </div>
      </HookBanner>
    </VariantMainLayout>
  );
};
