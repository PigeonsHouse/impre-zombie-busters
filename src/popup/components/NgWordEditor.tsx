import type React from "react";
import { type ChangeEvent, useCallback, useState } from "react";
import {
  Button,
  ButtonWrapper,
  Container,
  EditorBottom,
  InputBox,
  Message,
  Title,
} from "./NgWordEditor.style";

type NgWordEditorProps = {
  title: string;
  ngWords: string;
  onChangeNgWords: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  saveNgWords: () => void;
};

const NgWordEditor: React.FC<NgWordEditorProps> = ({
  title,
  ngWords,
  onChangeNgWords,
  saveNgWords,
}) => {
  const [isDisplay, setIsDisplay] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | undefined>();
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setIsDisplay(false);
      onChangeNgWords(event);
    },
    [onChangeNgWords],
  );
  const onClickHandler = useCallback(() => {
    saveNgWords();
    setIsDisplay(true);
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(() => setIsDisplay(false), 1000));
  }, [timeoutId, saveNgWords]);

  return (
    <Container>
      <Title>{title}</Title>
      <InputBox value={ngWords} onChange={onChangeHandler} />
      <EditorBottom>
        <ButtonWrapper>
          <Message style={{ display: isDisplay ? "block" : "none" }}>
            OK
          </Message>
          <Button onClick={onClickHandler}>保存</Button>
        </ButtonWrapper>
      </EditorBottom>
    </Container>
  );
};

export default NgWordEditor;
