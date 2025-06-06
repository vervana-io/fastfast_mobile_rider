import { ReactNode, Ref } from "react";
import { ViewStyle } from "react-native";
import { Modalize, ModalizeProps } from "react-native-modalize";

export type HmSheetTypes = {
  enableSlideToClose?: boolean;
  disableBackDrop?: boolean;
  sheetRef: ModalizeSheetRef;
  onBackPress?: () => void;
  onPressButton?: () => void;
  modalStyle?: ViewStyle;
  children: ReactNode;
  snapHeight?: number;
  showButton?: boolean;
  useButtonText?: boolean;
  buttonTitle?: string;
  portal?: boolean;
  topContent?: ReactNode;
  contentHeight?: number;
} & Omit<ModalizeProps, "children">;

export type ModalizeSheetRef = Ref<Modalize>;

export type BaseSheetProps = {
  closeSheet?: () => void;
  sheetRef?: ModalizeSheetRef;
  showSheet?: boolean;
};
