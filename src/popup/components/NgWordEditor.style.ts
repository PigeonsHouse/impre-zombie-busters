import styled from "@emotion/styled";

export const Container = styled.div`
  background-color: #ddd;
  margin: 8px 0;
  padding: 4px 8px;
  border-radius: 4px;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.2em;
`;

export const InputBox = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  height: 100px;
  resize: none;
  margin: 4px 0;
  border: none;
  &:focus {
    outline: none;
  }
`;

export const EditorBottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Message = styled.div`
  font-size: 0.9em;
  color: #0a2;
  font-weight: bold;
`;

export const Button = styled.div`
  background-color: #999;
  cursor: pointer;
  padding: 2px 4px;
  color: white;
  border-radius: 4px;
`;
