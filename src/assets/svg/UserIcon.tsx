import * as React from 'react';

import Svg, {Path, Rect, SvgProps} from 'react-native-svg';
export const UserIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Rect
      x={7.5}
      y={1.5}
      width={9}
      height={9}
      rx={4.5}
      stroke="#2B2F2D"
      strokeWidth={1.2}
    />
    <Path
      d="M22.2454 20.5213C22.5251 21.5899 21.6066 22.5 20.502 22.5C18.5936 22.5 15.4964 22.5 12 22.5C8.50363 22.5 5.40639 22.5 3.498 22.5C2.39343 22.5 1.47489 21.5899 1.75457 20.5213C2.80639 16.5026 6.9941 13.5 12 13.5C17.0059 13.5 21.1936 16.5026 22.2454 20.5213Z"
      stroke="#2B2F2D"
      strokeWidth={1.2}
    />
  </Svg>
);
