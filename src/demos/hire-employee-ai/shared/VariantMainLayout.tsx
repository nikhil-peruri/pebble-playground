import React from 'react';
import { usePebbleTheme } from '@/utils/theme';
import { VStack } from '@rippling/pebble/Layout/Stack';
import {
  AiSectionCardWrapper,
  VariantChatInput,
  VariantQuickChips,
} from '../shared/AiSectionCardWrapper';
import { VariantManualSection } from '../shared/VariantManualSection';
import { ContentColumn, ComposerTemplate, MentionAt, SectionTitle } from '../styles';
import type { PromptKey, ScreenMode } from '../types';

const COPY_TEMPLATE = `Copy details from @

New hire full name:
Email:
Start date:
Country of hire :`;

interface VariantMainLayoutProps {
  isCopyMode: boolean;
  screenMode: ScreenMode;
  onPromptClick: (key: PromptKey) => void;
  children: React.ReactNode;
  chatInputProps?: React.ComponentProps<typeof VariantChatInput>;
}

export const VariantMainLayout: React.FC<VariantMainLayoutProps> = ({
  isCopyMode,
  screenMode,
  onPromptClick,
  children,
  chatInputProps,
}) => {
  const { theme } = usePebbleTheme();
  const activeKey =
    screenMode === 'copy-specific' || screenMode === 'copy-last-hire' ? screenMode : undefined;

  const renderCopyContent = () => {
    const lines = COPY_TEMPLATE.split('\n');
    return (
      <ComposerTemplate theme={theme}>
        {lines.map((line, index) => {
          if (line.includes('@')) {
            const [before] = line.split('@');
            return (
              <div key={index}>
                {before}
                <MentionAt>@</MentionAt>
              </div>
            );
          }
          return <div key={index}>{line || '\u00A0'}</div>;
        })}
      </ComposerTemplate>
    );
  };

  return (
    <ContentColumn theme={theme}>
      <VStack gap="0.75rem">
        <SectionTitle theme={theme}>Tell us who you&apos;d like to hire</SectionTitle>

        <AiSectionCardWrapper>
          {isCopyMode ? renderCopyContent() : children}
          <VariantChatInput sendEnabled={isCopyMode} {...chatInputProps} />
          <VariantQuickChips
            activeKey={activeKey}
            isCopyMode={isCopyMode}
            onPromptClick={onPromptClick}
          />
        </AiSectionCardWrapper>
      </VStack>

      {!isCopyMode && <VariantManualSection />}
    </ContentColumn>
  );
};
