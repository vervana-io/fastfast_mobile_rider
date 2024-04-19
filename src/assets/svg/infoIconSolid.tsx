import * as React from 'react';

import Svg, {ClipPath, Defs, G, Path, Rect, SvgProps} from 'react-native-svg';

export const InfoIconSolid = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <G id="Info" clipPath="url(#clip0_1972_5465)">
      <Path
        id="Vector"
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
        fill={props.fill ?? '#FFD21E'}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_1972_5465">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
