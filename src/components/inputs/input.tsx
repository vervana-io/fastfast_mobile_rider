import * as React from 'react';

/* eslint-disable react-native/no-inline-styles */
import {
  Box,
  FormControl,
  HStack,
  IInputProps,
  Icon,
  IconButton,
  Input as NBInput,
  Spinner,
  Stack,
  Text,
  useColorMode,
} from 'native-base';
import {Pressable, TextInputProps} from 'react-native';

import {EyeOff} from '@assets/svg/EyeOff';
import {EyeOn} from '@assets/svg/EyeOn';

interface InputProps {
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  caption?: string;
  isSecure?: boolean;
  icon?: any;
  size?: 'small' | 'medium' | 'large';
  customStyle?: IInputProps;
  inputCustomStyle?: IInputProps;
  value?: any;
  labelStyle?: any;
  disabled?: boolean;
  onEndEditing?: any;
  returnKeyType?: 'go' | 'done' | 'next' | 'search' | 'send';
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  maxLength?: number;
  errorMessage?: string;
  hasError?: boolean;
  iconPosition?: 'right' | 'left';
  hasIcon?: boolean;
  onChangeText: (event: any) => void;
  mx?: number;
  my?: number;
  px?: number;
  py?: number;
  pl?: number;
  pr?: number;
  mb?: number;
  mt?: number;
  placeholderTextColor?: string;
  fontSize?: IInputProps['fontSize'];
  bg?: string;
  borderRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  returnKeyLabel?: string;
  isLoading?: boolean;
  boxWidth?: any;
  hasFocused?: any;
  borderWidth?: number;
  borderColor?: string;
  minLength?: number;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  w?: number | string;
  h?: number | string;
  PressIn?: (event: any) => void;
  onSubmitEditing?: (event: any) => void;
  autoFocus?: boolean;
  _disabled?: React.CSSProperties;
  onFocus?: () => void;
  labelElementRight?: any;
  bgColor?: string;
  height?: string | number;
  autoComplete?: TextInputProps['autoComplete'];
}

export const Input = React.forwardRef<typeof NBInput, InputProps>(
  (props, ref) => {
    const {
      w,
      h,
      label,
      placeholder,
      isRequired = false,
      errorMessage,
      hasError,
      caption,
      isSecure = false,
      icon,
      boxWidth = '100%',
      customStyle,
      inputCustomStyle,
      value,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      autoFocus,
      labelStyle,
      disabled = false,
      onEndEditing,
      returnKeyType,
      keyboardType,
      autoCapitalize,
      maxLength,
      minLength,
      iconPosition,
      hasIcon,
      onChange,
      PressIn,
      mx,
      my,
      px,
      py = 0,
      pl,
      pr,
      mb,
      mt,
      placeholderTextColor,
      fontSize = 'md',
      bg = '#fff',
      borderRadius = 6,
      returnKeyLabel,
      isLoading,
      borderWidth,
      borderColor,
      onSubmitEditing,
      _disabled,
      onFocus,
      labelElementRight,
      bgColor,
      height = 52,
      autoComplete,
    } = props;
    const [show, setShow] = React.useState(true);

    const {colorMode} = useColorMode();

    const handleClick = React.useCallback(() => {
      if (show) {
        setShow(false);
      } else {
        setShow(true);
      }
    }, [show]);

    const CheckSecure = isSecure && show ? 'password' : 'text';

    const SecureIcon = React.useCallback(
      () => (
        <IconButton
          width="auto"
          onPress={() => setShow(show ? false : true)}
          icon={
            show ? (
              <EyeOn stroke="black" width={20} height={20} />
            ) : (
              <EyeOff fill="black" width={20} height={20} />
            )
          }
        />
      ),
      [show],
    );

    const RenderIcon = React.useCallback(() => {
      if (isLoading !== undefined && isLoading) {
        return (
          <Box px={2}>
            <Spinner size="sm" />
          </Box>
        );
      } else {
        return (
          <Pressable onPress={handleClick} style={{paddingHorizontal: 12}}>
            {isSecure ? (
              <SecureIcon />
            ) : icon !== undefined && typeof icon === 'string' ? (
              icon
            ) : (
              icon
            )}
          </Pressable>
        );
      }
    }, [SecureIcon, handleClick, icon, isLoading, isSecure]);

    const OnEndEditable = () => {
      if (onEndEditing !== undefined) {
        onEndEditing(true);
      }
    };

    return (
      <Box width={boxWidth}>
        <FormControl isRequired={isRequired} isInvalid={hasError}>
          <Stack>
            <HStack justifyContent="space-between" alignItems="center" w="full">
              <FormControl.Label>
                <Text
                  style={labelStyle}
                  fontSize="14px"
                  color="themeLight.gray.2"
                  fontWeight="medium">
                  {label}
                </Text>
              </FormControl.Label>
              {labelElementRight}
            </HStack>
            <Box style={customStyle}>
              <NBInput
                ref={ref}
                placeholder={placeholder}
                my={my}
                mx={mx}
                mb={mx}
                mt={mx}
                bg={bg}
                borderRadius={borderRadius}
                py={py}
                px={px}
                pl={iconPosition === 'left' ? 16 : pl}
                pr={pr}
                h={h}
                w={w}
                height={height}
                borderBottomLeftRadius={borderBottomLeftRadius}
                borderBottomRightRadius={borderBottomRightRadius}
                minLength={minLength}
                borderWidth={colorMode === 'dark' ? 1 : borderWidth}
                bgColor={bgColor}
                borderColor={
                  colorMode === 'dark' ? 'coolGray.500' : borderColor
                }
                shadow={0.9}
                fontSize={fontSize}
                _disabled={_disabled}
                _dark={{
                  _input: {
                    color: 'white.100',
                    placeholderTextColor: 'white',
                    selectionColor: 'white',
                    bg: '#111827',
                  },
                  _focus: {
                    color: 'white.100',
                  },
                }}
                _focus={{color: '#000000'}}
                placeholderTextColor={placeholderTextColor}
                returnKeyLabel={returnKeyLabel}
                returnKeyType={returnKeyType}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoFocus={autoFocus}
                onChange={(e: any) => onChange && onChange(e)}
                type={CheckSecure}
                _input={inputCustomStyle}
                value={value}
                onBlur={props.onBlur}
                isDisabled={disabled}
                onPressIn={PressIn !== undefined ? PressIn : undefined}
                onEndEditing={() => OnEndEditable()}
                maxLength={maxLength}
                onChangeText={(e: any) => props?.onChangeText(e)}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
                autoComplete={autoComplete}
                leftElement={
                  hasIcon && iconPosition === 'left' ? <RenderIcon /> : []
                }
                rightElement={
                  hasIcon && iconPosition === 'right' ? <RenderIcon /> : []
                }
              />
              {/* {hasIcon && iconPosition === 'left' && (
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  height="full"
                  p={0}
                  alignItems="center"
                  justifyContent="center">
                  <RenderIcon />
                </Box>
              )}

              {hasIcon && iconPosition === 'right' && (
                <Box
                  position="absolute"
                  right={0}
                  top={0}
                  bottom={0}
                  height="full"
                  p={0}
                  borderWidth={1}
                  alignItems="center"
                  justifyContent="center">
                  <RenderIcon />
                </Box>
              )} */}
            </Box>
            {caption !== undefined ? (
              <FormControl.HelperText mt={1}>{caption}</FormControl.HelperText>
            ) : null}
            <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </Box>
    );
  },
);
