module.exports = api => {
  const isProduction = api.env('production');

  const plugins = [
    ['module:react-native-dotenv', {
      envName: 'APP_ENV',
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true,
    }],
    'react-native-reanimated/plugin',
  ];

  if (isProduction) {
    plugins.unshift('transform-remove-console');
  }

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
