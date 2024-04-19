import * as React from 'react';

import Svg, {Path, Rect, SvgProps} from 'react-native-svg';
export const IDCard = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Rect
      x={0.900391}
      y={4.5}
      width={22.2}
      height={15}
      rx={1}
      stroke="#757575"
      strokeWidth={1.2}
    />
    <Path
      d="M17.0996 7.5H20.0996"
      stroke="#757575"
      strokeWidth={1.2}
      strokeLinecap="round"
    />
    <Path
      d="M14.0996 10.5H20.0996"
      stroke="#757575"
      strokeWidth={1.2}
      strokeLinecap="round"
    />
    <Path
      d="M12.5996 16.5H20.0996"
      stroke="#757575"
      strokeWidth={1.2}
      strokeLinecap="round"
    />
    <Rect
      x={3.90039}
      y={7.5}
      width={6}
      height={6}
      rx={1}
      stroke="#757575"
      strokeWidth={1.2}
    />
  </Svg>
);
