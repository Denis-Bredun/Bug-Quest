import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";

interface SingleChoiceTaskProps {
    options: ISingleTask[];
    onOptionsChange: (newOptions: ISingleTask[]) => void;
}

const SingleChoiceTask = ({options, onOptionsChange}) => {

    // const [options, setOptions] = useState<ISingleTask[]>(([
    //     {text: '', isCorrect: false, checked: false},
    //     {text: '', isCorrect: false, checked: false}
    // ]))

    const handleOptionChange = (index: number, field: keyof ISingleTask, value: boolean | string) => {
        const updatedOptions = [...options];
        // @ts-ignore
        updatedOptions[index][field] = value;

        onOptionsChange(updatedOptions);
    };

    const addEmptyOption = () => {
        onOptionsChange((prevOptions: ISingleTask[]) => [
            ...prevOptions,
            {text: '', isCorrect: false, checked: false}
        ]);
    };

    return <div>
        {/* Options Section */}
        <div>
            {options.map((option, index) => (<div key={index} className="flex items-center mb-2">
                <div
                    className='flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden'>
                                            <span
                                                className="bg-teal-500 min-w-10 text-white px-4 py-2 font-bold font-poppins select-none">{index + 1}</span>
                    <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        className='p-2 text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins'
                    />
                </div>

                <div className={'flex items-center mt-3'}>
                    <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        className="mr-2 ml-4 w-6 h-6 border-2 rounded-sm focus:outline-none"

                    />
                    <span className="font-poppins text-gray-600 mr-4">Correct?</span>
                </div>
            </div>))}

            <button
                className="flex items-center m-auto justify-center p-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none"
                onClick={addEmptyOption}>
                <FontAwesomeIcon icon={faAdd} className="text-xl"/>
            </button>
        </div>
    </div>
}

export default SingleChoiceTask;



