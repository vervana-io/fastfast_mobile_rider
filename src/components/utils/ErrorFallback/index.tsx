import * as React from 'react';

import {Box, Button, Text} from 'native-base';

export function ErrorFallback(props: {error: Error; resetError: () => void}) {
  return (
    <Box
      _light={{bg: 'white.100'}}
      _dark={{bg: 'dark.950'}}
      justifyContent="center"
      flex={1}
      alignItems="center">
      <Text textAlign="center" fontSize={24}>
        Oops!
      </Text>

      <Text textAlign="center" fontSize={16} py={2}>
        An error occurred 🥺
      </Text>
      <Text textAlign="center" fontSize={16} py={4}>
        {props.error.message}
      </Text>
      <Text textAlign="center" fontSize={16} py={4}>
        {props.error.stack}
      </Text>

      <Button
        onPress={() => {
          props.resetError();
        }}>
        <Text color="white"> Try again</Text>
      </Button>
    </Box>
  );
}
