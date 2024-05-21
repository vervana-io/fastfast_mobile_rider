import {Alert, CloseIcon, HStack, IconButton, Text, VStack} from 'native-base';

import React from 'react';
import {VariantType} from 'native-base/lib/typescript/components/types';

export interface AlertsProps {
  status: 'info' | 'warning' | 'success' | 'error' | (string & {});
  title: string;
  variant?: VariantType<'Alert'>;
}

export const Alerts = (props: AlertsProps) => {
  const {status, title, variant} = props;
  return (
    <Alert w="100%" status={status} variant={variant}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" />}
            _icon={{
              color: 'coolGray.600',
            }}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};
