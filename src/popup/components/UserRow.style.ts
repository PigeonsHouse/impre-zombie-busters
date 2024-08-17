import styled from "@emotion/styled";

export const UserRowContainer = styled.div`
  background-color: #ddd;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const UserRowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 30px;
`;

export const AltAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: white;
  flex-shrink: 0;
  display: flex;
  align-item: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #ddd;
`;

export const Username = styled.div`
  font-weight: bold;
`;

export const UserId = styled.div`
  color: #1da1f2;
  text-decoration: underline;
  cursor: pointer;
`;

export const RemoveButton = styled.div`
  cursor: pointer;
  background-color: #999;
  color: white;
  font-weight: bold;
  height: 20px;
  width: 20px;
  text-align: center;
  border-radius: 20px;
  flex-shrink: 0;
`;

export const UserRowBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
`;

export const TweetLink = styled.div`
  background-color: #999;
  color: white;
  border-radius: 4px;
  padding: 0 4px;
  cursor: pointer;
`;
