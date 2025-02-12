import React, {useState} from "react";
import {Dialog, DialogBody, DialogFooter, DialogHeader} from "@material-tailwind/react";
import SingleChoiceTask from "./SingleChoiceTask";
import OrderingTask from "./OrderingTask";
import PictureChoiceTask from "./PictureChoiceTask";
import {QuestionType} from "../../models/QuestionType";

interface BaseTask {
    id: number;
    question: string;

    type: QuestionType;

    options: IOrderingTask[];

    image: string,
    coordinates: ClickPosition;

    tasks: ISingleTask[];
}

interface CreateQuestTaskDialogProps {
    open: boolean;
    dialogHandler: () => void;

    onSubmit: (task: BaseTask) => void;
}

const CreateQuestTaskDialog: React.FC<CreateQuestTaskDialogProps> = ({open, dialogHandler, onSubmit}) => {

    const [taskType, setTaskType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
    const [question, setQuestion] = useState<string>("")

    // Single choice
    const [tasks, setTasks] = useState<ISingleTask[]>(([
        {text: '', isCorrect: false, checked: false},
        {text: '', isCorrect: false, checked: false},
        {text: '', isCorrect: false, checked: false},
        {text: '', isCorrect: false, checked: false},
    ]))

    // Picture choice
    const [image, setImage] = useState<string | null>(null);
    const [clickPosition, setClickPosition] = useState<ClickPosition | null>(null);

    // Ordering
    const [orderingOptions, setOrderingOptions] = useState<IOrderingTask[]>([
        {text: "", order: 1},
        {text: "", order: 2},
        {text: "", order: 3},
        {text: "", order: 4},
    ]);

    const renderTaskComponent = () => {
        switch (taskType) {
            case QuestionType.SINGLE_CHOICE:
                return <SingleChoiceTask options={tasks} onOptionsChange={setTasks}/>;
            case QuestionType.PICTURE_CHOICE:
                return <PictureChoiceTask image={image} clickPosition={clickPosition}
                                          onDataChange={(im, pos) => {
                                              setImage(im);
                                              setClickPosition(pos)
                                          }}/>;
            case QuestionType.ORDERING_TASK:
                return <OrderingTask options={orderingOptions} onOptionsChange={setOrderingOptions}/>;
            case QuestionType.FREE_TEXT:
                return;
        }
    }

    return (
        <Dialog className="flex justify-center items-center flex-col" size={"md"} open={open}
                handler={dialogHandler} placeholder={undefined} onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}>
            <DialogHeader className="font-poppins" placeholder={undefined}
                          onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Create Quiz</DialogHeader>
            <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <div
                    className='flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden bg-none'>
                            <span
                                className="bg-teal-500 min-w-40 text-white px-4 py-2 font-bold select-none font-poppins">Type</span>
                    <select
                        value={taskType} onChange={(e) => setTaskType(Number(e.target.value))}
                        className="p-2 text-start border-none bg-white text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins ml-auto"
                    >
                        <option value={QuestionType.SINGLE_CHOICE}>Single choice</option>
                        <option value={QuestionType.FREE_TEXT}>Text input</option>
                        <option value={QuestionType.ORDERING_TASK}>Ordering</option>
                        <option value={QuestionType.PICTURE_CHOICE}>Find object in picture</option>
                    </select>
                </div>

                <div
                    className='flex select-none w-full items-center border border-gray-300 mt-4 rounded-md overflow-hidden flex-col'>
                            <span
                                className="bg-teal-500 w-full text-white px-4 py-2 font-bold select-none text-center font-poppins">Question</span>

                    <textarea
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        className='p-2 text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins w-full h-24'
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                    />
                </div>

                {renderTaskComponent()}

            </DialogBody>

            <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <button
                    onClick={dialogHandler}
                    className="flex items-center gap-2 rounded-xl border border-solid px-[14px] py-[8px] font-poppins hover:bg-gray-100 mr-2"
                >
                    <span className="font-poppins">Cancel</span>
                </button>
                <button
                    className="flex gap-2 bg-teal-500 rounded-xl px-[14px] py-[8px] hover:bg-teal-600 text-white"
                    onClick={() => {
                        let task: BaseTask;

                        switch (taskType) {
                            case QuestionType.SINGLE_CHOICE:
                                task = {
                                    id: 0,
                                    question: question,
                                    type: QuestionType.SINGLE_CHOICE,
                                    image: undefined,
                                    options: undefined,
                                    tasks: tasks,
                                    coordinates: undefined,
                                };
                                onSubmit(task)

                                dialogHandler()
                                return


                            case QuestionType.PICTURE_CHOICE:
                                task = {
                                    id: 0,
                                    question: question,
                                    type: QuestionType.PICTURE_CHOICE,
                                    image: image,
                                    options: undefined,
                                    tasks: undefined,
                                    coordinates: clickPosition,
                                };
                                onSubmit(task)

                                dialogHandler()
                                return;


                            case QuestionType.FREE_TEXT:
                                task = {
                                    id: 0,
                                    question: question,
                                    type: QuestionType.FREE_TEXT,
                                    image: undefined,
                                    options: undefined,
                                    tasks: undefined,
                                    coordinates: undefined,
                                };
                                onSubmit(task)

                                dialogHandler()
                                return;


                            case QuestionType.ORDERING_TASK:
                                task = {
                                    id: 0,
                                    question: question,
                                    type: QuestionType.ORDERING_TASK,
                                    image: undefined,
                                    options: orderingOptions,
                                    tasks: undefined,
                                    coordinates: undefined,
                                };
                                onSubmit(task)

                                dialogHandler()
                                return;

                        }
                    }
                    }
                >
                    <span className="font-poppins">Submit</span>
                </button>
            </DialogFooter>
        </Dialog>
    )
}

export default CreateQuestTaskDialog;