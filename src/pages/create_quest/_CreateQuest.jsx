import React, { useState } from 'react';

const QuestCreate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState('00:30:59');
    const [questions, setQuestions] = useState([
        { id: 1, title: 'Заголовок 1', description: "Частина видимого опису - прев'ю." },
        { id: 2, title: 'Заголовок 2', description: "Частина видимого опису - прев'ю." },
        { id: 3, title: 'Заголовок 3', description: "Частина видимого опису - прев'ю." },
    ]);

    const addQuestion = () => {
        const newId = questions.length ? questions[questions.length - 1].id + 1 : 1;
        setQuestions([...questions, { id: newId, title: `Заголовок ${newId}`, description: "Частина видимого опису - прев'ю." }]);
    };

    return (
        <div className="quest-create p-4 max-w-4xl mx-auto bg-white shadow-lg">
            <h2 className="text-2xl font-bold">Редагування квесту</h2>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Заголовок квесту:</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">опис квесту:</label>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center mt-2">
                    <button className="text-blue-500 mr-2">Прикріпити файл</button>
                    <span className="text-red-500">video1.mp4</span>
                </div>
            </div>
            <div className="mt-4">
                <label className="block mb-2 text-gray-700">Обмеження по часу (є або немає):</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                />
                <span className="text-gray-500">(час вказується, якщо обмеження є)</span>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-bold">Список сформованих питань:</h3>
                {questions.map((question) => (
                    <div key={question.id} className="bg-gray-100 p-2 rounded mb-2">
                        <strong>{question.title}:</strong>
                        <p>{question.description}</p>
                    </div>
                ))}
                <button className="text-teal-500" onClick={addQuestion}>+ Додати питання</button>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button className="bg-red-500 text-white py-2 px-4 rounded">Скасувати</button>
                <button className="bg-teal-700 text-white py-2 px-4 rounded">Запустити квест</button>
            </div>
            <p className="text-gray-500 mt-4">При створенні або редагуванні квеста.</p>
        </div>
    );
};

export default QuestCreate;
