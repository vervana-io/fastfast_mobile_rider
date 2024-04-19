import * as React from 'react';

import Svg, {Path, SvgProps} from 'react-native-svg';
export const TimeIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 28}
    height={props.height ?? 28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}>
    <Path
      d="M14.0013 27.3327C21.3651 27.3327 27.3346 21.3631 27.3346 13.9993C27.3346 6.63555 21.3651 0.666016 14.0013 0.666016C6.63751 0.666016 0.667969 6.63555 0.667969 13.9993C0.667969 21.3631 6.63751 27.3327 14.0013 27.3327Z"
      fill="#D7D8DD"
    />
    <Path
      d="M14.002 5.66602V13.5827C14.002 13.8127 14.1886 13.9993 14.4186 13.9993H19.002"
      stroke="#009655"
      strokeWidth={1.66667}
      strokeLinecap="round"
    />
  </Svg>
);
