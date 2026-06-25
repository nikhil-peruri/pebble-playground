/**
 * Hiring End-to-End Flow Demo
 *
 * Multi-step wizard for hiring a new employee via Employer of Record (EOR) — India.
 * 14 screens covering the full flow:
 *   Hiring Method → Work Location → EOR Transfer → Employment Details →
 *   Compensation → Additional Details → Agreements (loading) → Review Hire →
 *   Additional Doc Info → Send Email (loading) → Employee Profile
 *
 * Source: Hiring_Flow_Prototype_Spec.docx
 */

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import Button from '@rippling/pebble/Button';
import Avatar from '@rippling/pebble/Avatar';
import { VStack, HStack } from '@rippling/pebble/Layout/Stack';

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0% { background-position: -800px 0; }
  100% { background-position: 800px 0; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep =
  | 'hiring-method'
  | 'work-location'
  | 'eor-transfer'
  | 'employment-details'
  | 'compensation'
  | 'additional-employment'
  | 'agreements-loading'
  | 'review-hire'
  | 'additional-doc-info'
  | 'send-email'
  | 'employee-profile';

// ─── Global Wizard Layout ─────────────────────────────────────────────────────

const WizardRoot = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  display: flex;
  flex-direction: column;
`;

const TopNav = styled.nav`
  height: 56px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space600};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  flex-shrink: 0;
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: -0.5px;
  font-family: system-ui, sans-serif;
`;

const NavMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  color: white;
  padding: ${({ theme }) => (theme as StyledTheme).space100}
    ${({ theme }) => (theme as StyledTheme).space200};
  font-size: 13px;
  cursor: pointer;
  font-family: system-ui, sans-serif;
`;

const NavSearch = styled.div`
  flex: 1;
  max-width: 480px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-family: system-ui, sans-serif;
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex-shrink: 0;
`;

const NavIconBtn = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const NavBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorError};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 1.5px solid ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const NavAvatarPill = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  padding: ${({ theme }) => (theme as StyledTheme).space100}
    ${({ theme }) => (theme as StyledTheme).space300};
  cursor: pointer;
  font-size: 13px;
  color: white;
  font-family: system-ui, sans-serif;
`;

const SubHeader = styled.div`
  height: 44px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space600};
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 199;
`;

const SubHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SubHeaderTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-size: 15px;
`;

const SaveAndExit = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  background: none;
  border: none;
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;
  font-size: 13px;
  font-family: system-ui, sans-serif;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ContentArea = styled.div`
  margin-top: 100px;
  margin-bottom: 60px;
  min-height: calc(100vh - 160px);
  display: flex;
  overflow-y: auto;
`;

const FooterBar = styled.div`
  height: 60px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space600};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
`;

// ─── Layout Primitives ────────────────────────────────────────────────────────

const TwoColumnLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
`;

const FormColumn = styled.div`
  flex: 0 0 58%;
  padding: ${({ theme }) => (theme as StyledTheme).space800};
`;

const HelpColumn = styled.div`
  flex: 0 0 42%;
  border-left: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space800};
  min-height: 100%;
`;

const CenteredContent = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: ${({ theme }) => (theme as StyledTheme).space1000}
    ${({ theme }) => (theme as StyledTheme).space600};
  width: 100%;
`;

const WideContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => (theme as StyledTheme).space800}
    ${({ theme }) => (theme as StyledTheme).space600};
  width: 100%;
`;

// ─── Form Elements ────────────────────────────────────────────────────────────

const SectionTitle = styled.h2`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space800} 0;
  text-align: center;
`;

const FormSectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space500};
`;

const FieldLabel = styled.label`
  display: block;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
`;

const FieldHelper = styled.span`
  display: block;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space100};
`;

const MockInput = styled.div`
  height: 38px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  cursor: text;
`;

const MockSelect = styled.div`
  height: 38px;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  cursor: pointer;
`;

const Placeholder = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  opacity: 0.55;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

// ─── Radio Card Rows ──────────────────────────────────────────────────────────

const RadioCardRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border: 1.5px solid
    ${({ theme, isSelected }) =>
      isSelected
        ? (theme as StyledTheme).colorPrimary
        : (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerMd};
  background-color: ${({ theme, isSelected }) =>
    isSelected
      ? (theme as StyledTheme).colorSurfaceContainerLow
      : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};

  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const RadioCircle = styled.div<{ isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected
        ? (theme as StyledTheme).colorPrimary
        : (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: border-color 150ms ease;
`;

const RadioDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
`;

const RadioCardTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const RadioCardDescription = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-top: ${({ theme }) => (theme as StyledTheme).space100};
  line-height: 1.5;
`;

// ─── Help Panel ───────────────────────────────────────────────────────────────

const HelpTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const HelpSection = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const HelpSectionTitle = styled.h4`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space200} 0;
`;

const HelpSectionBody = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.6;
`;

// ─── Badges ───────────────────────────────────────────────────────────────────

const ReviewRequiredBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme }) => (theme as StyledTheme).colorWarning}22;
  color: ${({ theme }) => (theme as StyledTheme).colorWarning};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  white-space: nowrap;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorWarning}55;
`;

const OptionalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  white-space: nowrap;
`;

const CountryDefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  white-space: nowrap;
`;

const SuccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSuccess}22;
  color: ${({ theme }) => (theme as StyledTheme).colorSuccess};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorSuccess}44;
`;

// ─── Warning Banner ───────────────────────────────────────────────────────────

const WarningBanner = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorWarning}15;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorWarning}55;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const WarningText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 1.5;
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBar = styled.div<{ width?: string; height?: number }>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? 16}px;
  background: linear-gradient(
    to right,
    ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh} 0%,
    ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow} 50%,
    ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh} 100%
  );
  background-size: 800px 100%;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
  animation: ${shimmer} 1.5s infinite linear;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

