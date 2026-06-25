/**
 * HRIS AI — Hire Employee (multi-version prototype)
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import ProgressBar from '@rippling/pebble/ProgressBar';
import Input from '@rippling/pebble/Inputs';
import { HStack } from '@rippling/pebble/Layout/Stack';
import { SearchBar } from '@/components/app-shell/SearchBar';
import { ProfileDropdown } from '@/components/app-shell/ProfileDropdown';
import {
  Body,
  FlowFooter,
  FlowHeader,
  FlowHeaderLeft,
  FlowHeaderPipe,
  FlowHeaderRight,
  FlowHeaderRow,
  FlowTitle,
  FlowTitleControl,
  NavActions,
  NavLeftSection,
  NavMenuButton,
  NavMenuLabel,
  NavRightSection,
  PageRoot,
  ProfileDivider,
  SearchBarWrapper,
  TopNav,
  VerticalDivider,
  VersionSelectorWrap,
} from './hire-employee-ai/styles';
import { VERSION_OPTIONS } from './hire-employee-ai/types';
import type { PromptKey, ScreenMode, VersionKey } from './hire-employee-ai/types';
import { BaseMainView } from './hire-employee-ai/variants/BaseMainView';
import { SmartHiringV1 } from './hire-employee-ai/variants/SmartHiringV1';
import { SmartHiringV2 } from './hire-employee-ai/variants/SmartHiringV2';
import { SmartHiringV3 } from './hire-employee-ai/variants/SmartHiringV3';

const VersionLabel = styled.span`
  font-size: 12px;
  color: #888;
  white-space: nowrap;
`;

const HireEmployeeAiDemo: React.FC = () => {
  const { theme, mode: currentMode } = usePebbleTheme();
  const [version, setVersion] = useState<VersionKey>('base');
  const [screenMode, setScreenMode] = useState<ScreenMode>('default');
  const [whoAreYouHiring, setWhoAreYouHiring] = useState<string | undefined>();
  const [whoDoYouWantToHire, setWhoDoYouWantToHire] = useState<string | undefined>();

  const isVariant = version !== 'base';
  const isCopyMode = screenMode !== 'default';
  const canContinue = Boolean(whoAreYouHiring && whoDoYouWantToHire);
  const progressPercent = isVariant ? 12 : 50;

  const handlePromptClick = (key: PromptKey) => {
    if (key === 'copy-specific') {
      setScreenMode('copy-specific');
    } else if (key === 'copy-last-hire') {
      setScreenMode('copy-last-hire');
    }
  };

  const returnToMainScreen = () => {
    setScreenMode('default');
  };

  const handleVersionChange = (nextVersion: VersionKey) => {
    setVersion(nextVersion);
    setScreenMode('default');
  };

  const renderMainContent = () => {
    const sharedProps = {
      isCopyMode,
      screenMode,
      onPromptClick: handlePromptClick,
    };

    switch (version) {
      case 'v1':
        return <SmartHiringV1 {...sharedProps} />;
      case 'v2':
        return <SmartHiringV2 {...sharedProps} />;
      case 'v3':
        return <SmartHiringV3 {...sharedProps} />;
      case 'base':
      default:
        return (
          <BaseMainView
            {...sharedProps}
            whoAreYouHiring={whoAreYouHiring}
            whoDoYouWantToHire={whoDoYouWantToHire}
            onWhoAreYouHiringChange={setWhoAreYouHiring}
            onWhoDoYouWantToHireChange={setWhoDoYouWantToHire}
          />
        );
    }
  };

  return (
    <PageRoot theme={theme}>
      <TopNav theme={theme}>
        <NavLeftSection theme={theme}>
          <NavMenuButton theme={theme} type="button" aria-label="Open menu">
            <Icon type={Icon.TYPES.LIST_OUTLINE} size={20} color="white" />
            <NavMenuLabel theme={theme}>Benefits</NavMenuLabel>
            <Icon type={Icon.TYPES.CHEVRON_DOWN} size={16} color="white" />
          </NavMenuButton>
        </NavLeftSection>

        <NavRightSection theme={theme}>
          <SearchBarWrapper theme={theme}>
            <SearchBar placeholder="Search or jump to..." adminMode theme={theme} />
          </SearchBarWrapper>

          <NavActions theme={theme}>
            <Button.Icon
              icon={Icon.TYPES.HELP_OUTLINE}
              aria-label="Help"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
            />
            <Button.Icon
              icon={Icon.TYPES.SETTINGS_OUTLINE}
              aria-label="Settings"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
            />
            <Button.Icon
              icon={Icon.TYPES.COMMENTS_OUTLINE}
              aria-label="Team chat"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
            />
            <Button.Icon
              icon={Icon.TYPES.NOTIFICATION_OUTLINE}
              aria-label="Notifications"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
            />
            <Button.Icon
              icon={Icon.TYPES.FX_OUTLINE}
              aria-label="AI Assistant"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.M}
            />
          </NavActions>

          <ProfileDivider theme={theme}>
            <VerticalDivider theme={theme} />
          </ProfileDivider>

          <ProfileDropdown
            companyName="Acme, Inc."
            userInitial="A"
            adminMode
            currentMode={currentMode}
            onAdminModeToggle={() => {}}
            theme={theme}
          />
        </NavRightSection>
      </TopNav>

      <FlowHeader theme={theme}>
        <FlowHeaderRow theme={theme}>
          <FlowHeaderLeft theme={theme}>
            <FlowTitleControl
              theme={theme}
              type="button"
              aria-label={isCopyMode ? 'Back to hire employee start' : 'Hire employee steps'}
              onClick={() => {
                if (isCopyMode) {
                  returnToMainScreen();
                }
              }}
            >
              <FlowTitle theme={theme}>Hire employee</FlowTitle>
              <Icon type={Icon.TYPES.CHEVRON_DOWN} size={16} color={theme.colorOnSurface} />
            </FlowTitleControl>
            <FlowHeaderPipe theme={theme} />
          </FlowHeaderLeft>
          <FlowHeaderRight theme={theme}>
            <VersionLabel>Version</VersionLabel>
            <VersionSelectorWrap>
              <Input.Select
                list={VERSION_OPTIONS}
                value={version}
                onChange={value => handleVersionChange(value as VersionKey)}
              />
            </VersionSelectorWrap>
            <Button
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              icon={{
                type: Icon.TYPES.SAVE_AND_EXIT_OUTLINE,
                alignment: Button.ICON_ALIGNMENTS.LEFT,
              }}
            >
              Save and exit
            </Button>
          </FlowHeaderRight>
        </FlowHeaderRow>
        <ProgressBar completedPercent={progressPercent} aria-label="Hire employee progress" />
      </FlowHeader>

      <Body theme={theme} isCopyMode={isCopyMode} isVariant={isVariant}>
        {renderMainContent()}
      </Body>

      <FlowFooter theme={theme}>
        <Button
          appearance={Button.APPEARANCES.GHOST}
          size={Button.SIZES.M}
          isDisabled={!isCopyMode}
          onClick={returnToMainScreen}
        >
          <HStack gap="0.25rem" align="center">
            <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
            <span>Back</span>
          </HStack>
        </Button>
        <Button
          appearance={Button.APPEARANCES.PRIMARY}
          size={Button.SIZES.M}
          isDisabled={isCopyMode || (version === 'base' ? !canContinue : true)}
        >
          Continue
        </Button>
      </FlowFooter>
    </PageRoot>
  );
};

export default HireEmployeeAiDemo;
