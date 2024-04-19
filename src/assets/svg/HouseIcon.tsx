import * as React from 'react';

import Svg, {Path, SvgProps} from 'react-native-svg';
export const HouseIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M2 22H22"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.94922 22.0003L2.99922 9.97023C2.99922 9.36023 3.28922 8.78029 3.76922 8.40029L10.7692 2.95027C11.4892 2.39027 12.4992 2.39027 13.2292 2.95027L20.2292 8.39028C20.7192 8.77028 20.9992 9.35023 20.9992 9.97023V22.0003"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinejoin="round"
    />
    <Path
      d="M15.5 11H8.5C7.67 11 7 11.67 7 12.5V22H17V12.5C17 11.67 16.33 11 15.5 11Z"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 16.25V17.75"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.5 7.5H13.5"
      stroke="#2B2F2D"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
