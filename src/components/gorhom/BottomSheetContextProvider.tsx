import React, {createContext, useContext, useState} from 'react';
const BottomSheetContext = createContext(null);

function BottomSheetContextProvider({children}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [bottomSheetChildren, setBottomSheetChildren] = useState(false);

  return (
    <BottomSheetContext.Provider
      value={{isOpen, setIsOpen, bottomSheetChildren, setBottomSheetChildren}}>
      {children}
    </BottomSheetContext.Provider>
  );
}

function useBottomSheetContext() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error(
      'useBottomSheetContext must be used within a BottomSheetContextProvider',
    );
  }
  return context;
}

export {BottomSheetContextProvider, useBottomSheetContext};
