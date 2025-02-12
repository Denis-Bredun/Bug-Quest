import React, { useState } from 'react';

const QuestionEdit = () => {
    const [questionType, setQuestionType] = useState(''); // type of question (e.g. open-ended, multiple choice)
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [sequence, setSequence] = useState(['', '', '', '']);
    const [imageFile, setImageFile] = useState(null);

    const handleFileChange = (e) => {
        setImageFile(URL.createObjectURL(e.target.files[0]));
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSequenceChange = (index, value) => {
        const newSequence = [...sequence];
        newSequence[index] = value;
        setSequence(newSequence);
    };

    return (
        <div className="question-edit p-4 max-w-4xl mx-auto bg-white shadow-lg">
            <h2 className="text-2xl font-bold">Редагування питання</h2>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Тип питання:</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">опис питання:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />
                <div className="flex items-center mt-2">
                    <button className="text-blue-500 mr-2">Прикріпити файл</button>
                    <input type="file" className="hidden" onChange={handleFileChange}/>
                    {imageFile && <img src={imageFile} alt="Uploaded" className="mt-2"/>}
                </div>
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Відкрита відповідь:</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" />
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Тестове питання:</label>
                {answers.map((answer, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        <input
                            type="radio"
                            name="correctAnswer"
                            className="ml-2"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Встановлення послідовності:</label>
                {sequence.map((seq, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={seq}
                            onChange={(e) => handleSequenceChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Знайти об'єкт на зображенні:</label>
                <input type="file" className="w-full p-2 border border-gray-300 rounded" onChange={handleFileChange} />
                {imageFile && <img src={imageFile} alt="Uploaded" className="mt-2"/>}
            </div>
            <div className="flex justify-between items-center mt-4">
                <button className="bg-red-500 text-white py-2 px-4 rounded">Скасувати</button>
                <button className="bg-green-500 text-white py-2 px-4 rounded">Створити</button>
            </div>
        </div>
    );
};

export default QuestionEdit;