// ─── Compensation / Cost Table ────────────────────────────────────────────────

const CurrencyConverterCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const CostCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  overflow: hidden;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const CostCardSection = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  }
`;

const CostCardSectionTitle = styled.h4`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

const CostTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
`;

const CostTh = styled.th`
  text-align: right;
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space300};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};

  &:first-of-type {
    text-align: left;
  }
`;

const CostTd = styled.td`
  text-align: right;
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space300};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:first-of-type {
    text-align: left;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CostTdTotal = styled(CostTd)`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
`;

const CostFootnote = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space200} 0 0;
  font-style: italic;
`;

// ─── Review Screen ────────────────────────────────────────────────────────────

const ReviewCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  overflow: hidden;
`;

const ReviewCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ReviewCardTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  flex: 1;
`;

const ReviewCardHelper = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space400};
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SummaryCell = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space500};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:nth-of-type(3n) {
    border-right: none;
  }
`;

const SummaryLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
`;

const SummaryValue = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

// ─── Document List ────────────────────────────────────────────────────────────

const DocumentList = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 2.1;
`;

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  border-top-color: ${({ theme }) => (theme as StyledTheme).colorWarning};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
  animation: ${spin} 0.8s linear infinite;
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  min-height: 300px;
  width: 100%;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
`;

// ─── Employee Profile ─────────────────────────────────────────────────────────

const ProfilePage = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
`;

const Sidebar = styled.aside`
  width: 210px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
  padding: ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

const SidebarGroup = styled.div`
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
`;

const SidebarGroupLabel = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space500};
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const SidebarItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space500};
  cursor: pointer;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorPrimary : (theme as StyledTheme).colorOnSurfaceVariant};
  background-color: ${({ theme, isActive }) =>
    isActive ? (theme as StyledTheme).colorSurfaceContainerLow : 'transparent'};
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  border-right: 2px solid
    ${({ theme, isActive }) => (isActive ? (theme as StyledTheme).colorPrimary : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

const ProfileContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => (theme as StyledTheme).space600}
    ${({ theme }) => (theme as StyledTheme).space800};
  overflow-y: auto;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const BreadcrumbLink = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space600};
`;

const ProfileCardHeader = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const ProfileName = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const ProfileSubtitle = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const DataCell = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space500};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-right: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:nth-of-type(3n) {
    border-right: none;
  }

  &:nth-last-of-type(-n + 3) {
    border-bottom: none;
  }
`;

const DataLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space100};
`;

const DataValue = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PendingActionsCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  overflow: hidden;
`;

const PendingActionsHeader = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PendingActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space600};
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  &:last-child {
    border-bottom: none;
  }
`;

