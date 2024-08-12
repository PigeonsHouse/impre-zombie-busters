import React, { useCallback } from 'react';
import { Button } from './ResetButton.style';

type ResetButtonProps = {
  resetUserData: () => void,
};

const ResetButton: React.FC<ResetButtonProps> = ({
  resetUserData,
}) => {
  const allRemoveHandler = useCallback(() => {
    chrome.storage.local.set({invisibleUsers: ""});
    resetUserData();
  }, [resetUserData]);

  return (
  <Button onClick={allRemoveHandler}>非表示リストをリセットする</Button>
  )
};

export default ResetButton;
