import React, { useEffect, useRef, useState } from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  AiSectionSubtitle,
  AiSectionTitle,
  DemoArea,
  DemoLabel,
  DetailChip,
  DetailChipsRow,
  ResponseArea,
  ResponseLabel,
  UserAvatar,
  UserBubble,
  UserBubbleRow,
} from '../styles';
import { VariantMainLayout } from '../shared/VariantMainLayout';
import type { PromptKey, ScreenMode } from '../types';

const PLACEHOLDER_STRINGS = [
  'Hire X like the last L6 I hired…',
  'Hire Nikhil as a Direct hire in Canada…',
  'Copy from my last hire…',
];

const SCENARIOS = [
  {
    prompt: 'Hire X like the last L6 I hired',
    responseLabel: "AI is pre-filling from your last L6 team member's profile…",
    chips: ['📍 San Francisco, CA', '💼 L6 Engineer', '💰 $155K', '🏢 Rippling Inc.'],
    chipVariant: 'purple' as const,
  },
  {
    prompt:
      'Hire Nikhil as a Direct hire in Canada. His start date is Jan 6, Manager is Priya and email is nikhil@acme.com',
    responseLabel: "Got it — setting up Nikhil's hire with the details you provided:",
    chips: [
      '📍 Canada',
      '👤 Direct hire',
      '📅 Start: Jan 6',
      '👔 Manager: Priya',
      '✉️ nikhil@acme.com',
    ],
    chipVariant: 'green' as const,
  },
];

interface SmartHiringV3Props {
  isCopyMode: boolean;
  screenMode: ScreenMode;
  onPromptClick: (key: PromptKey) => void;
}

export const SmartHiringV3: React.FC<SmartHiringV3Props> = ({
  isCopyMode,
  screenMode,
  onPromptClick,
}) => {
  const { theme } = usePebbleTheme();
  const [promptText, setPromptText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [responseVisible, setResponseVisible] = useState(false);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const [showAnimatedPlaceholder, setShowAnimatedPlaceholder] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  useEffect(() => {
    if (isCopyMode) return undefined;

    let cancelled = false;

    const runScenario = (index: number) => {
      if (cancelled) return;
      setActiveScenarioIndex(index);
      const scenario = SCENARIOS[index];
      let charIndex = 0;
      setPromptText('');
      setShowCursor(true);
      setResponseVisible(false);

      const typeNext = () => {
        if (cancelled) return;
        if (charIndex < scenario.prompt.length) {
          setPromptText(scenario.prompt.slice(0, charIndex + 1));
          charIndex += 1;
          schedule(typeNext, 36);
        } else {
          setShowCursor(false);
          schedule(() => setResponseVisible(true), 600);
          schedule(() => {
            setResponseVisible(false);
            let eraseIndex = scenario.prompt.length;
            const erase = () => {
              if (cancelled) return;
              if (eraseIndex > 0) {
                eraseIndex -= 1;
                setPromptText(scenario.prompt.slice(0, eraseIndex));
                schedule(erase, 18);
              } else {
                schedule(() => runScenario((index + 1) % SCENARIOS.length), 300);
              }
            };
            schedule(erase, 3400);
          }, 3400);
        }
      };

      typeNext();
    };

    runScenario(0);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [isCopyMode]);

  useEffect(() => {
    if (isCopyMode || inputFocused) return undefined;

    let cancelled = false;
    let stringIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const tick = () => {
      if (cancelled) return;
      const current = PLACEHOLDER_STRINGS[stringIndex];

      if (!isErasing) {
        setAnimatedPlaceholder(current.slice(0, charIndex + 1));
        charIndex += 1;
        if (charIndex >= current.length) {
          schedule(() => {
            isErasing = true;
            tick();
          }, 2000);
        } else {
          schedule(tick, 42);
        }
      } else {
        charIndex -= 1;
        setAnimatedPlaceholder(current.slice(0, charIndex));
        if (charIndex <= 0) {
          stringIndex = (stringIndex + 1) % PLACEHOLDER_STRINGS.length;
          isErasing = false;
          schedule(tick, 300);
        } else {
          schedule(tick, 22);
        }
      }
    };

    tick();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [isCopyMode, inputFocused]);

  const scenario = SCENARIOS[activeScenarioIndex];

  return (
    <VariantMainLayout
      isCopyMode={isCopyMode}
      screenMode={screenMode}
      onPromptClick={onPromptClick}
      chatInputProps={{
        showAnimatedPlaceholder: showAnimatedPlaceholder && !inputFocused,
        animatedPlaceholder,
        onFocus: () => {
          setInputFocused(true);
          setShowAnimatedPlaceholder(false);
        },
        onBlur: () => {
          setInputFocused(false);
          setShowAnimatedPlaceholder(true);
        },
      }}
    >
      <AiSectionTitle theme={theme}>See how others are hiring with AI</AiSectionTitle>
      <AiSectionSubtitle theme={theme}>
        Watch a live example, then try it yourself.
      </AiSectionSubtitle>

      <DemoArea theme={theme}>
        <DemoLabel theme={theme}>Example hire in progress</DemoLabel>
        <UserBubbleRow theme={theme}>
          <UserAvatar theme={theme}>
            <Icon type={Icon.TYPES.USER_OUTLINE} size={12} color="white" />
          </UserAvatar>
          <UserBubble theme={theme}>
            {promptText}
            {showCursor ? '|' : ''}
          </UserBubble>
        </UserBubbleRow>

        <ResponseArea visible={responseVisible} theme={theme}>
          <ResponseLabel theme={theme}>{scenario.responseLabel}</ResponseLabel>
          <DetailChipsRow theme={theme}>
            {scenario.chips.map(chip => (
              <DetailChip key={chip} variant={scenario.chipVariant} theme={theme}>
                {chip}
              </DetailChip>
            ))}
          </DetailChipsRow>
        </ResponseArea>
      </DemoArea>
    </VariantMainLayout>
  );
};
