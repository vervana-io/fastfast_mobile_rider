import Sound from 'react-native-sound';
import {Vibration} from 'react-native';

const ONE_SECOND_IN_MS = 1000;
const sound = new Sound('correct.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {  }
});

const vibrateFunc = () => {
  Vibration.vibrate(2 * ONE_SECOND_IN_MS);
};

const playSound = () => {
  sound.play(() => {
    sound.release();
  });
};

export const playEffectForNotifications = () => {
  vibrateFunc();
  playSound();
};
