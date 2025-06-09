import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const TablerIcon = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 18.5L9 17m0 0l-6 3V7l6-3m0 13V4m0 0l6 3m0 0l6-3v8.5M15 7v7.5m4 7.5v-6m0 0l3 3m-3-3l-3 3"
      stroke="#009655"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default TablerIcon;
