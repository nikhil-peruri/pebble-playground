import React from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import { VStack } from '@rippling/pebble/Layout/Stack';
import {
  Composer,
  ComposerActions,
  ComposerPlaceholder,
  ComposerTemplate,
  ContentColumn,
  DraftHireRow,
  DraftHireText,
  FieldLabel,
  FormSection,
  MentionAt,
  OrDivider,
  OrLine,
  OrText,
  PromptChip,
  PromptsRow,
  RequiredMark,
  SectionTitle,
} from '../styles';
import type { PromptKey, ScreenMode } from '../types';

const PROMPTS: { key: PromptKey; label: string }[] = [
  { key: 'upload', label: 'Upload resume' },
  { key: 'copy-specific', label: 'Copy from a specific person' },
  { key: 'copy-last-hire', label: 'Copy from last hire' },
];

const WHO_ARE_YOU_HIRING_OPTIONS = [
  { value: 'individual', label: 'An individual' },
  { value: 'multiple', label: 'Multiple people' },
];

const WHO_DO_YOU_WANT_TO_HIRE_OPTIONS = [
  { value: 'ats', label: 'A candidate in the applicant tracking system' },
  { value: 'former', label: 'A former employee or contractor' },
  { value: 'new', label: 'A new employee or contractor' },
];

const COPY_TEMPLATE = `Copy details from @

New hire full name:
Email:
Start date:
Country of hire :`;

interface BaseMainViewProps {
  isCopyMode: boolean;
  screenMode: ScreenMode;
  whoAreYouHiring?: string;
  whoDoYouWantToHire?: string;
  onWhoAreYouHiringChange: (value: string) => void;
  onWhoDoYouWantToHireChange: (value: string) => void;
  onPromptClick: (key: PromptKey) => void;
}

export const BaseMainView: React.FC<BaseMainViewProps> = ({
  isCopyMode,
  screenMode,
  whoAreYouHiring,
  whoDoYouWantToHire,
  onWhoAreYouHiringChange,
  onWhoDoYouWantToHireChange,
  onPromptClick,
}) => {
  const { theme } = usePebbleTheme();

  const activePromptKey =
    screenMode === 'copy-specific' || screenMode === 'copy-last-hire' ? screenMode : undefined;

  const renderComposerContent = () => {
    if (!isCopyMode) {
      return (
        <ComposerPlaceholder theme={theme}>
          Describe your hire, upload resume, or paste details
        </ComposerPlaceholder>
      );
    }

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
      <VStack gap="0.5rem">
        <SectionTitle theme={theme}>Tell us who you&apos;d like to hire</SectionTitle>

        <Composer theme={theme}>
          {renderComposerContent()}
          <ComposerActions theme={theme}>
            <Button.Icon
              appearance={Button.APPEARANCES.OUTLINE}
              size={Button.SIZES.S}
              icon={Icon.TYPES.ADD}
              aria-label="Add attachment"
            />
            <div style={{ flex: 1 }} />
            <Button.Icon
              size={Button.SIZES.S}
              icon={Icon.TYPES.ARROW_UP}
              aria-label="Send"
              isDisabled={!isCopyMode}
            />
          </ComposerActions>
        </Composer>

        <PromptsRow theme={theme}>
          {PROMPTS.map(({ key, label }) => (
            <PromptChip
              key={key}
              theme={theme}
              type="button"
              isDimmed={isCopyMode && activePromptKey !== key}
              onClick={() => onPromptClick(key)}
            >
              <Icon type={Icon.TYPES.RIPPLING_AI} size={12} color="#4a0039" />
              {label}
            </PromptChip>
          ))}
        </PromptsRow>
      </VStack>

      {!isCopyMode && (
        <>
          <OrDivider theme={theme}>
            <OrLine theme={theme} />
            <OrText theme={theme}>OR</OrText>
            <OrLine theme={theme} />
          </OrDivider>

          <FormSection theme={theme}>
            <SectionTitle theme={theme}>Fill in details</SectionTitle>

            <div>
              <FieldLabel theme={theme}>
                Who are you hiring
                <RequiredMark theme={theme}>*</RequiredMark>
              </FieldLabel>
              <Input.Radio
                name="whoAreYouHiring"
                list={WHO_ARE_YOU_HIRING_OPTIONS}
                value={whoAreYouHiring}
                onChange={onWhoAreYouHiringChange}
              />
            </div>

            <div>
              <FieldLabel theme={theme}>
                Who do you want to hire
                <RequiredMark theme={theme}>*</RequiredMark>
              </FieldLabel>
              <Input.Radio
                name="whoDoYouWantToHire"
                list={WHO_DO_YOU_WANT_TO_HIRE_OPTIONS}
                value={whoDoYouWantToHire}
                onChange={onWhoDoYouWantToHireChange}
              />
            </div>
          </FormSection>

          <DraftHireRow theme={theme}>
            <DraftHireText theme={theme}>
              Looking for a draft hire you started before?
            </DraftHireText>
            <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.S}>
              View draft hires
            </Button>
          </DraftHireRow>
        </>
      )}
    </ContentColumn>
  );
};
