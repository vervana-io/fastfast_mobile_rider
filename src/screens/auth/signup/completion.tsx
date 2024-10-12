import {Box, Button, Center, CheckIcon, Heading, Text} from 'native-base';

import {Pattern} from '@assets/svg/Pattern';
import React from 'react';

interface Step3Props {
  navigation?: any;
}

export const Completion = (props: Step3Props) => {
  const {navigation} = props;

  return (
    <Box flex={1} p={6}>
      <Box position="absolute" top={0} w="full" left={0} zIndex={1}>
        <Pattern />
      </Box>
      <Center my={48}>
        <Center
          w="104px"
          h="104px"
          my={6}
          borderWidth={5}
          rounded="full"
          borderColor="themeLight.primary.base">
          <CheckIcon size="10" color="themeLight.primary.base" />
        </Center>
        <Heading mb={4}>Success</Heading>
        <Text mt={2}>Your account has been created successfully</Text>
      </Center>
      <Button
        bg="themeLight.accent"
        _text={{fontWeight: 'bold'}}
        w="full"
        py={4}
        my={8}
        onPress={() => navigation.replace('App')}
        rounded="full">
        Proceed
      </Button>
    </Box>
  );
};
