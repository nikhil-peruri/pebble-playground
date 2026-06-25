import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

export const BERRY_BG = '#4a0039';
export const BRAND_PURPLE = '#5c1a6b';
export const PAGE_BG = '#f5f4f2';
export const MUTED_TEXT = '#888';
export const DIVIDER_TEXT = '#aaa';
export const CHIP_BG = '#f5f0fe';
export const CHIP_BORDER = '#c9b3ef';

export const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
`;

export const TopNav = styled.nav`
  height: 56px;
  background-color: ${BERRY_BG};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const NavLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  width: 266px;
  min-width: 266px;
  height: 56px;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space400};
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
`;

export const NavMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  background: none;
  border: none;
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  color: white;
  padding: ${({ theme }) => (theme as StyledTheme).space200}
    ${({ theme }) => (theme as StyledTheme).space300};
  cursor: pointer;
  font-family: inherit;
  flex: 1;
  min-width: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const NavMenuLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  font-weight: 600;
  color: white;
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavRightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 0;
`;

export const SearchBarWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space1000};
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding-right: ${({ theme }) => (theme as StyledTheme).space400};

  button svg,
  button i,
  button [class*='Icon'] {
    color: white !important;
    fill: white !important;
  }
`;

export const ProfileDivider = styled.div`
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300} 0
    ${({ theme }) => (theme as StyledTheme).space400};
`;

export const VerticalDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: white;
  opacity: 0.3;
`;

export const FlowHeader = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  flex-shrink: 0;
`;

export const FlowHeaderRow = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
`;

export const FlowHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  min-width: 266px;
  max-width: 480px;
  height: 56px;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space300};
  padding-right: 1px;
  flex-shrink: 0;
`;

export const FlowTitleControl = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  background: none;
  border: none;
  padding: ${({ theme }) => (theme as StyledTheme).space100}
    ${({ theme }) => (theme as StyledTheme).space250};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  cursor: pointer;
  font-family: inherit;
  min-width: 0;

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const FlowTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyLarge};
  font-weight: 535;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FlowHeaderPipe = styled.div`
  width: 1px;
  height: 20px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  flex-shrink: 0;
`;

export const FlowHeaderRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding-right: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const VersionSelectorWrap = styled.div`
  min-width: 220px;
`;

export const Body = styled.div<{ isCopyMode?: boolean; isVariant?: boolean }>`
  flex: 1;
  background-color: ${({ isVariant, theme }) =>
    isVariant ? PAGE_BG : (theme as StyledTheme).colorSurface};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ isCopyMode }) => (isCopyMode ? 'center' : 'flex-start')};
  padding: ${({ theme }) => (theme as StyledTheme).space1000}
    ${({ theme }) => (theme as StyledTheme).space600};
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  overflow-y: auto;
`;

export const ContentColumn = styled.div`
  width: 100%;
  max-width: 581px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

export const SectionTitle = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0;
`;

export const FlowFooter = styled.div`
  height: 56px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => (theme as StyledTheme).space500};
  flex-shrink: 0;
`;

export const AiSectionCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 1.5px solid ${BRAND_PURPLE};
  border-radius: 12px;
  padding: 20px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AiBadge = styled.div`
  position: absolute;
  top: -11px;
  left: 12px;
  background: ${BRAND_PURPLE};
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 999px;
  line-height: 16px;
`;

export const AiSectionTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

export const AiSectionSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${MUTED_TEXT};
  line-height: 1.4;
`;

export const HookBanner = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #d4b8f0;
  background: linear-gradient(135deg, #f0ebfe 0%, #fbeaf0 100%);
`;

export const HookIconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${BRAND_PURPLE};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const HookHeadline = styled.p`
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 500;
  color: #3a1560;
`;

export const HookBody = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  color: #7a5a9a;
  line-height: 1.4;
`;

export const HookCtaPill = styled.button`
  border: none;
  background: ${BRAND_PURPLE};
  color: white;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const StatCard = styled.div`
  background: ${CHIP_BG};
  border: 1px solid #d8c8f5;
  border-radius: 9px;
  padding: 10px 12px;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${BRAND_PURPLE};
  line-height: 1.1;
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: #7a5a9a;
  margin-top: 4px;
  line-height: 1.3;
`;

export const ValueCallout = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  background: #eaf6ef;
  border: 1px solid #b8dfca;
`;

export const ValueIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #1d9e75;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ValueText = styled.div`
  font-size: 12px;
  color: #0f6e56;
  line-height: 1.45;

  strong {
    display: block;
    margin-bottom: 2px;
  }
`;

export const DemoArea = styled.div`
  background: #fafaf8;
  border: 1px solid #e0ddd6;
  border-radius: 9px;
  padding: 12px 14px;
  min-height: 88px;
`;

export const DemoLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${DIVIDER_TEXT};
  margin-bottom: 8px;
`;

export const UserBubbleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

export const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: ${BRAND_PURPLE};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const UserBubble = styled.div`
  background: ${BRAND_PURPLE};
  color: white;
  font-size: 12px;
  line-height: 1.4;
  padding: 8px 10px;
  border-radius: 0 8px 8px 8px;
  max-width: calc(100% - 32px);
`;

export const ResponseArea = styled.div<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

export const ResponseLabel = styled.div`
  font-size: 11px;
  color: ${MUTED_TEXT};
  margin-bottom: 6px;
`;

export const DetailChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DetailChip = styled.span<{ variant?: 'purple' | 'green' }>`
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ variant }) => (variant === 'green' ? '#eaf6ef' : '#f0ebfe')};
  border: 1px solid ${({ variant }) => (variant === 'green' ? '#b8dfca' : CHIP_BORDER)};
  color: ${({ variant }) => (variant === 'green' ? '#0f6e56' : BRAND_PURPLE)};
`;

export const VariantInputWrap = styled.div`
  position: relative;
`;

export const VariantInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutline};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: #fafaf8;
  padding: 10px 44px 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${BRAND_PURPLE};
  }
`;

export const AnimatedPlaceholder = styled.div`
  position: absolute;
  left: 12px;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: ${MUTED_TEXT};
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SendButtonWrap = styled.div`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
`;

export const VariantPromptChip = styled.button<{ isDimmed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 24px;
  border: 1px solid ${CHIP_BORDER};
  background-color: ${CHIP_BG};
  color: ${BRAND_PURPLE};
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};

  &:hover {
    background-color: #ebe4fd;
  }
`;

export const VariantPromptsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ManualOrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const ManualOrLine = styled.div`
  flex: 1;
  height: 0.5px;
  background-color: #e0ddd6;
`;

export const ManualOrText = styled.span`
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: ${DIVIDER_TEXT};
  white-space: nowrap;
`;

export const ManualCard = styled.div`
  background: #ffffff;
  border: 0.5px solid #e0ddd6;
  border-radius: 10px;
  padding: 14px 16px;
`;

export const ManualCardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ManualRadioRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: 0.5px solid #e0ddd6;
  border-radius: 7px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};

  &:last-child {
    margin-bottom: 0;
  }

  input {
    accent-color: ${BRAND_PURPLE};
  }
`;

export const Composer = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutline};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  padding: ${({ theme }) => (theme as StyledTheme).space200};
  min-height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: text;
`;

export const ComposerPlaceholder = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
`;

export const ComposerTemplate = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  line-height: 20px;
  white-space: pre-wrap;
`;

export const MentionAt = styled.span`
  font-weight: 700;
  color: #7a005d;
`;

export const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  height: 32px;
`;

export const PromptChip = styled.button<{ isDimmed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 24px;
  border: 1px solid #b453a4;
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceBright};
  color: #4a0039;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  cursor: pointer;
  font-family: inherit;
  opacity: ${({ isDimmed }) => (isDimmed ? 0.4 : 1)};

  &:hover {
    background-color: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  }
`;

export const PromptsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  width: 100%;
`;

export const OrLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

export const OrText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  width: 100%;
`;

export const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorError};
`;

export const DraftHireRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  width: 100%;
  max-width: 576px;
`;

export const DraftHireText = styled.p`
  flex: 1;
  margin: 0;
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;
