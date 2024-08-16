import styled from "@emotion/styled";

export const Header = styled.div`
  background-color: #ddd;
  margin: 8px 0;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Title = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
`;

export const ResetButton = styled.div`
  background-color: #999;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
`;
