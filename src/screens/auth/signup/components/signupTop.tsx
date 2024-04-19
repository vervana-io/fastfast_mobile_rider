import {Box, HStack, Heading, Text} from 'native-base';

import React from 'react';

interface SignupTopProps {
  title: string;
  percentage: string;
}

export const SignupTop = (props: SignupTopProps) => {
  const {title, percentage} = props;
  return (
    <Box>
      <HStack justifyContent="space-between" alignItems="center">
        <Heading fontWeight="semibold">{title}</Heading>
        <Text>{percentage}%</Text>
      </HStack>
      <Box w="full" h="8px" bg="themeLight.gray.4" mt={3} rounded="20px">
        <Box
          w={percentage + '%'}
          h="full"
          bg="themeLight.accent"
          rounded="20px"
        />
      </Box>
    </Box>
  );
};
