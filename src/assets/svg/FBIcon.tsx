import * as React from 'react';

import Svg, {ClipPath, Defs, G, Path, Rect, SvgProps} from 'react-native-svg';
export const FBIcon = (props: SvgProps) => (
  <Svg
    width={props.width ?? 25}
    height={props.height ?? 25}
    viewBox="0 0 25 25"
    fill="none"
    {...props}>
    <G clipPath="url(#clip0_534_14344)">
      <Path
        d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z"
        fill="#3C5A9A"
      />
      <Path
        d="M16.563 3.83691H13.7939C12.1507 3.83691 10.3229 4.52804 10.3229 6.91C10.3309 7.73997 10.3229 8.53483 10.3229 9.4294H8.42188V12.4545H10.3817V21.1632H13.983V12.397H16.36L16.5751 9.42091H13.921C13.921 9.42091 13.9269 8.09702 13.921 7.71255C13.921 6.77125 14.9004 6.82516 14.9594 6.82516C15.4254 6.82516 16.3317 6.82651 16.5643 6.82516V3.83691H16.563Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_534_14344">
        <Rect width={25} height={25} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
