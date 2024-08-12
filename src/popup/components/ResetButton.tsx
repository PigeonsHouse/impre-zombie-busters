import React from 'react';
import { Button } from './ResetButton.style';

type ResetButtonProps = {
  resetUserData: () => void,
};

const ResetButton: React.FC<ResetButtonProps> = ({ resetUserData }) => {
  return <Button onClick={resetUserData}>非表示リストをリセットする</Button>;
};

export default ResetButton;
