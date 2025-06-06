import {StyleSheet} from 'react-native';
import {AlignTypes, JustifyContentType} from '../../../new-types/styles';

export const appRowStyles = ({
  alignItems,
  columnGap,
  justifyContent = 'space-between',
}: {
  alignItems?: AlignTypes;
  columnGap: number;
  justifyContent?: JustifyContentType;
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent,
      columnGap: columnGap,
      alignItems,
    },
  });
