import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; 

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="border-2 border-red-500 rounded-3xl px-4 py-2 bg-white shadow-md text-lg font-semibold text-gray-800">
      {timeLeft > 0 ? formatTime(timeLeft) : "Time over!"}
    </div>
  );
};

const DraggableButton = ({ answer, index, moveButton }) => {
  const [, ref] = useDrag({
    type: "BUTTON",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "BUTTON",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveButton(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="w-full p-2 border rounded-xl bg-white shadow-md cursor-move text-center">
      {answer}
    </div>
  );
};

const TaskReviewPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [orderAnswers, setOrderAnswers] = useState(["ТИГАР", "КРУТОЙ ТИГАР", "НЕВЕРОЯТНЫЙ ТИГАР", "РАКЕТА БОМБА ПИТАРДА ТИГАР"]);

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
  };

  const moveButton = (fromIndex, toIndex) => {
    const updatedOrder = [...orderAnswers];
    const [movedItem] = updatedOrder.splice(fromIndex, 1);
    updatedOrder.splice(toIndex, 0, movedItem);
    setOrderAnswers(updatedOrder);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="mx-auto lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg p-10">
          <h2 className="font-poppins text-center text-2xl font-semibold">Task Review</h2>
          <div className="font-poppins space-y-5 mt-6 text-center">
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-medium ml-24">Question № 0</h5>
              <CountdownTimer />
            </div>
            <h5 className="text-lg font-medium">Who is this?</h5>
            <img className="mx-auto" src="/images/1488.jpg" alt="Описание" />
            <div className="flex items-start space-x-4 p-4 border rounded-lg shadow-md bg-gray-50">
            <div>
            <p className="text-left">Open answer type</p>
            <h4 className="font-poppins mr-20 mt-8 block">Write your answer below</h4>
        <input
          className="w-full border-2 rounded-xl p-2 mt-4 hover:border-green-500 transition-colors duration-300 ease-in-out"
          type="text"
          name="description"
          placeholder="Write your answer..."
        />
        <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-green-500 transition-colors duration-300 ease-in-out">
          Save your answer
        </button> </div> </div>
            <div className="flex items-start space-x-4 p-4 border rounded-lg shadow-md bg-gray-50">
              <div>
                <p className="text-left">Choose one right answer type</p>
                <div className="mt-4 space-y-2">
                  {["КРУТАЯ САБАКА", "КРУТАЯ КОШЬКА", "ТУПА Я", "ТВАЯ МАМА"].map((answer, index) => (
                    <button
                      key={index}
                      className={`w-full p-2 border rounded-xl transition-colors duration-300 ease-in-out ${
                        selectedAnswer === index
                          ? "bg-green-500 text-white"
                          : "hover:bg-green-500 hover:text-white"
                      }`}
                      onClick={() => handleAnswerClick(index)}
                    >
                      {answer}
                    </button>
                  ))}
                  <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-green-500 transition-colors duration-300 ease-in-out">
                    Save your answer
                 </button>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 border rounded-lg shadow-md bg-gray-50">
              <div>
                <p className="text-left ">Put in a right order answer type</p>
                <div className="mt-4 space-y-2">
                  {orderAnswers.map((answer, index) => (
                    <DraggableButton key={index} answer={answer} index={index} moveButton={moveButton} />
                  ))}
                  <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-green-500 transition-colors duration-300 ease-in-out">
                    Save your answer
                 </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg shadow-md bg-gray-50 text-center">
            <p className="mr-24">Interactive answer type</p>
            <h4 className="font-poppins ">ГДЕ НОСА У ТИГАРА???</h4>
            <img className="mx-auto" src="/images/1488.jpg" alt="Описание" />
        <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-green-500 transition-colors duration-300 ease-in-out">
          Save your answer
        </button>
        </div>
            <div className="flex w-full mt-4 space-x-4">
              <button
                className="w-1/2 font-poppins border-2 rounded-2xl p-2 hover:border-red-500 transition-colors duration-300 ease-in-out"
                onClick={() => (window.location.href = "/")}
              >
                Finish the quest
              </button>
              <button
                className="w-1/2 font-poppins border-2 rounded-2xl p-2 hover:border-green-500 transition-colors duration-300 ease-in-out"
                onClick={() => (window.location.href = "/")}
              >
                Answer the next question
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskReviewPage;