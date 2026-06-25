import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { usePebbleTheme, StyledTheme } from '@/utils/theme';
import { AppShellLayout } from '@/components/app-shell';
import Card from '@rippling/pebble/Card';
import Button from '@rippling/pebble/Button';
import Input from '@rippling/pebble/Inputs';
import Icon from '@rippling/pebble/Icon';
import Label from '@rippling/pebble/Label';
import ActionCard from '@rippling/pebble/ActionCard';
import Drawer from '@rippling/pebble/Drawer';
import Stepper from '@rippling/pebble/Stepper';
import { STEP_STATUS } from '@rippling/pebble/Stepper/FunnelStep';
import { HStack } from '@rippling/pebble/Layout/Stack';

/**
 * Job Templates + Business Structures Demo
 *
 * Matches the real Rippling job template creation flow (jobTemplateAdd):
 *  - 3-step wizard: Setup → Template Details → Review
 *  - Within Template Details, a "Job Codes" card has an "Edit" button
 *  - Clicking "Edit" opens a Drawer — matching ProfileBusinessStructure/RosterDrawers.tsx
 *  - Drawer: mode toggle → structure path selector → ↓ arrow → auto-applied TLDCs (locked)
 *            OR manual dimension-by-dimension TLDC picker
 *
 * Real codebase references:
 *   rippling-main:    hub/flows/job_template_add/flows.py
 *   rippling-webapp:  ProfileBusinessStructure/components/RosterDrawers.tsx
 *                     ProfileJobAssignment/types/index.ts
 *                     businessStructureSelect/types/index.ts
 */

// ─── Domain types (aligned to rippling-webapp) ────────────────────────────────

/** ProfileJobAssignment/types/index.ts */
type TldcItem = {
  id: string;
  name: string;
  isPrimaryAssignment?: boolean;
};

/** ProfileJobAssignment/types/index.ts */
type JobDimensionItem = {
  id: string;
  name: string;
  jobCodes: TldcItem[];
  rosterType: string;
};

type EnforceMode = 'business-structures' | 'manual';

// ─── Static data ──────────────────────────────────────────────────────────────

const BS_NODE_TYPE_LABELS: Record<string, string> = {
  WorkLocation: 'Location',
  Department: 'Department',
  Project: 'Project',
};

/** Valid business structure paths (ValidSelection[] from BS types) */
const STRUCTURE_PATHS = [
  {
    id: 'path_sf_eng_be',
    nodes: [
      { nodeType: 'WorkLocation', label: 'San Francisco', tldcId: 'tldc_loc_sf' },
      { nodeType: 'Department', label: 'Engineering', tldcId: 'tldc_dep_eng' },
      { nodeType: 'Project', label: 'Backend Services', tldcId: 'tldc_proj_be' },
    ],
    tldcItems: [
      { id: 'tldc_001', name: 'Backend Developer' },
      { id: 'tldc_002', name: 'Senior Backend Developer' },
    ] as TldcItem[],
  },
  {
    id: 'path_sf_eng_fe',
    nodes: [
      { nodeType: 'WorkLocation', label: 'San Francisco', tldcId: 'tldc_loc_sf' },
      { nodeType: 'Department', label: 'Engineering', tldcId: 'tldc_dep_eng' },
      { nodeType: 'Project', label: 'Frontend Web', tldcId: 'tldc_proj_fe' },
    ],
    tldcItems: [
      { id: 'tldc_003', name: 'Frontend Developer' },
      { id: 'tldc_004', name: 'Senior Frontend Developer' },
    ] as TldcItem[],
  },
  {
    id: 'path_ny_sales_q1',
    nodes: [
      { nodeType: 'WorkLocation', label: 'New York', tldcId: 'tldc_loc_ny' },
      { nodeType: 'Department', label: 'Sales', tldcId: 'tldc_dep_sales' },
      { nodeType: 'Project', label: 'Q1 Growth Campaign', tldcId: 'tldc_proj_q1' },
    ],
    tldcItems: [
      { id: 'tldc_005', name: 'Account Executive' },
      { id: 'tldc_006', name: 'Sales Development Rep' },
    ] as TldcItem[],
  },
  {
    id: 'path_atx_hr',
    nodes: [
      { nodeType: 'WorkLocation', label: 'Austin', tldcId: 'tldc_loc_atx' },
      { nodeType: 'Department', label: 'Human Resources', tldcId: 'tldc_dep_hr' },
    ],
    tldcItems: [
      { id: 'tldc_007', name: 'HR Business Partner' },
      { id: 'tldc_008', name: 'Recruiter' },
    ] as TldcItem[],
  },
  {
    id: 'path_rem_mkt',
    nodes: [
      { nodeType: 'WorkLocation', label: 'Remote', tldcId: 'tldc_loc_rem' },
      { nodeType: 'Department', label: 'Marketing', tldcId: 'tldc_dep_mkt' },
      { nodeType: 'Project', label: 'Brand Growth Initiative', tldcId: 'tldc_proj_brand' },
    ],
    tldcItems: [
      { id: 'tldc_009', name: 'Marketing Manager' },
      { id: 'tldc_010', name: 'Content Strategist' },
    ] as TldcItem[],
  },
];

