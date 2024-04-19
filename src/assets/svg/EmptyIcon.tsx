import * as React from 'react';

import Svg, {Circle, Ellipse, Path, SvgProps} from 'react-native-svg';
export const EmptyIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 81}
    height={props.height ?? 167}
    viewBox="0 0 81 167"
    fill="none"
    {...props}>
    <Path
      d="M15.276 144.755L1.2893 35.7545C1.15451 34.7041 1.08711 34.1788 1.38576 33.8394C1.68441 33.5 2.21395 33.5 3.27303 33.5H77.2069C78.2744 33.5 78.8082 33.5 79.1071 33.8427C79.406 34.1854 79.3335 34.7142 79.1884 35.7717V35.7718L64.2371 144.772C64.1241 145.595 64.0676 146.007 63.7851 146.254C63.5026 146.5 63.087 146.5 62.2556 146.5H17.2598C16.4216 146.5 16.0026 146.5 15.7193 146.251C15.436 146.002 15.3827 145.586 15.276 144.755Z"
      stroke="#009655"
      strokeWidth={2}
    />
    <Path
      d="M17.2219 60.2022C18.5787 55.287 21.7147 53.5078 25.7762 52.7978"
      stroke="#009655"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M62.7761 60.2022C61.4194 55.287 58.2834 53.5078 54.2219 52.7978"
      stroke="#009655"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={24.5} cy={59.5} r={1.5} fill="#009655" />
    <Circle cx={55.5} cy={59.5} r={1.5} fill="#009655" />
    <Path
      d="M25 90.4999C35 84 45 84 55 90.4999"
      stroke="#009655"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M35 92.7062C38.6667 90.3229 42.3333 90.3229 46 92.7062"
      stroke="#009655"
      strokeWidth={0.752624}
      strokeLinecap="round"
    />
    <Path
      d="M80 1.5L68 10.5L63 33.5"
      stroke="#009655"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Ellipse cx={42} cy={164} rx={19} ry={3} fill="#E5F9EE" />
  </Svg>
);
