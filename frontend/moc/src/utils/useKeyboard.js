import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

const KEYBOARD_HEIGHT = 340; // 고정 키보드 높이

/**
 * 키보드 높이를 추적하는 커스텀 훅
 * Android의 position: 'absolute' 요소에서 키보드 대응을 위해 사용
 * 고정값 사용으로 일관된 동작 보장
 *
 * @returns {Object} { keyboardHeight: number, isKeyboardVisible: boolean }
 */
export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setKeyboardHeight(KEYBOARD_HEIGHT); // 고정값 사용
      setIsKeyboardVisible(true);
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return {keyboardHeight, isKeyboardVisible};
};

/**
 * 키보드를 닫는 헬퍼 함수
 */
export const dismissKeyboard = () => {
  Keyboard.dismiss();
};
