import React, { useCallback } from 'react';

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
    <div className='reset-button' onClick={allRemoveHandler}>非表示リストをリセットする</div>
  )
};

export default ResetButton;
