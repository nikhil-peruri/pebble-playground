import React from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  AiSectionSubtitle,
  AiSectionTitle,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
  ValueCallout,
  ValueIconBox,
  ValueText,
} from '../styles';
import { VariantMainLayout } from '../shared/VariantMainLayout';
import type { PromptKey, ScreenMode } from '../types';

interface SmartHiringV2Props {
  isCopyMode: boolean;
  screenMode: ScreenMode;
  onPromptClick: (key: PromptKey) => void;
}

export const SmartHiringV2: React.FC<SmartHiringV2Props> = ({
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
      <AiSectionTitle theme={theme}>Hire in half the time</AiSectionTitle>
      <AiSectionSubtitle theme={theme}>
        AI handles the repetitive fields so you don&apos;t have to.
      </AiSectionSubtitle>

      <StatsGrid theme={theme}>
        <StatCard theme={theme}>
          <StatValue theme={theme}>2×</StatValue>
          <StatLabel theme={theme}>faster than manual entry</StatLabel>
        </StatCard>
        <StatCard theme={theme}>
          <StatValue theme={theme}>~30</StatValue>
          <StatLabel theme={theme}>fields pre-filled for you</StatLabel>
        </StatCard>
        <StatCard theme={theme}>
          <StatValue theme={theme}>1 min</StatValue>
          <StatLabel theme={theme}>to reach review screen</StatLabel>
        </StatCard>
      </StatsGrid>

      <ValueCallout theme={theme}>
        <ValueIconBox theme={theme}>
          <Icon type={Icon.TYPES.FX_OUTLINE} size={14} color="white" />
        </ValueIconBox>
        <ValueText theme={theme}>
          <strong>Hiring someone similar to your team member&apos;s role?</strong>
          Just say &apos;Hire someone like Nikhil&apos; — AI copies comp, location, role, and entity
          from that team member&apos;s profile. You only review and adjust.
        </ValueText>
      </ValueCallout>
    </VariantMainLayout>
  );
};
