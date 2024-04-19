import * as React from 'react';

import Svg, {Path, SvgProps} from 'react-native-svg';
export const ExchangeIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M17.2793 10.4498L20.9993 6.72974L17.2793 3.00977"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 6.72949H21"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.71997 13.5498L3 17.2698L6.71997 20.9898"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 17.2695H3"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
