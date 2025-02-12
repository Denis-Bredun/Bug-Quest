import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faCalendarAlt, faClipboard, faClock} from "@fortawesome/free-solid-svg-icons";
import {useState, useEffect} from "react";
import {Dialog, DialogBody, DialogFooter, DialogHeader, Step, Stepper} from "@material-tailwind/react";
import {Link} from "react-router-dom";
import CreateQuestTaskDialog from "../../components/quest/CreateQuestTaskDialog";
import {QuestionType} from "../../models/QuestionType";
import {createFreeTask, createOrderingTask, createQuest, createSingleChoiceAnswer} from "../../services/db_requests";

interface BaseTask {
    id: number;
    question: string;

    type: QuestionType;

    options: IOrderingTask[];

    image: string,
    coordinates: ClickPosition;

    tasks: ISingleTask[];
}

const CreateQuest_page = () => {

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const [tasks, setTasks] = useState<BaseTask[]>([]);

    // Quest Title
    const [title, setTitle] = useState<string>("");

    // Quest Description
    const [description, setDescription] = useState<string>("");

    // Quest Media
    const [media, setMedia] = useState(null);

    // Quest Time
    const [questTime, setQuestTime] = useState<number>(0);

    // Dialog
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    const [readyOpen, setReadyOpen] = useState(false);
    const handleReadyOpen = () => setReadyOpen(!readyOpen);

    const [isLoading, setIsLoading] = useState(false);
    const [questId, setQuestId] = useState<number | null>(null);

    const addTask = (task: BaseTask) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    function findCorrectAnswerIndex(tasks: ISingleTask[]): number {
        return tasks.findIndex(task => task.isCorrect);
    }

    const handleQuestCreate = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user.id_User;

            // const userId = 1;

            setIsLoading(true)
            const result = await createQuest(title, description, userId, 0, questTime > 0, questTime, 5, (new Date()).toString())

            if (!result || !result.questId) {
                console.log("Failed to create quest: questId is undefined.");
            }

            const questId = result.questId;

            setQuestId(questId);

            tasks.forEach((task) => {
                console.log(task);
            })

            tasks.forEach((task) => {
                if (task.type == QuestionType.SINGLE_CHOICE) {
                    const createdTask = createSingleChoiceAnswer(questId, task.question, "Solve this task to earn reward!", 0,
                        task.tasks[0].text, task.tasks[1].text, task.tasks[2].text, task.tasks[3].text, findCorrectAnswerIndex(task.tasks))
                } else if (task.type == QuestionType.ORDERING_TASK) {
                    const correctOrder = [task.options[0].order, task.options[1].order, task.options[2].order, task.options[3].order].join(',')
                    console.log(correctOrder)

                    createOrderingTask(questId, task.question, "Solve this task to earn reward!", 0,
                        task.options[0].text, task.options[1].text, task.options[2].text, task.options[3].text, correctOrder)
                } else if (task.type == QuestionType.FREE_TEXT) {
                    createFreeTask(questId, task.question, "Solve this task to earn reward!", 0, "")
                }
            })
                    
            setIsLoading(false)

        } catch (e) {
        }

    }

    const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(questId+"")
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                alert('Failed to copy: ');
            });
};

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMedia(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function formatSeconds(seconds) {
        if (seconds === 0) {
            return <span className='font-poppins'>Unlimited</span>;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;


        const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

        return <span className="font-poppins">{formattedTime}</span>;
    }

    return (<div className='p-6 max-w-2xl mx-auto bg-white space-y-4 font-poppins'>
        <h1 className="font-bold text-4xl mb-6 text-center">Create New Quest</h1>

        <div className='w-full px-24 py-4'>
            <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)} placeholder={undefined}
                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Step className="h-4 w-4" onClick={() => setActiveStep(0)} placeholder={undefined}
                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                <Step className="h-4 w-4" onClick={() => setActiveStep(1)} placeholder={undefined}
                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
                <Step className="h-4 w-4" onClick={() => setActiveStep(2)} placeholder={undefined}
                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>
            </Stepper>

            {isFirstStep && <div className='mt-8'>
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon className="mr-2" icon={faCalendarAlt}/>
                    <span className='font-poppins'>{formattedDate}</span>
                    <FontAwesomeIcon className="ml-6 mr-2" icon={faClock}/>
                    {formatSeconds(questTime)}
                </div>

                <div
                    className='flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden'>
                            <span
                                className="bg-teal-500 min-w-40 text-white px-4 py-2 font-bold font-poppins select-none">Title</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='p-2 text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins'
                    />
                </div>

                <div
                    className='flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden bg-none'>
                            <span
                                className="bg-teal-500 min-w-40 text-white px-4 py-2 font-bold select-none font-poppins">Duration</span>
                    <select
                        className="p-2 text-start border-none bg-white text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins ml-auto"
                        value={questTime}
                        onChange={(e) => setQuestTime(Number(e.target.value))}
                    >
                        <option value="0">Unlimited</option>
                        <option value="300">5 minutes</option>
                        <option value="600">10 minutes</option>
                        <option value="900">15 minutes</option>
                        <option value="1800">30 minutes</option>
                    </select>
                </div>

                <div
                    className='flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden flex-col'>
                            <span
                                className="bg-teal-500 w-full text-white px-4 py-2 font-bold select-none font-poppins">Description</span>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='p-2 text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins w-full h-24'
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                    />
                </div>

                <div
                    className='flex select-none w-10/12 mt-4 justify-center m-auto items-center rounded-md overflow-hidden flex-col'>

                    <label
                        className="cursor-pointer font-poppins bg-teal-500 text-white px-6 py-3 rounded-md font-bold select-none hover:bg-teal-600 transition duration-300">
                        Upload Media
                        <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {media && (<div className="mt-4 w-full">
                        {media && media.startsWith('data:image') && (<img
                            src={media}
                            alt="Preview"
                            className="w-full h-fit max-h-64 rounded-md"
                        />)}

                        {media && media.startsWith('data:video') && (
                            <video controls className="w-full h-auto rounded-md">
                                <source src={media} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>)}
                        {media && media.startsWith('data:audio') && (<audio controls className="w-64 h-64 rounded-md">
                            <source src={media} type="audio/mp3"/>
                            Your browser does not support the audio element.
                        </audio>)}
                    </div>)}

                </div>
            </div>}

            {!isFirstStep && !isLastStep && <div className='mt-8'>

                <CreateQuestTaskDialog open={open} dialogHandler={handleOpen} onSubmit={(task) => {
                    addTask(task)
                }}/>

                <div className='flex flex-col items-start gap-6'>
                    {tasks.map((task: BaseTask, taskIndex: number) => (
                        <div key={taskIndex}>
                            <p className='text-xl font-poppins mb-4'>{taskIndex + 1}. {task.question}</p>

                            <div className='y-4'>
                                {(() => {
                                    switch (task.type) {
                                        case QuestionType.SINGLE_CHOICE:
                                            return task.tasks.map((singleTask: ISingleTask, singleTaskIndex: number) => (
                                                <div key={singleTaskIndex} className="flex items-center mt-2">
                                                    <input type="radio"
                                                           id={`option-${taskIndex}-${singleTaskIndex}`}
                                                           name={`question-${taskIndex}`}
                                                           className="mr-2"/>

                                                    <label htmlFor={`option-${taskIndex}-${singleTaskIndex}`}
                                                           className="font-poppins text-black">
                                                        {singleTask.text}
                                                    </label>
                                                </div>
                                            ))
                                                ;

                                        case QuestionType.FREE_TEXT:
                                            return <div>
                                                <input type="text"
                                                       className='w-full border border-gray-300 rounded-md overflow-hidden'/>
                                            </div>;
                                        case QuestionType.ORDERING_TASK:
                                            return task.options.map((orderingTask: IOrderingTask, orderingTaskIndex: number) => (
                                                <div key={orderingTaskIndex}
                                                     className="flex items-center mt-2 w-full justify-between">
                                                    <label htmlFor={`option-${taskIndex}-${orderingTaskIndex}`}
                                                           className="font-poppins text-black flex-1">
                                                        {orderingTask.text}
                                                    </label>

                                                    <select
                                                        id={`option-${taskIndex}-${orderingTaskIndex}`}
                                                        name={`question-${taskIndex}-${orderingTaskIndex}`}
                                                        className="ml-2 p-1 border mt-2"
                                                        value={orderingTask.order}
                                                    >
                                                        {task.options.map((order, orderIndex) => (
                                                            <option key={orderIndex}
                                                                    value={task.options[orderIndex].order}>
                                                                {task.options[orderIndex].order}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ));
                                        case QuestionType.PICTURE_CHOICE:
                                            return (
                                                <div className="flex flex-col items-center mt-4">
                                                    <img
                                                        src={task.image}
                                                        alt="Picture Choice"
                                                        className="max-w-full h-auto mb-4"
                                                    />
                                                </div>
                                            );
                                    }
                                })()}
                            </div>

                        </div>
                    ))}

                </div>

                <button
                    className="flex mt-6 items-center m-auto justify-center p-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none"
                    onClick={handleOpen}>
                    <FontAwesomeIcon icon={faAdd} className="text-xl"/>
                </button>
            </div>
            }

            {
                isLastStep && <div>
                    <button
                        className="flex mt-6 items-center m-auto justify-center p-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
                        onClick={(e) => {
                            handleReadyOpen()

                            handleQuestCreate(e)
                        }}>
                        Run Quest
                    </button>

                    <Dialog
                        open={readyOpen}
                        handler={handleReadyOpen}
                        className="flex justify-center items-center flex-col"
                        size="xs" placeholder={undefined} onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}>
                        <DialogHeader className="font-poppins" placeholder={undefined}
                                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Quest
                            Number</DialogHeader>
                        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}>
                            <p className="text-center text-3xl font-poppins text-gray-600">
                                {!isLoading && questId}
                            </p>
                        </DialogBody>
                        <DialogFooter className={'flex justify-between'} placeholder={undefined}
                                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex items-center mr-4 gap-2 font-poppins px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none ml-4"
                            >
                                <FontAwesomeIcon icon={faClipboard} className="text-xl"/>
                                <span>Copy</span>
                            </button>

                            <Link to={'/app/home'}>
                                <button
                                    onClick={handleReadyOpen}
                                    className="px-4 py-2 gap-2 font-poppins bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
                                >
                                    Home
                                </button>
                            </Link>

                        </DialogFooter>
                    </Dialog>
                </div>
            }

            <div className="mt-6 flex justify-between">
                <button
                    className={`${isFirstStep && 'invisible'} w-24 clickable justify-center rounded-md border border-solid px-[12px] py-[8px] font-poppins hover:bg-gray-100`}
                    onClick={handlePrev} disabled={isFirstStep}>
                    Prev
                </button>
                <button
                    className={`${isLastStep && 'invisible'} w-24 bg-teal-500 rounded-md px-[14px] py-[8px] hover:bg-teal-600 text-white`}
                    onClick={handleNext} disabled={isLastStep}>Next
                </button>
            </div>
        </div>


    </div>)
        ;
}

export default CreateQuest_page;