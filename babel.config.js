module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@assets': './src/assets',
          '@configs': './src/configs',
          '@helpers': './src/helpers',
          '@hooks': './src/hooks',
          '@layouts': './src/layouts',
          '@store': './src/store',
          '@types': './src/types',
          '@navigation': './src/navigations',
          '@handlers': './src/handlers',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        safe: true,
        allowUndefined: true,
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
