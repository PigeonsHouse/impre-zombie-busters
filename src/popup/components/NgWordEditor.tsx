import type React from "react";
import type { ChangeEvent } from "react";
import {
	ButtonWrapper,
	Container,
	InputBox,
	Title,
} from "./NgWordEditor.style";
import { Button } from "./NgWordEditor.style";

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
	return (
		<Container>
			<Title>{title}</Title>
			<InputBox value={ngWords} onChange={onChangeNgWords} />
			<ButtonWrapper>
				<Button onClick={saveNgWords}>保存</Button>
			</ButtonWrapper>
		</Container>
	);
};

export default NgWordEditor;
