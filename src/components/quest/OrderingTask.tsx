import React, {useState} from "react";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface OrderingTaskProps {
    options: IOrderingTask[];
    onOptionsChange: (newOptions: IOrderingTask[]) => void;
}

const OrderingTask = ({options, onOptionsChange}) => {

    const handleOptionChange = (index: number, field: "text" | "order", value: string | number) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value as never;
        onOptionsChange(updatedOptions);
    };

    const addEmptyOption = () => {
        onOptionsChange((prevOptions) => [
            ...prevOptions,
            {text: "", order: prevOptions.length + 1}
        ]);
    };

    return (
        <div>
            {/* Options Section */}
            <div>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <div
                            className="flex select-none w-full mt-4 items-center border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-teal-500 min-w-10 text-white px-4 py-2 font-bold font-poppins select-none">
                {index + 1}
              </span>
                            <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                                className="p-2 text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins"
                            />
                        </div>

                        <div className="ml-4 mt-4">
                            <select
                                value={option.order}
                                onChange={(e) => handleOptionChange(index, "order", parseInt(e.target.value))}
                                className="p-2 border border-gray-300 font-poppins rounded-md"
                            >
                                {Array.from({length: options.length}, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}

                <button
                    className="flex items-center m-auto justify-center p-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:outline-none"
                    onClick={addEmptyOption}
                >
                    <FontAwesomeIcon icon={faAdd} className="text-xl"/>
                </button>
            </div>
        </div>
    );
}

export default OrderingTask;