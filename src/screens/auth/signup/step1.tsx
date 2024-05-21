import {Box, ChevronRightIcon, HStack, Text, VStack} from 'native-base';

import {BackButton} from '@components/ui';
import {Calendar} from '@assets/svg/Calendar';
import {DefaultLayout} from '@layouts/default';
import {PackageIcon} from '@assets/svg/PackageIcon';
import React from 'react';
import {SignupTop} from './components/signupTop';
import {TimeIcon} from '@assets/svg/TimeIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigate} from '@navigation/NavigationService';

interface WorkListType {
  icon: any;
  title: string;
  description: string;
  id: number;
  days: number[];
}

const WorkList: WorkListType[] = [
  {
    id: 1,
    title: 'Full Time',
    description: '7 days/week',
    icon: <PackageIcon />,
    days: [0],
  },
  {
    id: 2,
    title: 'Part Time',
    description: '5 days/week',
    icon: <TimeIcon />,
    days: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    title: 'Weekend',
    description: 'Saturday & Sunday',
    icon: <Calendar />,
    days: [6, 7],
  },
];

export const SignUpStep1 = () => {
  const SelectChoice = (selected: WorkListType) => {
    if (selected.title) {
      const payload = {
        contract_type: selected.id,
        shift_data: selected.days,
      };
      navigate('SignUpStep2', {data: payload});
    }
  };

  return (
    <DefaultLayout>
      <Box flex={1} p={6}>
        <BackButton />
        <VStack mt={8}>
          <SignupTop title="Contract Type" percentage="25" />
          <Text my={6}>Please choose how often you want to work</Text>
          <VStack space={4}>
            {WorkList.map((el, i) => (
              <TouchableOpacity key={i} onPress={() => SelectChoice(el)}>
                <HStack
                  justifyContent="space-between"
                  borderWidth={1}
                  borderColor="themeLight.gray.3"
                  rounded="lg"
                  alignItems="center"
                  shadow={0.5}
                  p={4}>
                  <HStack space={4} alignItems="center">
                    {el.icon}
                    <VStack>
                      <Text fontSize="20px" fontWeight="bold">
                        {el.title}
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight="medium"
                        color="themeLight.gray.2">
                        {el.description}
                      </Text>
                    </VStack>
                  </HStack>
                  <ChevronRightIcon size={6} />
                </HStack>
              </TouchableOpacity>
            ))}
          </VStack>
        </VStack>
      </Box>
    </DefaultLayout>
  );
};
