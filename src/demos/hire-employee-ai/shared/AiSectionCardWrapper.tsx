import React from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import {
  AiBadge,
  AiSectionCard,
  AnimatedPlaceholder,
  BRAND_PURPLE,
  SendButtonWrap,
  VariantInput,
  VariantInputWrap,
  VariantPromptChip,
  VariantPromptsRow,
} from '../styles';
import type { PromptKey } from '../types';

interface AiSectionCardWrapperProps {
  children: React.ReactNode;
}

export const AiSectionCardWrapper: React.FC<AiSectionCardWrapperProps> = ({ children }) => {
  const { theme } = usePebbleTheme();

  return (
    <AiSectionCard theme={theme}>
      <AiBadge>✦ Rippling AI</AiBadge>
      {children}
    </AiSectionCard>
  );
};

interface VariantChatInputProps {
  placeholder?: string;
  animatedPlaceholder?: string;
  showAnimatedPlaceholder?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  sendEnabled?: boolean;
}

export const VariantChatInput: React.FC<VariantChatInputProps> = ({
  placeholder = 'Describe your hire, or try a suggestion below…',
  animatedPlaceholder,
  showAnimatedPlaceholder = false,
  onFocus,
  onBlur,
  value = '',
  onChange,
  sendEnabled = false,
}) => {
  const { theme } = usePebbleTheme();

  return (
    <VariantInputWrap theme={theme}>
      <VariantInput
        theme={theme}
        placeholder={showAnimatedPlaceholder ? '' : placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {showAnimatedPlaceholder && animatedPlaceholder && (
        <AnimatedPlaceholder>{animatedPlaceholder}</AnimatedPlaceholder>
      )}
      <SendButtonWrap>
        <Button.Icon
          size={Button.SIZES.S}
          icon={Icon.TYPES.ARROW_UP}
          aria-label="Send"
          isDisabled={!sendEnabled}
        />
      </SendButtonWrap>
    </VariantInputWrap>
  );
};

const VARIANT_PROMPTS: { key: PromptKey; label: string; icon: string }[] = [
  { key: 'copy-last-hire', label: 'Copy from last hire', icon: Icon.TYPES.USERS_OUTLINE },
  { key: 'copy-specific', label: 'Copy from a specific person', icon: Icon.TYPES.SEARCH_OUTLINE },
  { key: 'upload', label: 'Upload resume', icon: Icon.TYPES.DOCUMENT_OUTLINE },
];

interface VariantQuickChipsProps {
  activeKey?: PromptKey;
  isCopyMode?: boolean;
  onPromptClick: (key: PromptKey) => void;
}

export const VariantQuickChips: React.FC<VariantQuickChipsProps> = ({
  activeKey,
  isCopyMode = false,
  onPromptClick,
}) => {
  const { theme } = usePebbleTheme();

  return (
    <VariantPromptsRow theme={theme}>
      {VARIANT_PROMPTS.map(({ key, label, icon }) => (
        <VariantPromptChip
          key={key}
          theme={theme}
          type="button"
          isDimmed={isCopyMode && activeKey !== key}
          onClick={() => onPromptClick(key)}
        >
          <Icon type={icon} size={12} color={BRAND_PURPLE} />
          {label}
        </VariantPromptChip>
      ))}
    </VariantPromptsRow>
  );
};