/** Job dimensions (JobDimensionItem from ProfileJobAssignment) */
const JOB_DIMENSIONS: JobDimensionItem[] = [
  {
    id: 'dim_location',
    name: 'Location',
    rosterType: 'STANDARD',
    jobCodes: [
      { id: 'tldc_loc_sf', name: 'San Francisco' },
      { id: 'tldc_loc_ny', name: 'New York' },
      { id: 'tldc_loc_atx', name: 'Austin' },
      { id: 'tldc_loc_rem', name: 'Remote' },
    ],
  },
  {
    id: 'dim_department',
    name: 'Department',
    rosterType: 'STANDARD',
    jobCodes: [
      { id: 'tldc_dep_eng', name: 'Engineering' },
      { id: 'tldc_dep_sales', name: 'Sales' },
      { id: 'tldc_dep_hr', name: 'Human Resources' },
      { id: 'tldc_dep_mkt', name: 'Marketing' },
    ],
  },
  {
    id: 'dim_project',
    name: 'Project',
    rosterType: 'STANDARD',
    jobCodes: [
      { id: 'tldc_proj_be', name: 'Backend Services' },
      { id: 'tldc_proj_fe', name: 'Frontend Web' },
      { id: 'tldc_proj_q1', name: 'Q1 Growth Campaign' },
      { id: 'tldc_proj_brand', name: 'Brand Growth Initiative' },
    ],
  },
  {
    id: 'dim_costcenter',
    name: 'Cost Center',
    rosterType: 'STANDARD',
    jobCodes: [
      { id: 'tldc_cc_100', name: 'Engineering (CC-100)' },
      { id: 'tldc_cc_200', name: 'Sales (CC-200)' },
      { id: 'tldc_cc_300', name: 'HR (CC-300)' },
    ],
  },
  {
    id: 'dim_class',
    name: 'Class',
    rosterType: 'STANDARD',
    jobCodes: [
      { id: 'tldc_cls_ft', name: 'Full-time' },
      { id: 'tldc_cls_pt', name: 'Part-time' },
      { id: 'tldc_cls_con', name: 'Contract' },
    ],
  },
];

// ─── Wizard steps ─────────────────────────────────────────────────────────────

const WIZARD_STEPS = [
  { title: 'Template Setup', description: 'Hire type & country' },
  { title: 'Template Details', description: 'Name, attributes & job codes' },
  { title: 'Review', description: 'Confirm and save' },
];

// ─── Styled components ────────────────────────────────────────────────────────

const WizardWrapper = styled.div`
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  padding-bottom: ${({ theme }) => (theme as StyledTheme).space1600};
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
`;

const SectionTitle = styled.h3`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space100} 0;
`;

const SectionDescription = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0;
  line-height: 1.5;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  margin: ${({ theme }) => (theme as StyledTheme).space600} 0;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const FormLabel = styled.label`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => (theme as StyledTheme).colorError};
  margin-left: 2px;
`;

// Step nav
const StepNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => (theme as StyledTheme).space600};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

// Setup option cards
const OptionCardsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const OptionCard = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected
        ? (theme as StyledTheme).colorPrimary
        : (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme, isSelected }) =>
    isSelected
      ? (theme as StyledTheme).colorPrimaryContainer
      : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  text-align: left;
  transition: border-color 100ms ease;
  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const OptionTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  display: block;
  margin-bottom: 2px;
`;

const OptionCaption = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

// Job Codes card (summary in form)
const JobCodesCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

const JobCodesConfiguredSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  margin-top: ${({ theme }) => (theme as StyledTheme).space400};
`;

const PathChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  flex-wrap: wrap;
  padding: ${({ theme }) => (theme as StyledTheme).space200} 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child {
    border-bottom: none;
  }
`;

const PathChip = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
`;

const PathSeparator = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DimChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  flex-wrap: wrap;
`;

const DimChip = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnPrimaryContainer};
  background: ${({ theme }) => (theme as StyledTheme).colorPrimaryContainer};
  padding: ${({ theme }) => (theme as StyledTheme).space100}
    ${({ theme }) => (theme as StyledTheme).space300};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerFull};
`;

// Drawer internals
const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space600};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
`;

const DrawerSectionTitle = styled.h4`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

const DrawerSectionDesc = styled.p`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space400} 0;
  line-height: 1.5;
`;

