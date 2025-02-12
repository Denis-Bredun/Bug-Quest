import {QuestionType} from "../QuestionType";

interface BaseTask {
    id: number;
    question: string;

    type: QuestionType;

    options: IOrderingTask[];

    image: String,
    coordinates: ClickPosition;

    tasks: ISingleTask[];
}