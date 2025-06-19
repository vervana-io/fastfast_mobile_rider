/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  Button,
  Center,
  HStack,
  Link,
  StatusBar,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useState} from 'react';

import {Animated} from 'react-native';
import {CalendarIm} from './svgs/calendarIm';
import {DefaultLayout} from '@layouts/default';
import {ExchangeIm} from './svgs/exchangeIm';
import PagerView from 'react-native-pager-view';
import {RiderIm} from './svgs/riderIm';
import {WIN_HEIGHT} from '../../../config';
import {navigate} from '@navigation/NavigationService';
import {rootConfig} from '@store/root';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface OnboardingList {
  image: any;
  title: string;
  description: string;
}

const List: OnboardingList[] = [
  {
    image: <RiderIm width={300} height={240} />,
    title: 'Become a Delivery Rider',
    description:
      'Join us and experience the ease of earning money through deliveries. Flexible schedules, quick payouts, and the freedom to work on your terms.',
  },
  {
    image: <CalendarIm width={250} />,
    title: 'Flexible Working Hours',
    description:
      'With FastFast, you decide when to work. Whether it’s a few hours a week or a full-time commitment, you’re in control. Balance your work with your life seamlessly.',
  },
  {
    image: <ExchangeIm width={250} />,
    title: 'Convenient Earnings',
    description:
      'Convenient, quick, and right at your fingertips. Earn on your own schedule, wherever you are. Turn your free time into cash with just a few taps.',
  },
];

export const Onboarding = () => {
  const pagerRef = React.useRef(null);

  const [onSelected, setOnSelected] = useState(0);

  const pagerScrolled = (e: any) => {
    const position = e.nativeEvent.position;
    setOnSelected(position);
  };

  const Views = useCallback(
    ({data}: {data: OnboardingList}) => (
      <Center key="1" flex={1}>
        <Box>{data.image}</Box>
        <Text fontSize={20} fontWeight="bold">
          {data.title}
        </Text>
        <Text textAlign="center" px={6} fontSize={14} fontWeight="light">
          {data.description}
        </Text>
      </Center>
    ),
    [],
  );

  const NavigateToView = (view: 'login' | 'signup') => {
    rootConfig.setNewUser(false);
    if (view === 'login') {
      navigate('Auth');
    } else {
      navigate('Auth', {screen: 'SignUpStep1'});
    }
  };

  return (
    <DefaultLayout checkPermissions={false}>
      <VStack w="full" flex={1} safeArea>
        <VStack space={6} flex={1} justifyContent="space-between">
          <Center p={8}>
            <HStack space={2}>
              {List.map((el, i) => (
                <Box
                  w={7}
                  h={2}
                  rounded="lg"
                  bg={
                    onSelected === i
                      ? 'themeLight.primary.base'
                      : 'themeLight.gray.3'
                  }
                  key={i}
                />
              ))}
              {/* <Box w={7} h={2} rounded="lg" bg="themeLight.primary.base" /> */}
            </HStack>
          </Center>
          <Box flex={1}>
            <AnimatedPagerView
              testID="pager-view"
              ref={pagerRef}
              style={{width: '100%', flex: 1}}
              initialPage={0}
              pageMargin={10}
              onPageSelected={pagerScrolled}>
              {List.map((el, i) => (
                <Views key={i} data={el} />
              ))}
            </AnimatedPagerView>
          </Box>
          <VStack p={8} space={4}>
            <Button
              rounded="30px"
              bg="themeLight.accent"
              py={4}
              onPress={() => NavigateToView('signup')}
              _text={{fontWeight: 'bold'}}>
              Become a Rider
            </Button>
            <Center>
              <Link
                _text={{
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  color: 'themeLight.accent',
                }}
                onPress={() => NavigateToView('login')}
                isUnderlined={false}>
                Login as Existing Rider
              </Link>
            </Center>
          </VStack>
        </VStack>
      </VStack>
    </DefaultLayout>
  );
};