// Mode selection cards inside drawer
const ModeCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
`;

const ModeCard = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  border: 2px solid
    ${({ theme, isSelected }) =>
      isSelected
        ? (theme as StyledTheme).colorPrimary
        : (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme, isSelected }) =>
    isSelected
      ? (theme as StyledTheme).colorPrimaryContainer
      : (theme as StyledTheme).colorSurfaceBright};
  cursor: pointer;
  text-align: left;
  transition: all 100ms ease;
  &:hover {
    border-color: ${({ theme }) => (theme as StyledTheme).colorPrimary};
  }
`;

const ModeTitle = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const ModeCaption = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.5;
`;

// Structure paths list
const PathList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const PathRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid
    ${({ theme, isSelected }) =>
      isSelected
        ? (theme as StyledTheme).colorOutline
        : (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme, isSelected }) =>
    isSelected ? (theme as StyledTheme).colorSurfaceContainerLow : 'transparent'};
  cursor: pointer;
  transition: all 100ms ease;
  &:hover {
    background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
    border-color: ${({ theme }) => (theme as StyledTheme).colorOutline};
  }
`;

const PathBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme as StyledTheme).space100};
  flex: 1;
`;

const NodeTag = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerHigh};
  padding: 2px ${({ theme }) => (theme as StyledTheme).space200};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerSm};
`;

const Arrow = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const TldcCount = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  white-space: nowrap;
`;

// Arrow-down section divider (matching RosterDrawers.tsx ArrowContainer)
const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

// TLDC rows
const TldcList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const TldcRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
`;

const TldcName = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const TldcId = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2CodeSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
`;

const DimGroupLabel = styled.div`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space200};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LockedNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
`;

const LockedNoteText = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodySmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  line-height: 1.5;
`;

// Locked dimension cards (business-structures auto-applied view)
const LockedDimCard = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  &:last-child {
    margin-bottom: 0;
  }
`;

const LockedDimCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
`;

const LockedDimCardContent = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space200};
`;

const LockedSelectedValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme as StyledTheme).space300}
    ${({ theme }) => (theme as StyledTheme).space400};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  cursor: not-allowed;
`;

// Manual mode dimensions
const DimItemWrapper = styled.div`
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
  overflow: hidden;
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space300};
  &:last-child {
    margin-bottom: 0;
  }
`;

const DimHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  cursor: pointer;
`;

const DimLabel = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  flex: 1;
`;

const DimExpanded = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400};
  border-top: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  background: ${({ theme }) => (theme as StyledTheme).colorSurfaceContainerLow};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
`;

// Review
const ReviewSectionTitle = styled.h4`
  ${({ theme }) => (theme as StyledTheme).typestyleV2TitleSmall};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  margin: 0 0 ${({ theme }) => (theme as StyledTheme).space300} 0;
`;

const ReviewRow = styled.div`
  display: flex;
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  padding: ${({ theme }) => (theme as StyledTheme).space300} 0;
  border-bottom: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewLabelCell = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  width: 160px;
  flex-shrink: 0;
`;

const ReviewValueCell = styled.span`
  ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;

const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme as StyledTheme).space300};
  padding: ${({ theme }) => (theme as StyledTheme).space400}
    ${({ theme }) => (theme as StyledTheme).space600};
  background: ${({ theme }) => (theme as StyledTheme).colorSuccessContainer};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

