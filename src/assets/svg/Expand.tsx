import * as React from 'react';

import Svg, {Path, SvgProps} from 'react-native-svg';
export const ExpandIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 20}
    height={props.height ?? 20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}>
    <Path
      d="M6.625 6.625L1 1M1 1V5.5M1 1H5.5M13.375 6.625L19 1M19 1V5.5M19 1H14.5M6.625 13.375L1 19M1 19V14.5M1 19H5.5M13.375 13.375L19 19M19 19V14.5M19 19H14.5"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
