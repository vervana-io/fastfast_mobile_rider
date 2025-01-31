import {Box, Button, Center, CheckIcon, Heading, Text} from 'native-base';
import React, { useEffect } from 'react';

import {Pattern} from '@assets/svg/Pattern';

interface Step3Props {
  navigation?: any;
}

export const Completion = (props: Step3Props) => {
  const {navigation} = props;

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('App');
    }, 3000); // Redirect to Main screen after 3 seconds
  }, [navigation]);

  return (
    <Box flex={1} p={6}>
      <Center my={48}>
        <Heading mb={4}>Registration Successful</Heading>
        <Center
          w="104px"
          h="104px"
          my={6}
          borderWidth={5}
          rounded="full"
          borderColor="themeLight.primary.base">
          <CheckIcon size="10" color="themeLight.primary.base" />
        </Center>
        <Text fontWeight="semibold" mb={4} fontSize="lg">
          Redirecting...
        </Text>
        <Text mt={2} textAlign="center">
          Please hold on while we redirect you to your Fast Fast Rider Home
          screen
        </Text>
      </Center>
    </Box>
  );
};