const PendingActionTitle = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const PendingActionDesc = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const HiringEndToEndDemo: React.FC = () => {
  const { theme } = usePebbleTheme();

  const STEPS: WizardStep[] = [
    'hiring-method',
    'work-location',
    'eor-transfer',
    'employment-details',
    'compensation',
    'additional-employment',
    'agreements-loading',
    'review-hire',
    'additional-doc-info',
    'send-email',
    'employee-profile',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];

  // Form state
  const [hiringMethod, setHiringMethod] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [agreementsLoaded, setAgreementsLoaded] = useState(false);
  const [startButtonLoading, setStartButtonLoading] = useState(false);
  const [agreementsExpanded, setAgreementsExpanded] = useState(false);
  const [pendingReviewCount, setPendingReviewCount] = useState(3);

  // Auto-progress loading screens
  useEffect(() => {
    if (currentStep === 'agreements-loading') {
      setAgreementsLoaded(false);
      const t = setTimeout(() => setAgreementsLoaded(true), 2200);
      return () => clearTimeout(t);
    }
    if (currentStep === 'send-email') {
      const t = setTimeout(() => setCurrentStepIndex(prev => prev + 1), 2600);
      return () => clearTimeout(t);
    }
  }, [currentStep]);

  const canContinue = () => {
    if (currentStep === 'hiring-method') return !!hiringMethod;
    if (currentStep === 'work-location') return !!employmentType;
    if (currentStep === 'agreements-loading') return agreementsLoaded;
    return true;
  };

  const handleContinue = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  const stepTitles: Record<WizardStep, string> = {
    'hiring-method': 'Job details',
    'work-location': 'Work location',
    'eor-transfer': 'Work location',
    'employment-details': 'Employment details',
    compensation: 'Compensation details',
    'additional-employment': 'Additional employment details',
    'agreements-loading': 'Agreements and documents',
    'review-hire': 'Review hire',
    'additional-doc-info': 'Additional document information',
    'send-email': 'Send email notification',
    'employee-profile': 'People',
  };

  const continueLabel = () => {
    if (currentStep === 'review-hire' && pendingReviewCount > 0)
      return `Review (${pendingReviewCount}) required items`;
    return 'Continue';
  };

  const isEmployeeProfile = currentStep === 'employee-profile';
  const isSendEmail = currentStep === 'send-email';

  // ─── Step Renderers ──────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      // SCREEN 1 — Hiring Method
      case 'hiring-method':
        return (
          <CenteredContent theme={theme}>
            <SectionTitle theme={theme}>How would you like to hire?</SectionTitle>
            {[
              {
                id: 'job-template',
                title: 'Use a job template',
                desc: 'Start from a pre-configured template with role-specific settings for compensation, benefits, and employment type.',
                showInfo: true,
              },
              {
                id: 'new-hire',
                title: 'Hire a new employee',
                desc: 'Create a custom hire with full control over all employment details, compensation structure, and benefits configuration.',
                showInfo: false,
              },
              {
                id: 'transfer',
                title: 'Transfer an existing employee',
                desc: 'Move an existing employee to a new entity, location, or employment type using Rippling EOR.',
                showInfo: false,
              },
            ].map(opt => (
              <RadioCardRow
                key={opt.id}
                theme={theme}
                isSelected={hiringMethod === opt.id}
                onClick={() => setHiringMethod(opt.id)}
              >
                <RadioCircle theme={theme} isSelected={hiringMethod === opt.id}>
                  {hiringMethod === opt.id && <RadioDot theme={theme} />}
                </RadioCircle>
                <div style={{ flex: 1 }}>
                  <RadioCardTitle theme={theme}>
                    {opt.title}
                    {opt.showInfo && (
                      <Icon
                        type={Icon.TYPES.INFO_CIRCLE_OUTLINE}
                        size={14}
                        color={theme.colorOnSurfaceVariant}
                      />
                    )}
                  </RadioCardTitle>
                  <RadioCardDescription theme={theme}>{opt.desc}</RadioCardDescription>
                </div>
              </RadioCardRow>
            ))}
          </CenteredContent>
        );

      // SCREEN 2 — Work Location
      case 'work-location':
        return (
          <FormColumn theme={theme} style={{ maxWidth: 640 }}>
            <FormSectionTitle theme={theme}>Where will this employee work?</FormSectionTitle>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Work location</FieldLabel>
              <MockInput theme={theme}>
                <Icon
                  type={Icon.TYPES.SEARCH_OUTLINE}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
                <span>Bengaluru, Karnataka, India</span>
              </MockInput>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Employment type</FieldLabel>
              <MockSelect
                theme={theme}
                onClick={() => setEmploymentType('Salaried, full-time (EOR)')}
              >
                {employmentType ? (
                  <span style={{ color: theme.colorOnSurface }}>{employmentType}</span>
                ) : (
                  <Placeholder theme={theme}>Select employment type</Placeholder>
                )}
                <Icon
                  type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockSelect>
              {!employmentType && (
                <FieldHelper theme={theme}>Required to continue — click to select</FieldHelper>
              )}
            </FormField>

            <WarningBanner theme={theme}>
              <Icon
                type={Icon.TYPES.WARNING_TRIANGLE_OUTLINE}
                size={16}
                color={theme.colorWarning}
              />
              <WarningText theme={theme}>
                Rippling EOR is available for India. Employees hired through EOR are employed by
                Rippling's local entity on your behalf.{' '}
                <span style={{ color: theme.colorPrimary, cursor: 'pointer' }}>Learn more</span>
              </WarningText>
            </WarningBanner>
          </FormColumn>
        );

      // SCREEN 3 — EOR Transfer Details
      case 'eor-transfer':
        return (
          <TwoColumnLayout>
            <FormColumn theme={theme}>
              <FormSectionTitle theme={theme}>EOR employment details</FormSectionTitle>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>EOR entity</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Rippling India Private Limited</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
                <FieldHelper theme={theme}>
                  The Rippling entity that will employ this worker
                </FieldHelper>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Work location</FieldLabel>
                <MockInput theme={theme}>
                  <Icon
                    type={Icon.TYPES.LOCATION_OUTLINE}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                  <span>Bengaluru, Karnataka, India</span>
                </MockInput>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Employment type</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Salaried, full-time (EOR)</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Start date</FieldLabel>
                <MockInput theme={theme}>
                  <span style={{ flex: 1 }}>06/01/2025</span>
                  <Icon
                    type={Icon.TYPES.V2_START_DATE}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockInput>
              </FormField>

              <Divider theme={theme} />

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Tax identification number (PAN)</FieldLabel>
                <MockInput theme={theme}>
                  <Placeholder theme={theme}>Enter PAN number</Placeholder>
                </MockInput>
                <FieldHelper theme={theme}>
                  10-character alphanumeric identifier issued by the Income Tax Department
                </FieldHelper>
              </FormField>
            </FormColumn>

            <HelpColumn theme={theme}>
              <HelpTitle theme={theme}>Don't have an entity in India? Use Rippling EOR</HelpTitle>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>
                  Directly hire employees to your entity in India
                </HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  If you have a registered business entity in India, you can hire employees directly
                  under your company. You'll manage all local compliance, payroll taxes, and
                  statutory contributions yourself.
                </HelpSectionBody>
              </HelpSection>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>
                  Managing your contractors in Rippling
                </HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  Contractors in India are managed differently from full-time employees. You can
                  onboard contractors without EOR, and Rippling will help you manage payments,
                  invoices, and agreements.
                </HelpSectionBody>
              </HelpSection>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>Employment in India</HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  India has complex labor laws including statutory benefits (PF, ESI, gratuity),
                  mandatory notice periods, and state-specific regulations. Rippling EOR handles all
                  of this on your behalf, ensuring full legal compliance.
                </HelpSectionBody>
              </HelpSection>
            </HelpColumn>
          </TwoColumnLayout>
        );

      // SCREEN 4 — Employment Details
      case 'employment-details':
        return (
          <TwoColumnLayout>
            <FormColumn theme={theme}>
              <FormSectionTitle theme={theme}>Employment details</FormSectionTitle>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Job title</FieldLabel>
                <MockInput theme={theme}>
                  <span>Senior Software Engineer</span>
                </MockInput>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Department</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Engineering</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Manager</FieldLabel>
                <MockInput theme={theme}>
                  <Icon
                    type={Icon.TYPES.SEARCH_OUTLINE}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                  <Placeholder theme={theme}>Search for a manager</Placeholder>
                </MockInput>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Employment type</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Salaried, full-time (EOR)</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
                <CountryDefaultBadge theme={theme} style={{ marginTop: 4 }}>
                  Country default
                </CountryDefaultBadge>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Work schedule</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Standard (Mon–Fri, 40 hrs/week)</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
              </FormField>
            </FormColumn>

            <HelpColumn theme={theme}>
              <HelpTitle theme={theme}>Employment types in India</HelpTitle>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>Salaried, full-time (EOR):</HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  Full-time employment through Rippling's Indian entity. Includes all statutory
                  benefits — Provident Fund (PF), Employee State Insurance (ESI), gratuity, and
                  mandatory paid leave as per the Shops and Establishments Act.
                </HelpSectionBody>
              </HelpSection>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>Salaried, part-time (EOR):</HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  Part-time employment through Rippling's entity. Same statutory benefits apply on a
                  pro-rated basis. Minimum hours and benefit thresholds are regulated by state labor
                  laws.
                </HelpSectionBody>
              </HelpSection>
              <HelpSection theme={theme}>
                <HelpSectionTitle theme={theme}>Temporary / Intern (EOR):</HelpSectionTitle>
                <HelpSectionBody theme={theme}>
                  Fixed-term engagement for interns or temporary employees. Typically exempt from
                  certain statutory benefits depending on tenure and salary thresholds.
                </HelpSectionBody>
              </HelpSection>
            </HelpColumn>
          </TwoColumnLayout>
        );

      // SCREEN 5 — Compensation Details
      case 'compensation':
        return (
          <TwoColumnLayout>
            <FormColumn theme={theme}>
              <FormSectionTitle theme={theme}>Compensation details</FormSectionTitle>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Currency</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Indian Rupee (INR)</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Annual salary (CTC)</FieldLabel>
                <MockInput theme={theme}>
                  <span style={{ color: theme.colorOnSurfaceVariant }}>₹</span>
                  <span style={{ flex: 1 }}>96,00,000</span>
                </MockInput>
                <FieldHelper theme={theme}>
                  Cost to Company — includes all components before deductions
                </FieldHelper>
              </FormField>

              <FormField theme={theme}>
                <FieldLabel theme={theme}>Pay frequency</FieldLabel>
                <MockSelect theme={theme}>
                  <span>Monthly</span>
                  <Icon
                    type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                    size={14}
                    color={theme.colorOnSurfaceVariant}
                  />
                </MockSelect>
              </FormField>

              <Divider theme={theme} />

              <FormSectionTitle theme={theme} style={{ fontSize: 14 }}>
                Salary breakdown
              </FormSectionTitle>
              <FieldHelper theme={theme} style={{ marginBottom: theme.space400 }}>
                Configure how the CTC is split across components
              </FieldHelper>

              <FormField theme={theme}>
                <HStack gap="1rem">
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme}>Basic salary</FieldLabel>
                    <MockInput theme={theme}>
                      <span>₹ 38,40,000</span>
                    </MockInput>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme}>HRA</FieldLabel>
                    <MockInput theme={theme}>
                      <span>₹ 19,20,000</span>
                    </MockInput>
                  </div>
                </HStack>
              </FormField>

              <FormField theme={theme}>
                <HStack gap="1rem">
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme}>Special allowance</FieldLabel>
                    <MockInput theme={theme}>
                      <span>₹ 27,25,044</span>
                    </MockInput>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme}>PF contribution</FieldLabel>
                    <MockInput theme={theme}>
                      <span>₹ 1,99,584</span>
                    </MockInput>
                  </div>
                </HStack>
              </FormField>
            </FormColumn>

            <HelpColumn theme={theme}>
              <CurrencyConverterCard theme={theme}>
                <HelpSectionTitle theme={theme} style={{ marginBottom: theme.space300 }}>
                  Currency converter
                </HelpSectionTitle>
                <HStack gap="1rem">
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme} style={{ fontSize: 11 }}>
                      Indian Rupee (INR)
                    </FieldLabel>
                    <MockInput theme={theme}>
                      <span>INR 96.86</span>
                    </MockInput>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FieldLabel theme={theme} style={{ fontSize: 11 }}>
                      US Dollar (USD)
                    </FieldLabel>
                    <MockInput theme={theme}>
                      <span>USD 1</span>
                    </MockInput>
                  </div>
                </HStack>
              </CurrencyConverterCard>

              <HelpTitle theme={theme}>Estimated costs of hiring this employee</HelpTitle>

              <CostCard theme={theme}>
                <CostCardSection theme={theme}>
                  <CostCardSectionTitle theme={theme}>
                    Estimated employment costs
                  </CostCardSectionTitle>
                  <CostTable theme={theme}>
                    <thead>
                      <tr>
                        <CostTh theme={theme}></CostTh>
                        <CostTh theme={theme}>Monthly</CostTh>
                        <CostTh theme={theme}>Annually</CostTh>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <CostTd theme={theme}>Cost to Company (CTC)</CostTd>
                        <CostTd theme={theme}>₹8,00,000</CostTd>
                        <CostTd theme={theme}>₹96,00,000</CostTd>
                      </tr>
                      <tr>
                        <CostTdTotal theme={theme}>Total</CostTdTotal>
                        <CostTdTotal theme={theme}>₹8,00,000</CostTdTotal>
                        <CostTdTotal theme={theme}>₹96,00,000</CostTdTotal>
                      </tr>
                    </tbody>
                  </CostTable>
                </CostCardSection>
                <CostCardSection theme={theme}>
                  <CostCardSectionTitle theme={theme}>Rippling EOR costs</CostCardSectionTitle>
                  <CostTable theme={theme}>
                    <thead>
                      <tr>
                        <CostTh theme={theme}></CostTh>
                        <CostTh theme={theme}>Monthly</CostTh>
                        <CostTh theme={theme}>Annually</CostTh>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <CostTd theme={theme}>Rippling EOR fee</CostTd>
                        <CostTd theme={theme}>$599</CostTd>
                        <CostTd theme={theme}>$7,188</CostTd>
                      </tr>
                      <tr>
                        <CostTdTotal theme={theme}>Total</CostTdTotal>
                        <CostTdTotal theme={theme}>$599</CostTdTotal>
                        <CostTdTotal theme={theme}>$7,188</CostTdTotal>
                      </tr>
                    </tbody>
                  </CostTable>
                  <CostFootnote theme={theme}>You will be billed in USD.</CostFootnote>
                  <CostFootnote theme={theme}>
                    Conversion rate: 1 USD = 96.86 INR (as of today)
                  </CostFootnote>
                </CostCardSection>
              </CostCard>
            </HelpColumn>
          </TwoColumnLayout>
        );

      // SCREEN 6 — Additional Employment Details
      case 'additional-employment':
        return (
          <FormColumn theme={theme} style={{ maxWidth: 640 }}>
            <FormSectionTitle theme={theme}>Additional employment details</FormSectionTitle>

            <WarningBanner theme={theme}>
              <Icon type={Icon.TYPES.INFO_CIRCLE_FILL} size={16} color={theme.colorWarning} />
              <WarningText theme={theme}>
                These fields are specific to India EOR employment and may be required for
                compliance.
              </WarningText>
            </WarningBanner>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Probation period</FieldLabel>
              <MockSelect theme={theme}>
                <span>3 months</span>
                <Icon
                  type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockSelect>
              <CountryDefaultBadge theme={theme} style={{ marginTop: 4 }}>
                Country default
              </CountryDefaultBadge>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Notice period</FieldLabel>
              <MockSelect theme={theme}>
                <span>2 months</span>
                <Icon
                  type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockSelect>
              <CountryDefaultBadge theme={theme} style={{ marginTop: 4 }}>
                Country default
              </CountryDefaultBadge>
            </FormField>

            <Divider theme={theme} />

            <FormSectionTitle theme={theme} style={{ fontSize: 14 }}>
              Statutory benefits
            </FormSectionTitle>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Provident Fund (PF)</FieldLabel>
              <MockSelect theme={theme}>
                <span>Employee contributes 12% of basic salary</span>
                <Icon
                  type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockSelect>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Employee State Insurance (ESI)</FieldLabel>
              <MockSelect theme={theme}>
                <span>Not applicable (salary above ESI threshold)</span>
                <Icon
                  type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockSelect>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Additional notes for employee</FieldLabel>
              <div
                style={{
                  border: `1px solid ${theme.colorOutlineVariant}`,
                  borderRadius: theme.shapeCornerSm,
                  minHeight: 80,
                  padding: `${theme.space200} ${theme.space300}`,
                  background: theme.colorSurfaceBright,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: theme.space200,
                }}
              >
                <Placeholder theme={theme} style={{ flex: 1, fontSize: 14 }}>
                  Add any additional information for the employee's offer letter…
                </Placeholder>
                <Icon
                  type={Icon.TYPES.STAR_OUTLINE}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </div>
              <OptionalBadge theme={theme} style={{ marginTop: 4 }}>
                Optional
              </OptionalBadge>
            </FormField>
          </FormColumn>
        );

      // SCREENS 7–9 — Agreements & Documents (Loading → Loaded)
      case 'agreements-loading':
        if (!agreementsLoaded) {
          return (
            <CenteredContent theme={theme}>
              <div style={{ textAlign: 'center', marginBottom: theme.space800 }}>
                <SkeletonBar
                  theme={theme}
                  width="160px"
                  height={22}
                  style={{ margin: '0 auto 16px' }}
                />
              </div>
              <Divider theme={theme} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.space600 }}>
                <VStack gap="0.5rem">
                  {[210, 180, 220, 195].map((w, i) => (
                    <SkeletonBar key={i} theme={theme} width={`${w}px`} height={14} />
                  ))}
                </VStack>
                <VStack gap="0.5rem">
                  {[310, 280, 300, 260].map((w, i) => (
                    <SkeletonBar key={i} theme={theme} width={`${w}px`} height={14} />
                  ))}
                </VStack>
              </div>
              <div
                style={{
                  marginTop: theme.space600,
                  color: theme.colorOnSurfaceVariant,
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                Loading documents…
              </div>
            </CenteredContent>
          );
        }
        return (
          <CenteredContent theme={theme}>
            <SectionTitle theme={theme}>Agreements and documents</SectionTitle>
            <Divider theme={theme} />
            <FormSectionTitle theme={theme}>Documents to be sent to employee</FormSectionTitle>
            <FieldHelper theme={theme} style={{ marginBottom: theme.space400 }}>
              The following documents will be sent to the employee for review and e-signature:
            </FieldHelper>
            <DocumentList theme={theme}>
              {[
                'Employment Agreement (India EOR)',
                'Appendix A — Compensation & Benefits Schedule',
                'Appendix B — EOR Terms and Conditions',
                'Confidentiality Agreement (NDA)',
                'Intellectual Property Assignment Agreement',
                'Code of Conduct Acknowledgment',
                'Anti-Harassment Policy Acknowledgment',
                'Data Protection and Privacy Policy',
                'Employee Handbook Acknowledgment',
                'Background Verification Consent Form',
                'PAN Card Declaration',
                'Bank Account Details Form',
                'Provident Fund Nomination Form',
                'Gratuity Nomination Form',
                'Emergency Contact Information',
                'Tax Declaration Form (Form 12BB)',
                'EOR Disclosure and Consent',
                'Work-from-home Agreement (if applicable)',
              ].map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </DocumentList>
          </CenteredContent>
        );

      // SCREENS 10–11 — Review Hire
      case 'review-hire': {
        const sections = [
          {
            id: 'personal',
            title: 'Personal information',
            badge: 'optional',
            helper: 'Employee name, contact details, and emergency contacts.',
            edited: true,
          },
          {
            id: 'job',
            title: 'Job details',
            badge: 'none',
            helper: 'Job title, department, manager, and work location.',
            edited: true,
          },
          {
            id: 'compensation',
            title: 'Compensation',
            badge: 'none',
            helper: 'Salary, pay frequency, and compensation components.',
            edited: true,
          },
          {
            id: 'employment',
            title: 'Employment details',
            badge: 'none',
            helper: 'Employment type, start date, probation, and notice period.',
            edited: true,
          },
          {
            id: 'benefits',
            title: 'Benefits enrollment',
            badge: 'optional',
            helper: 'Health insurance, provident fund, and other statutory benefits.',
            edited: false,
          },
          {
            id: 'devices',
            title: 'Devices',
            badge: 'optional',
            helper: 'Assign a device to be shipped to the employee on their start date.',
            edited: false,
          },
          {
            id: 'integrations',
            title: 'App & integrations',
            badge: 'optional',
            helper: 'Set up access to Slack, GitHub, Jira, and Google Workspace.',
            edited: false,
          },
          {
            id: 'agreements',
            title: 'Agreements and documents',
            badge: 'required',
            helper: '18 documents will be sent to the employee for e-signature.',
            edited: false,
          },
          {
            id: 'payroll',
            title: 'Payroll details',
            badge: 'required',
            helper: 'Verify bank account and tax information for payroll processing.',
            edited: false,
          },
          {
            id: 'background',
            title: 'Background check',
            badge: 'required',
            helper: 'Initiate identity and employment verification through our partner.',
            edited: false,
          },
        ];

        return (
          <WideContent theme={theme}>
            <SectionTitle theme={theme}>Review hire</SectionTitle>

            <SummaryGrid theme={theme}>
              {[
                { label: 'Name', value: 'Arjun Sharma' },
                { label: 'Location', value: 'Bengaluru, India' },
                { label: 'Start date', value: 'June 1, 2025' },
                { label: 'Entity', value: 'Rippling India Pvt. Ltd.' },
                { label: 'Salary', value: '₹96,00,000 / yr' },
                { label: 'Employment', value: 'Full-time EOR' },
              ].map(({ label, value }) => (
                <SummaryCell key={label} theme={theme}>
                  <SummaryLabel theme={theme}>{label}</SummaryLabel>
                  <SummaryValue theme={theme}>{value}</SummaryValue>
                </SummaryCell>
              ))}
            </SummaryGrid>

            {sections.map(section => (
              <ReviewCard key={section.id} theme={theme}>
                <ReviewCardHeader theme={theme}>
                  <ReviewCardTitle theme={theme}>{section.title}</ReviewCardTitle>
                  {section.badge === 'required' && (
                    <ReviewRequiredBadge theme={theme}>Review required</ReviewRequiredBadge>
                  )}
                  {section.badge === 'optional' && (
                    <OptionalBadge theme={theme}>Optional</OptionalBadge>
                  )}
                  {section.edited ? (
                    <Button size={Button.SIZES.S} appearance={Button.APPEARANCES.GHOST}>
                      Edit
                    </Button>
                  ) : (
                    <Button
                      size={Button.SIZES.S}
                      appearance={Button.APPEARANCES.PRIMARY}
                      onClick={() => {
                        if (section.id === 'agreements') {
                          setStartButtonLoading(true);
                          setTimeout(() => {
                            setStartButtonLoading(false);
                            setAgreementsExpanded(true);
                            setPendingReviewCount(prev => Math.max(0, prev - 1));
                          }, 1200);
                        }
                      }}
                    >
                      {section.id === 'agreements' && startButtonLoading ? (
                        <HStack gap="0.25rem" align="center">
                          <Icon type={Icon.TYPES.LOADER} size={12} />
                          <span>Loading…</span>
                        </HStack>
                      ) : agreementsExpanded && section.id === 'agreements' ? (
                        'Edit'
                      ) : (
                        'Start'
                      )}
                    </Button>
                  )}
                </ReviewCardHeader>
                <ReviewCardHelper theme={theme}>{section.helper}</ReviewCardHelper>

                {agreementsExpanded && section.id === 'agreements' && (
                  <div style={{ padding: `0 ${theme.space400} ${theme.space400}` }}>
                    <Divider theme={theme} />
                    <DocumentList theme={theme}>
                      {[
                        'Employment Agreement (India EOR)',
                        'Appendix B — EOR Terms and Conditions',
                        'Confidentiality Agreement (NDA)',
                        'IP Assignment Agreement',
                        'Code of Conduct Acknowledgment',
                      ].map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </DocumentList>
                  </div>
                )}
              </ReviewCard>
            ))}
          </WideContent>
        );
      }

      // SCREEN 12 — Additional Document Information
      case 'additional-doc-info':
        return (
          <CenteredContent theme={theme}>
            <SectionTitle theme={theme}>Additional document information</SectionTitle>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Signing party name</FieldLabel>
              <MockInput theme={theme}>
                <span>Arjun Sharma</span>
              </MockInput>
              <FieldHelper theme={theme}>
                Full legal name as it should appear on the agreements
              </FieldHelper>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Signing party email</FieldLabel>
              <MockInput theme={theme}>
                <span>arjun.sharma@email.com</span>
              </MockInput>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Personal email (for pre-boarding access)</FieldLabel>
              <MockInput theme={theme}>
                <Placeholder theme={theme}>employee@personalemail.com</Placeholder>
              </MockInput>
              <OptionalBadge theme={theme} style={{ marginTop: 4 }}>
                Optional
              </OptionalBadge>
              <FieldHelper theme={theme}>
                Used to send documents before the employee's work email is provisioned
              </FieldHelper>
            </FormField>

            <Divider theme={theme} />

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Document signing deadline</FieldLabel>
              <MockInput theme={theme}>
                <span style={{ flex: 1 }}>05/25/2025</span>
                <Icon
                  type={Icon.TYPES.V2_START_DATE}
                  size={14}
                  color={theme.colorOnSurfaceVariant}
                />
              </MockInput>
            </FormField>

            <FormField theme={theme}>
              <FieldLabel theme={theme}>Notes for the signing party</FieldLabel>
              <div
                style={{
                  border: `1px solid ${theme.colorOutlineVariant}`,
                  borderRadius: theme.shapeCornerSm,
                  minHeight: 80,
                  padding: `${theme.space200} ${theme.space300}`,
                  background: theme.colorSurfaceBright,
                }}
              >
                <Placeholder theme={theme} style={{ fontSize: 14 }}>
                  Please review and sign all documents before your start date…
                </Placeholder>
              </div>
              <OptionalBadge theme={theme} style={{ marginTop: 4 }}>
                Optional
              </OptionalBadge>
            </FormField>
          </CenteredContent>
        );

      // SCREEN 13 — Send Email Notification (Loading)
      case 'send-email':
        return (
          <SpinnerContainer theme={theme}>
            <Spinner theme={theme} />
            <span>Sending email notifications…</span>
          </SpinnerContainer>
        );

      // SCREEN 14 — Employee Profile (Post-Hire)
      case 'employee-profile':
        return (
          <ProfilePage>
            <Sidebar theme={theme}>
              <SidebarGroup theme={theme}>
                <SidebarItem theme={theme} isActive>
                  <Icon type={Icon.TYPES.PEOPLE_HEART_OUTLINE} size={16} />
                  HR Overview
                </SidebarItem>
                <SidebarItem theme={theme}>
                  <Icon type={Icon.TYPES.BRIEFCASE_OUTLINE} size={16} />
                  Org Chart
                </SidebarItem>
              </SidebarGroup>

              <SidebarGroup theme={theme}>
                <SidebarGroupLabel theme={theme}>People</SidebarGroupLabel>
                {[
                  { label: 'People', icon: Icon.TYPES.PEOPLE_HEART_OUTLINE },
                  { label: 'Anniversaries', icon: Icon.TYPES.STAR_OUTLINE },
                  { label: 'Compliance 360', icon: Icon.TYPES.FILE_CHECK_OUTLINE },
                  { label: 'Contractor Hub', icon: Icon.TYPES.BRIEFCASE_OUTLINE },
                  { label: 'Employment Verifications', icon: Icon.TYPES.FILE_USER_CHECK_OUTLINE },
                  { label: 'Work Authorization', icon: Icon.TYPES.DOCUMENT_OUTLINE },
                ].map(({ label, icon }) => (
                  <SidebarItem key={label} theme={theme}>
                    <Icon type={icon} size={16} />
                    {label}
                  </SidebarItem>
                ))}
              </SidebarGroup>

              <SidebarGroup theme={theme}>
                <SidebarGroupLabel theme={theme}>Platform</SidebarGroupLabel>
                {[
                  { label: 'Company Settings', icon: Icon.TYPES.COMPANY_SETTINGS_OUTLINE },
                  { label: 'App Shop', icon: Icon.TYPES.INTEGRATED_APPS_OUTLINE },
                  { label: 'Help', icon: Icon.TYPES.HELP_OUTLINE },
                ].map(({ label, icon }) => (
                  <SidebarItem key={label} theme={theme}>
                    <Icon type={icon} size={16} />
                    {label}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            </Sidebar>

            <ProfileContent theme={theme}>
              <Breadcrumb theme={theme}>
                <BreadcrumbLink theme={theme}>People</BreadcrumbLink>
                <Icon type={Icon.TYPES.ARROW_RIGHT} size={12} />
                <span>Arjun Sharma's Profile</span>
              </Breadcrumb>

              <ProfileCard theme={theme}>
                <ProfileCardHeader theme={theme}>
                  <Avatar title="Arjun Sharma" size={Avatar.SIZES.M} />
                  <div style={{ flex: 1 }}>
                    <ProfileName theme={theme}>Arjun Sharma</ProfileName>
                    <ProfileSubtitle theme={theme}>
                      Senior Software Engineer · Engineering · Bengaluru, India
                    </ProfileSubtitle>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: theme.space200,
                      }}
                    >
                      <SuccessBadge theme={theme}>
                        <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={12} />
                        Created
                      </SuccessBadge>
                      <span style={{ fontSize: 12, color: theme.colorOnSurfaceVariant }}>
                        Start date: June 1, 2025
                      </span>
                    </div>
                  </div>
                  <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.S}>
                    <HStack gap="0.25rem" align="center">
                      <Icon type={Icon.TYPES.EMAIL_OUTLINE} size={14} />
                      <span>Send welcome email</span>
                    </HStack>
                  </Button>
                </ProfileCardHeader>

                <DataGrid>
                  {[
                    { label: 'Employee ID', value: 'EMP-IND-2025-004' },
                    { label: 'Work email', value: 'arjun.sharma@company.com' },
                    { label: 'Personal email', value: 'arjun.sharma@email.com' },
                    { label: 'Department', value: 'Engineering' },
                    { label: 'Manager', value: '—' },
                    { label: 'Employment type', value: 'Full-time EOR' },
                    { label: 'Entity', value: 'Rippling India Pvt. Ltd.' },
                    { label: 'Salary (CTC)', value: '₹96,00,000 / year' },
                    { label: 'Pay frequency', value: 'Monthly' },
                    { label: 'Start date', value: 'June 1, 2025' },
                    { label: 'Probation ends', value: 'September 1, 2025' },
                    { label: 'Country', value: 'India' },
                  ].map(({ label, value }) => (
                    <DataCell key={label} theme={theme}>
                      <DataLabel theme={theme}>{label}</DataLabel>
                      <DataValue theme={theme}>{value}</DataValue>
                    </DataCell>
                  ))}
                </DataGrid>
              </ProfileCard>

              <PendingActionsCard theme={theme}>
                <PendingActionsHeader theme={theme}>Pending actions</PendingActionsHeader>
                {[
                  {
                    title: 'Awaiting document signatures',
                    desc: '18 documents sent to the employee for e-signature.',
                    badge: 'In progress',
                  },
                  {
                    title: 'Background check initiated',
                    desc: 'Identity and employment verification pending.',
                    badge: 'In progress',
                  },
                  {
                    title: 'Payroll setup',
                    desc: 'Bank account details and tax forms pending from employee.',
                    badge: 'Pending employee',
                  },
                ].map(({ title, desc, badge }) => (
                  <PendingActionRow key={title} theme={theme}>
                    <Icon
                      type={Icon.TYPES.HOURGLASS_CHECKED_OUTLINE}
                      size={16}
                      color={theme.colorWarning}
                    />
                    <div style={{ flex: 1 }}>
                      <PendingActionTitle theme={theme}>{title}</PendingActionTitle>
                      <PendingActionDesc theme={theme}>{desc}</PendingActionDesc>
                    </div>
                    <ReviewRequiredBadge theme={theme}>{badge}</ReviewRequiredBadge>
                  </PendingActionRow>
                ))}
              </PendingActionsCard>
            </ProfileContent>
          </ProfilePage>
        );

      default:
        return null;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <WizardRoot theme={theme}>
      {/* Top Navigation Bar */}
      <TopNav theme={theme}>
        <NavLogo theme={theme}>
          <LogoMark theme={theme}>RR</LogoMark>
          <NavMenuButton theme={theme}>
            {isEmployeeProfile ? 'HR' : 'Menu'}
            <Icon type={Icon.TYPES.DROPDOWN_ARROW_DOWN_FILLED} size={12} color="white" />
          </NavMenuButton>
        </NavLogo>

        <NavSearch theme={theme}>
          <Icon type={Icon.TYPES.SEARCH_OUTLINE} size={14} color="rgba(255,255,255,0.65)" />
          <span>Search Rippling…</span>
        </NavSearch>

        <NavIcons theme={theme}>
          <NavIconBtn theme={theme} aria-label="Help">
            <Icon type={Icon.TYPES.HELP_OUTLINE} size={18} color="rgba(255,255,255,0.85)" />
          </NavIconBtn>
          <NavIconBtn theme={theme} aria-label="Bookmarks">
            <Icon type={Icon.TYPES.BOOKMARK_OUTLINE} size={18} color="rgba(255,255,255,0.85)" />
          </NavIconBtn>
          <NavIconBtn theme={theme} aria-label="Notifications">
            <Icon type={Icon.TYPES.NOTIFICATION_OUTLINE} size={18} color="rgba(255,255,255,0.85)" />
            <NavBadge theme={theme} />
          </NavIconBtn>
          <NavAvatarPill theme={theme}>
            <Avatar title="HR Admin" size={Avatar.SIZES.S} />
            <span>corwin-klein</span>
          </NavAvatarPill>
        </NavIcons>
      </TopNav>

      {/* Sub-header */}
      <SubHeader theme={theme}>
        <SubHeaderLeft theme={theme}>
          <Icon type={Icon.TYPES.LIST_OUTLINE} size={18} color={theme.colorOnSurfaceVariant} />
          <SubHeaderTitle theme={theme}>{stepTitles[currentStep]}</SubHeaderTitle>
        </SubHeaderLeft>
        {!isEmployeeProfile && (
          <SaveAndExit theme={theme}>
            <Icon type={Icon.TYPES.SAVE_AND_EXIT_OUTLINE} size={14} />
            Save and exit
          </SaveAndExit>
        )}
      </SubHeader>

      {/* Main content */}
      <ContentArea>{renderStep()}</ContentArea>

      {/* Footer */}
      {!isEmployeeProfile && !isSendEmail && (
        <FooterBar theme={theme}>
          <Button
            appearance={Button.APPEARANCES.GHOST}
            size={Button.SIZES.M}
            onClick={handleBack}
            isDisabled={currentStepIndex === 0}
          >
            <HStack gap="0.25rem" align="center">
              <Icon type={Icon.TYPES.ARROW_LEFT} size={14} />
              <span>Back</span>
            </HStack>
          </Button>

          <HStack gap="1rem" align="center">
            <Icon
              type={Icon.TYPES.SETTINGS_OUTLINE}
              size={16}
              color={theme.colorOnSurfaceVariant}
            />
            <Button
              appearance={Button.APPEARANCES.PRIMARY}
              size={Button.SIZES.M}
              onClick={handleContinue}
              isDisabled={!canContinue()}
            >
              {continueLabel()}
            </Button>
          </HStack>
        </FooterBar>
      )}
    </WizardRoot>
  );
};

export default HiringEndToEndDemo;
