import {useCallback, useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';

export const useSheet = () => {
  const [show, setshow] = useState<boolean>(false);
  const sheetRef = useRef<Modalize>(null);

  const openSheet = () => {
    setshow(true);
    sheetRef.current?.open();
  };
  const closeSheet = () => {
    sheetRef.current?.close();
    setshow(false);
  };

  const handleClose = useCallback(() => {
    setshow(false);
  }, []);

  return {
    sheetRef,
    openSheet,
    closeSheet,
    show,
    handleClose,
  };
};