const EmptyStateWrapper = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space400} 0;
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const JobTemplatesBusinessStructuresDemo: React.FC = () => {
  const { theme } = usePebbleTheme();

  // Wizard step
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 — Setup
  const [hireType, setHireType] = useState<'employee' | 'eor' | 'contractor'>('employee');
  const [country, setCountry] = useState<unknown>('us');

  // Step 2 — Template Details
  const [templateName, setTemplateName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [jobFunction, setJobFunction] = useState<unknown>('');
  const [department, setDepartment] = useState<unknown>('');
  const [level, setLevel] = useState<unknown>('');
  const [location, setLocation] = useState<unknown>('');
  const [flsaStatus, setFlsaStatus] = useState<unknown>('');

  // ── Job Codes Drawer state ────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Draft state inside the drawer (committed to "saved" only on Save)
  const [draftMode, setDraftMode] = useState<EnforceMode>('business-structures');
  const [draftPaths, setDraftPaths] = useState<Set<string>>(new Set());
  const [draftDimensions, setDraftDimensions] = useState<Set<string>>(new Set());
  const [draftDefaultTldcs, setDraftDefaultTldcs] = useState<Record<string, string>>({});

  // Saved (committed) state shown on the card
  const [savedMode, setSavedMode] = useState<EnforceMode | null>(null);
  const [savedPaths, setSavedPaths] = useState<Set<string>>(new Set());
  const [savedDimensions, setSavedDimensions] = useState<Set<string>>(new Set());

  // UI
  const [saved, setSaved] = useState(false);

  // ── Derived: unique nodeTypes from draft paths ────────────────────────────
  const draftNodeTypes = useMemo<string[]>(() => {
    const types = new Set<string>();
    STRUCTURE_PATHS.forEach(p => {
      if (draftPaths.has(p.id)) p.nodes.forEach(n => types.add(n.nodeType));
    });
    return Array.from(types);
  }, [draftPaths]);

  // ── Drawer actions ────────────────────────────────────────────────────────
  const openDrawer = () => {
    // Reset draft to current saved state
    setDraftMode(savedMode ?? 'business-structures');
    setDraftPaths(new Set(savedPaths));
    setDraftDimensions(new Set(savedDimensions));
    setDraftDefaultTldcs({});
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const saveDrawer = () => {
    setSavedMode(draftMode);
    setSavedPaths(new Set(draftPaths));
    setSavedDimensions(new Set(draftDimensions));
    setIsDrawerOpen(false);
  };

  const toggleDraftPath = (id: string) =>
    setDraftPaths(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleDraftDimension = (id: string) =>
    setDraftDimensions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setDraftDefaultTldcs(d => {
          const u = { ...d };
          delete u[id];
          return u;
        });
      } else {
        next.add(id);
      }
      return next;
    });

  const handleDraftModeChange = (mode: EnforceMode) => {
    setDraftMode(mode);
    setDraftPaths(new Set());
    setDraftDimensions(new Set());
    setDraftDefaultTldcs({});
  };

  // Wizard nav
  const goNext = () => setCurrentStep(s => Math.min(s + 1, WIZARD_STEPS.length - 1));
  const goBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const stepperSteps = WIZARD_STEPS.map((s, i) => ({
    title: s.title,
    description: s.description,
    status: i < currentStep ? STEP_STATUS.COMPLETE : undefined,
  }));

  // ── Drawer footer actions ─────────────────────────────────────────────────
  const drawerActions = (
    <HStack gap="0.75rem">
      <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M} onClick={closeDrawer}>
        Cancel
      </Button>
      <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M} onClick={saveDrawer}>
        Save
      </Button>
    </HStack>
  );

  // ─ Step renderers ──────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <StepContent>
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle>How would you like to add this template?</SectionTitle>
        <SectionDescription>
          Choose to add one template manually or bulk-import multiple via CSV.
        </SectionDescription>
        <Divider />
        <OptionCardsCol>
          {[
            {
              id: 'single',
              icon: Icon.TYPES.BRIEFCASE_OUTLINE,
              title: 'Single template',
              caption: 'Fill in a form to create one job template',
            },
            {
              id: 'bulk',
              icon: Icon.TYPES.COPY_OUTLINE,
              title: 'Bulk import (CSV)',
              caption: 'Upload a spreadsheet to create multiple templates at once',
            },
          ].map(opt => (
            <OptionCard key={opt.id} isSelected={opt.id === 'single'} type="button">
              <Icon
                type={opt.icon}
                size={20}
                color={opt.id === 'single' ? theme.colorPrimary : theme.colorOnSurfaceVariant}
              />
              <div>
                <OptionTitle>{opt.title}</OptionTitle>
                <OptionCaption>{opt.caption}</OptionCaption>
              </div>
            </OptionCard>
          ))}
        </OptionCardsCol>
      </Card.Layout>

      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle>Employment type</SectionTitle>
        <SectionDescription>
          Select the employment classification for this template.
        </SectionDescription>
        <Divider />
        <OptionCardsCol>
          {[
            { id: 'employee', title: 'Employee', caption: 'W-2 employee in your Rippling company' },
            { id: 'eor', title: 'EOR Employee', caption: 'Employee of Record via Rippling Global' },
            {
              id: 'contractor',
              title: 'Contractor',
              caption: 'Independent contractor or freelancer',
            },
          ].map(opt => (
            <OptionCard
              key={opt.id}
              isSelected={hireType === opt.id}
              onClick={() => setHireType(opt.id as typeof hireType)}
              type="button"
            >
              <div>
                <OptionTitle>{opt.title}</OptionTitle>
                <OptionCaption>{opt.caption}</OptionCaption>
              </div>
            </OptionCard>
          ))}
        </OptionCardsCol>
        <div style={{ marginTop: theme.space600 }}>
          <FormField>
            <FormLabel>
              Country<RequiredMark>*</RequiredMark>
            </FormLabel>
            <Input.Select
              list={[
                { label: 'United States', value: 'us' },
                { label: 'United Kingdom', value: 'gb' },
                { label: 'Canada', value: 'ca' },
                { label: 'India', value: 'in' },
              ]}
              value={country}
              onChange={v => setCountry(v)}
            />
          </FormField>
        </div>
      </Card.Layout>

      <StepNav>
        <span />
        <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M} onClick={goNext}>
          Continue
          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} />
        </Button>
      </StepNav>
    </StepContent>
  );

  const renderStep2 = () => (
    <StepContent>
      {/* Template Details form */}
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <SectionTitle>Template details</SectionTitle>
        <SectionDescription>
          Name and role attributes — matches the census fields in the{' '}
          <strong>jobTemplateAdd</strong> flow.
        </SectionDescription>
        <Divider />
        <FieldGroup>
          <TwoCol>
            <FormField>
              <FormLabel>
                Template name<RequiredMark>*</RequiredMark>
              </FormLabel>
              <Input.Text
                value={templateName}
                onChange={setTemplateName}
                size={Input.Text.SIZES.M}
                placeholder="e.g., Software Engineer — SF"
              />
            </FormField>
            <FormField>
              <FormLabel>Reference code</FormLabel>
              <Input.Text
                value={referralCode}
                onChange={setReferralCode}
                size={Input.Text.SIZES.M}
                placeholder="Optional"
              />
            </FormField>
          </TwoCol>
          <TwoCol>
            <FormField>
              <FormLabel>Job function</FormLabel>
              <Input.Select
                list={[
                  { label: 'Engineering', value: 'eng' },
                  { label: 'Sales', value: 'sales' },
                  { label: 'Marketing', value: 'mkt' },
                  { label: 'Operations', value: 'ops' },
                ]}
                value={jobFunction}
                onChange={setJobFunction}
              />
            </FormField>
            <FormField>
              <FormLabel>Department</FormLabel>
              <Input.Select
                list={[
                  { label: 'Engineering', value: 'eng' },
                  { label: 'Product', value: 'product' },
                  { label: 'Sales', value: 'sales' },
                  { label: 'HR', value: 'hr' },
                ]}
                value={department}
                onChange={setDepartment}
              />
            </FormField>
          </TwoCol>
          <TwoCol>
            <FormField>
              <FormLabel>Level</FormLabel>
              <Input.Select
                list={[
                  { label: 'IC1 — Associate', value: 'ic1' },
                  { label: 'IC2 — Mid', value: 'ic2' },
                  { label: 'IC3 — Senior', value: 'ic3' },
                  { label: 'M1 — Manager', value: 'm1' },
                ]}
                value={level}
                onChange={setLevel}
              />
            </FormField>
            <FormField>
              <FormLabel>Work location</FormLabel>
              <Input.Select
                list={[
                  { label: 'San Francisco, CA', value: 'sf' },
                  { label: 'New York, NY', value: 'ny' },
                  { label: 'Austin, TX', value: 'atx' },
                  { label: 'Remote', value: 'remote' },
                ]}
                value={location}
                onChange={setLocation}
              />
            </FormField>
          </TwoCol>
          <FormField>
            <FormLabel>FLSA status</FormLabel>
            <Input.Select
              list={[
                { label: 'Exempt', value: 'exempt' },
                { label: 'Non-exempt', value: 'non_exempt' },
              ]}
              value={flsaStatus}
              onChange={setFlsaStatus}
            />
          </FormField>
        </FieldGroup>
      </Card.Layout>

      {/* ── Job Codes card — the new section (opens Drawer) ─────────────── */}
      <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
        <JobCodesCardHeader>
          <div>
            <SectionTitle>Job codes</SectionTitle>
            <SectionDescription>
              Configure which job codes (TLDCs) apply to employees on this template.
            </SectionDescription>
          </div>
          {savedMode !== null && (
            <Button.Icon
              icon={Icon.TYPES.EDIT_OUTLINE}
              aria-label="Edit job codes"
              appearance={Button.APPEARANCES.GHOST}
              size={Button.SIZES.S}
              onClick={openDrawer}
            />
          )}
        </JobCodesCardHeader>

        {savedMode === null ? (
          <div style={{ marginTop: theme.space400 }}>
            <ActionCard
              icon={Icon.TYPES.BRIEFCASE_OUTLINE}
              title="No job codes configured"
              caption="Configure whether to enforce business structures or manually assign job dimensions for this template."
              primaryAction={{ title: 'Configure Job Codes', onClick: openDrawer }}
            />
          </div>
        ) : (
          <JobCodesConfiguredSummary>
            <HStack gap="0.5rem" align="center">
              <Label appearance={Label.APPEARANCES.INFO} size={Label.SIZES.M}>
                {savedMode === 'business-structures' ? 'Business Structures' : 'Custom Selection'}
              </Label>
              {savedMode === 'business-structures' && (
                <Label appearance={Label.APPEARANCES.NEUTRAL} size={Label.SIZES.M}>
                  {`${savedPaths.size} path${savedPaths.size !== 1 ? 's' : ''} selected`}
                </Label>
              )}
              {savedMode === 'manual' && (
                <Label appearance={Label.APPEARANCES.NEUTRAL} size={Label.SIZES.M}>
                  {`${savedDimensions.size} dimension${savedDimensions.size !== 1 ? 's' : ''} selected`}
                </Label>
              )}
            </HStack>

            {savedMode === 'business-structures' && savedPaths.size > 0 && (
              <div>
                {STRUCTURE_PATHS.filter(p => savedPaths.has(p.id)).map(p => (
                  <PathChipRow key={p.id}>
                    {p.nodes.map((n, i) => (
                      <React.Fragment key={n.nodeType}>
                        {i > 0 && <PathSeparator>→</PathSeparator>}
                        <PathChip>{n.label}</PathChip>
                      </React.Fragment>
                    ))}
                  </PathChipRow>
                ))}
              </div>
            )}

            {savedMode === 'manual' && savedDimensions.size > 0 && (
              <DimChipRow>
                {JOB_DIMENSIONS.filter(d => savedDimensions.has(d.id)).map(d => (
                  <DimChip key={d.id}>{d.name}</DimChip>
                ))}
              </DimChipRow>
            )}
          </JobCodesConfiguredSummary>
        )}
      </Card.Layout>

      <StepNav>
        <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M} onClick={goBack}>
          <Icon type={Icon.TYPES.CHEVRON_LEFT} size={16} />
          Back
        </Button>
        <Button appearance={Button.APPEARANCES.PRIMARY} size={Button.SIZES.M} onClick={goNext}>
          Review
          <Icon type={Icon.TYPES.CHEVRON_RIGHT} size={16} />
        </Button>
      </StepNav>
    </StepContent>
  );

  const renderStep3 = () => {
    const hireLabels = { employee: 'Employee', eor: 'EOR Employee', contractor: 'Contractor' };
    return (
      <StepContent>
        {saved && (
          <SuccessBanner>
            <Icon type={Icon.TYPES.CHECK_CIRCLE_FILLED} size={20} color={theme.colorSuccess} />
            <span style={{ color: theme.colorOnSurface }}>Job template saved successfully.</span>
          </SuccessBanner>
        )}

        <Card.Layout padding={Card.Layout.PADDINGS.PX_24}>
          <SectionTitle>Review job template</SectionTitle>
          <SectionDescription>Confirm the details below before saving.</SectionDescription>
          <Divider />

          <ReviewSectionTitle>Template Setup</ReviewSectionTitle>
          <ReviewRow>
            <ReviewLabelCell>Employment type</ReviewLabelCell>
            <ReviewValueCell>{hireLabels[hireType]}</ReviewValueCell>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabelCell>Country</ReviewLabelCell>
            <ReviewValueCell>United States</ReviewValueCell>
          </ReviewRow>

          <div style={{ marginTop: theme.space600 }}>
            <ReviewSectionTitle>Template Details</ReviewSectionTitle>
            <ReviewRow>
              <ReviewLabelCell>Template name</ReviewLabelCell>
              <ReviewValueCell>
                {templateName || <em style={{ color: theme.colorOnSurfaceVariant }}>Not set</em>}
              </ReviewValueCell>
            </ReviewRow>
            <ReviewRow>
              <ReviewLabelCell>Reference code</ReviewLabelCell>
              <ReviewValueCell>{referralCode || '—'}</ReviewValueCell>
            </ReviewRow>
          </div>

          <div style={{ marginTop: theme.space600 }}>
            <ReviewSectionTitle>Job Codes</ReviewSectionTitle>
            <ReviewRow>
              <ReviewLabelCell>Mode</ReviewLabelCell>
              <ReviewValueCell>
                {savedMode === null ? (
                  <em style={{ color: theme.colorOnSurfaceVariant }}>Not configured</em>
                ) : savedMode === 'business-structures' ? (
                  'Business Structures enforced'
                ) : (
                  'Custom selection'
                )}
              </ReviewValueCell>
            </ReviewRow>
            {savedMode === 'business-structures' && savedPaths.size > 0 && (
              <ReviewRow>
                <ReviewLabelCell>Paths</ReviewLabelCell>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space200 }}>
                  {STRUCTURE_PATHS.filter(p => savedPaths.has(p.id)).map(p => (
                    <PathBreadcrumb key={p.id}>
                      {p.nodes.map((n, i) => (
                        <React.Fragment key={n.nodeType}>
                          {i > 0 && <Arrow>→</Arrow>}
                          <NodeTag>{n.label}</NodeTag>
                        </React.Fragment>
                      ))}
                    </PathBreadcrumb>
                  ))}
                </div>
              </ReviewRow>
            )}
            {savedMode === 'manual' && savedDimensions.size > 0 && (
              <ReviewRow>
                <ReviewLabelCell>Dimensions</ReviewLabelCell>
                <DimChipRow>
                  {JOB_DIMENSIONS.filter(d => savedDimensions.has(d.id)).map(d => (
                    <DimChip key={d.id}>{d.name}</DimChip>
                  ))}
                </DimChipRow>
              </ReviewRow>
            )}
          </div>
        </Card.Layout>

        <StepNav>
          <Button appearance={Button.APPEARANCES.OUTLINE} size={Button.SIZES.M} onClick={goBack}>
            <Icon type={Icon.TYPES.CHEVRON_LEFT} size={16} />
            Back
          </Button>
          <Button
            appearance={Button.APPEARANCES.PRIMARY}
            size={Button.SIZES.M}
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3500);
            }}
          >
            Save Template
          </Button>
        </StepNav>
      </StepContent>
    );
  };

  const stepRenderers = [renderStep1, renderStep2, renderStep3];

  return (
    <AppShellLayout
      pageTitle="Create Job Template"
      pageActions={
        <Button appearance={Button.APPEARANCES.GHOST} size={Button.SIZES.M}>
          Cancel
        </Button>
      }
      companyName="Acme, Inc."
      userInitial="A"
      defaultAdminMode
    >
      <WizardWrapper>
        {/* Rippling stepper */}
        <Stepper steps={stepperSteps} activeStepIndex={currentStep} />

        {/* Active step */}
        {stepRenderers[currentStep]()}
      </WizardWrapper>

      {/* ── Job Codes Configuration Drawer ────────────────────────────────────
          Matches ProfileBusinessStructure/RosterDrawers.tsx pattern:
            1. Mode toggle (Enforce Business Structures | Custom)
            2a. If BS: Path selector → ↓ arrow → auto-applied TLDCs (locked)
            2b. If manual: dimension-by-dimension TLDC picker
      ──────────────────────────────────────────────────────────────────────── */}
      <Drawer
        isVisible={isDrawerOpen}
        onCancel={closeDrawer}
        title="Configure Job Codes"
        width={600}
        actionsJsx={drawerActions}
      >
        <DrawerBody>
          {/* Mode selection */}
          <div>
            <DrawerSectionTitle>Job code assignment mode</DrawerSectionTitle>
            <DrawerSectionDesc>
              Choose how job codes are assigned for employees on this template.
            </DrawerSectionDesc>
            <ModeCardsGrid>
              <ModeCard
                isSelected={draftMode === 'business-structures'}
                onClick={() => handleDraftModeChange('business-structures')}
                type="button"
              >
                <Icon
                  type={Icon.TYPES.BUDGET_HIERARCHY_OUTLINE}
                  size={22}
                  color={
                    draftMode === 'business-structures'
                      ? theme.colorPrimary
                      : theme.colorOnSurfaceVariant
                  }
                />
                <ModeTitle>Enforce Business Structures</ModeTitle>
                <ModeCaption>
                  Select structure paths — job codes are auto-applied and locked.
                </ModeCaption>
              </ModeCard>
              <ModeCard
                isSelected={draftMode === 'manual'}
                onClick={() => handleDraftModeChange('manual')}
                type="button"
              >
                <Icon
                  type={Icon.TYPES.BRIEFCASE_OUTLINE}
                  size={22}
                  color={draftMode === 'manual' ? theme.colorPrimary : theme.colorOnSurfaceVariant}
                />
                <ModeTitle>Custom Selection</ModeTitle>
                <ModeCaption>
                  Manually pick job dimensions and set a default TLDC for each.
                </ModeCaption>
              </ModeCard>
            </ModeCardsGrid>
          </div>

          {/* ── Business structures mode ─────────────────────────────────── */}
          {draftMode === 'business-structures' && (
            <>
              {/* Path selector — matches Roster Drawer */}
              <div>
                <DrawerSectionTitle>Structure paths</DrawerSectionTitle>
                <DrawerSectionDesc>
                  Select one or more paths. Job codes and dimensions are auto-applied based on your
                  selection and cannot be edited manually.
                </DrawerSectionDesc>
                <PathList>
                  {STRUCTURE_PATHS.map(path => (
                    <PathRow
                      key={path.id}
                      isSelected={draftPaths.has(path.id)}
                      onClick={() => toggleDraftPath(path.id)}
                    >
                      <Input.Checkbox
                        name={`path-${path.id}`}
                        label=""
                        value={draftPaths.has(path.id)}
                        onChange={() => toggleDraftPath(path.id)}
                      />
                      <PathBreadcrumb>
                        {path.nodes.map((n, i) => (
                          <React.Fragment key={n.nodeType}>
                            {i > 0 && <Arrow>→</Arrow>}
                            <NodeTag>{n.label}</NodeTag>
                          </React.Fragment>
                        ))}
                      </PathBreadcrumb>
                      <TldcCount>{path.tldcItems.length} codes</TldcCount>
                    </PathRow>
                  ))}
                </PathList>
              </div>

              {/* ↓ Arrow divider — matches ArrowContainer in RosterDrawers.tsx */}
              {draftPaths.size > 0 && (
                <ArrowContainer>
                  <Icon
                    type={Icon.TYPES.ARROW_DOWN}
                    size={24}
                    color={theme.colorOnSurfaceVariant}
                  />
                </ArrowContainer>
              )}

              {/* Auto-applied job codes — one locked dimension card per nodeType */}
              {draftPaths.size > 0 && (
                <div>
                  <DrawerSectionTitle>Applied job codes</DrawerSectionTitle>
                  <LockedNote>
                    <Icon
                      type={Icon.TYPES.LOCK_FILLED}
                      size={16}
                      color={theme.colorOnSurfaceVariant}
                    />
                    <LockedNoteText>
                      These job dimensions are auto-selected from your chosen structure paths and
                      cannot be edited. Modify the path selection above to change them.
                    </LockedNoteText>
                  </LockedNote>

                  {/* One card per dimension nodeType (e.g. Location, Department, Project) */}
                  {draftNodeTypes.map(nodeType => {
                    // Deduplicate nodes by tldcId and use the node's own label directly
                    const selectedNodes = STRUCTURE_PATHS.filter(p => draftPaths.has(p.id)).flatMap(
                      p => p.nodes.filter(n => n.nodeType === nodeType),
                    );
                    const seen = new Set<string>();
                    const uniqueNodes = selectedNodes.filter(n => {
                      if (seen.has(n.tldcId)) return false;
                      seen.add(n.tldcId);
                      return true;
                    });
                    if (uniqueNodes.length === 0) return null;
                    return (
                      <LockedDimCard key={nodeType}>
                        <LockedDimCardHeader>
                          <Icon
                            type={Icon.TYPES.LOCK_FILLED}
                            size={16}
                            color={theme.colorOnSurfaceVariant}
                          />
                          <DimLabel>{BS_NODE_TYPE_LABELS[nodeType] ?? nodeType}</DimLabel>
                          <Label appearance={Label.APPEARANCES.INFO} size={Label.SIZES.S}>
                            Auto-selected
                          </Label>
                        </LockedDimCardHeader>
                        <LockedDimCardContent>
                          {uniqueNodes.map(n => (
                            <LockedSelectedValue key={n.tldcId}>
                              <span>{n.label}</span>
                              <Icon
                                type={Icon.TYPES.LOCK_OUTLINE}
                                size={14}
                                color={theme.colorOnSurfaceVariant}
                              />
                            </LockedSelectedValue>
                          ))}
                        </LockedDimCardContent>
                      </LockedDimCard>
                    );
                  })}
                </div>
              )}

              {draftPaths.size === 0 && (
                <EmptyStateWrapper>
                  <ActionCard
                    icon={Icon.TYPES.BUDGET_HIERARCHY_OUTLINE}
                    title="No paths selected"
                    caption="Select one or more structure paths above to auto-apply job codes."
                  />
                </EmptyStateWrapper>
              )}
            </>
          )}

          {/* ── Manual / custom mode ──────────────────────────────────────── */}
          {draftMode === 'manual' && (
            <div>
              <DrawerSectionTitle>Job dimensions</DrawerSectionTitle>
              <DrawerSectionDesc>
                Select the dimensions that apply to this template. Expand each to choose a default
                TLDC.
              </DrawerSectionDesc>
              {JOB_DIMENSIONS.map(dim => {
                const isOpen = draftDimensions.has(dim.id);
                return (
                  <DimItemWrapper key={dim.id}>
                    <DimHeader onClick={() => toggleDraftDimension(dim.id)}>
                      <Input.Checkbox
                        name={`dim-${dim.id}`}
                        label=""
                        value={isOpen}
                        onChange={() => toggleDraftDimension(dim.id)}
                      />
                      <DimLabel>{dim.name}</DimLabel>
                      <TldcCount>{dim.jobCodes.length} TLDCs</TldcCount>
                      <Icon
                        type={isOpen ? Icon.TYPES.CHEVRON_UP : Icon.TYPES.CHEVRON_DOWN}
                        size={16}
                        color={theme.colorOnSurfaceVariant}
                      />
                    </DimHeader>
                    {isOpen && (
                      <DimExpanded>
                        <FormField>
                          <FormLabel>Default TLDC for {dim.name}</FormLabel>
                          <Input.Select
                            list={dim.jobCodes.map(jc => ({
                              label: `${jc.name} (${jc.id})`,
                              value: jc.id,
                            }))}
                            value={draftDefaultTldcs[dim.id]}
                            onChange={v =>
                              setDraftDefaultTldcs(prev => ({ ...prev, [dim.id]: v as string }))
                            }
                          />
                        </FormField>
                        <div>
                          <DimGroupLabel>All available TLDCs</DimGroupLabel>
                          <TldcList>
                            {dim.jobCodes.map(jc => (
                              <TldcRow key={jc.id}>
                                <TldcName>{jc.name}</TldcName>
                                <TldcId>{jc.id}</TldcId>
                              </TldcRow>
                            ))}
                          </TldcList>
                        </div>
                      </DimExpanded>
                    )}
                  </DimItemWrapper>
                );
              })}
            </div>
          )}
        </DrawerBody>
      </Drawer>
    </AppShellLayout>
  );
};

export default JobTemplatesBusinessStructuresDemo;
