'use client';

import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

const KIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* KB Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Liberation Sans, sans-serif"
      >
        KB
      </text>
    </SvgIcon>
  );
};

export default KIcon;
