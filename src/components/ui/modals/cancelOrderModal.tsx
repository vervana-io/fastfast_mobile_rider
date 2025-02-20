import {
  Button,
  Center,
  CheckIcon,
  HStack,
  Modal,
  Text,
  WarningIcon,
} from 'native-base';
import React, {useEffect} from 'react';

export interface notificationContentType {
  title: string;
  content: any;
}

interface CancelOrderModalProps {
  show: boolean;
  hasClose?: any;
  order_id: number;
}

export const CancelOrderModal = (props: CancelOrderModalProps) => {
  const {show, hasClose, order_id} = props;
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (show) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [show]);

  useEffect(() => {
    // if (!modalVisible && hasClose) {
    //   hasClose(true);
    // }
  }, [hasClose, modalVisible]);

  const closeModal = () => {
    if (hasClose) {
      hasClose(true);
      setModalVisible(false);
    }
  };

  return (
    <Modal isOpen={modalVisible} onClose={closeModal}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Body>
          <Center pb={4}>
            <Text fontWeight="bold" fontSize="md">
              Cancel Order
            </Text>
            <Text
              textAlign="center"
              fontWeight="bold"
              fontSize="xs"
              mt={2}
              color="themeLight.gray.2">
              Would you like to cancel this ongoing order?
            </Text>
            <HStack space={2} mt={6}>
              <Button size="xs" _text={{fontSize: 'xs', fontWeight: 'bold'}}>
                Continue
              </Button>
              <Button
                bg="themeLight.error"
                size="xs"
                _text={{fontSize: 'xs', fontWeight: 'bold'}}>
                Cancel
              </Button>
            </HStack>
            <Text
              textAlign="center"
              fontWeight="bold"
              fontSize="xs"
              mt={2}
              color="themeLight.gray.2">
              You could wait for an admin to reach out to you first.
            </Text>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
