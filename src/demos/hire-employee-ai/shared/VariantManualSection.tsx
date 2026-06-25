import React, { useState } from 'react';
import { usePebbleTheme } from '@/utils/theme';
import Icon from '@rippling/pebble/Icon';
import {
  ManualCard,
  ManualCardTitle,
  ManualOrDivider,
  ManualOrLine,
  ManualOrText,
  ManualRadioRow,
} from '../styles';

export const VariantManualSection: React.FC = () => {
  const { theme } = usePebbleTheme();
  const [selection, setSelection] = useState('individual');

  return (
    <>
      <ManualOrDivider theme={theme}>
        <ManualOrLine theme={theme} />
        <ManualOrText>OR fill in manually</ManualOrText>
        <ManualOrLine theme={theme} />
      </ManualOrDivider>

      <ManualCard theme={theme}>
        <ManualCardTitle theme={theme}>
          <Icon type={Icon.TYPES.DOCUMENT_OUTLINE} size={16} />
          Fill in details yourself
        </ManualCardTitle>
        <ManualRadioRow theme={theme}>
          <input
            type="radio"
            name="hireType"
            value="individual"
            checked={selection === 'individual'}
            onChange={() => setSelection('individual')}
          />
          An individual
        </ManualRadioRow>
        <ManualRadioRow theme={theme}>
          <input
            type="radio"
            name="hireType"
            value="multiple"
            checked={selection === 'multiple'}
            onChange={() => setSelection('multiple')}
          />
          Multiple people
        </ManualRadioRow>
      </ManualCard>
    </>
  );
};
