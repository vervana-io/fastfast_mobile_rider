import * as React from 'react';

import Svg, {Path, SvgProps} from 'react-native-svg';

export const StarIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 17}
    height={props.height ?? 16}
    viewBox="0 0 17 16"
    fill="none"
    {...props}>
    <Path
      d="M3.49321 16L4.80581 10.0827L0.441406 6.10441L6.1904 5.58096L8.44194 0L10.6935 5.57984L16.4414 6.1033L12.0781 10.0816L13.3907 15.9989L8.44194 12.8581L3.49321 16Z"
      fill={props.fill ?? '#F2AC57'}
    />
  </Svg>
);
