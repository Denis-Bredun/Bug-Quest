import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Star, Share2 } from "lucide-react";
import { getProgressByUserIdAndQuestId, getQuestStatusById, getQuestById } from '../../services/db_requests';

const QuizzCompletionPage = () => {
  const [rating, setRating] = useState(0);
  const {userId,questId} = useParams();
  const [hover, setHover] = useState(0);
  const [copied, setCopied] = useState(false);
  const [quest, setQuest] = useState(null);
  const [progress, setProgress] = useState(null);
  const [questStatus, setQuestStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const questData = await getQuestById(questId);
      const progressData = await getProgressByUserIdAndQuestId(userId, questId);
      const statusData = await getQuestStatusById(questId);
      
      setQuest(questData);
      setProgress(progressData);
      setQuestStatus(statusData);
    };

    fetchData();
  }, [userId, questId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="shrink-0 absolute top-12 left-32 bg-white shadow-lg p-3 rounded-lg flex items-center space-x-2">
        <span className="text-lg font-semibold">{progress ? `${progress.current}/${progress.total}` : "Loading..."}</span>
        <Star className="text-yellow-400" size={20} />
      </div>
      <div className="mx-auto lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg p-10">
        <div className="flex flex-col items-center">
          <h2 className="font-poppins text-2xl font-semibold text-center">Congrats, you've completed the quest {quest ? `(${quest.name})` : ""}</h2>
          <h1 className="font-mono border-4 rounded-xl p-3 mt-4 border-purple-600 animate-bounce">
            Quest Progress: {questStatus ? (questStatus.completed ? "Completed!" : "In Progress") : "Loading..."}
          </h1>
          <button
            onClick={handleShare}
            className="mt-3 flex items-center text-sm text-teal-700 border border-teal-700 px-3 py-1 rounded-lg hover:bg-teal-700 hover:text-white transition-colors duration-300"
          >
            <Share2 size={16} className="mr-1" />
            Share
          </button>
          {copied && (
            <div className="text-center text-sm text-teal-700 mt-2 animate-fadeIn">
              Copied!
            </div>
          )}
          <div className="w-20 h-20 border-2 mt-4 border-teal-700 rounded-full flex items-center justify-center bg-white overflow-hidden shrink-0">
            <img id="preview" className="w-full h-full object-cover hidden" alt="Preview" />
          </div>
          <h1 className="text-lg font-semibold mt-2">Author: {quest ? quest.author : "Loading..."}</h1>
        </div>
        <div className="text-center mt-6">
          <h1 className="font-poppins text-2xl font-thin">Your final score: {progress ? `${progress.score}/100` : "Loading..."}</h1>
          <h2 className="animate-pulse text-xl text-red-500 transition-colors ease-in-out mt-5">
            Grade: {progress ? (progress.grade || "N/A") : "Loading..."}
          </h2>
          <p className="font-poppins text-2xl font-thin mt-6">You can do much more :)</p>
          <h1 className="text-xl mt-5">Please rate this quest below</h1>
          <div className="flex justify-center space-x-1 mt-4 mb-4">
            {Array.from({ length: 10 }, (_, i) => (
              <Star
                key={i}
                size={32}
                className={`cursor-pointer transition-colors duration-200 ${
                  (hover || rating) > i ? "text-yellow-400" : "text-teal-700"
                }`}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>
        <label className="font-poppins text-xl mt-8 block">You can also leave a comment below</label>
        <input
          className="w-full border-2 rounded-xl p-2 mt-4 hover:border-teal-700 transition-colors duration-300 ease-in-out"
          type="text"
          name="description"
          placeholder="Write your comment..."
        />
        <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
          Save your comment
        </button>
        <button
          className="w-full mt-5 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
          onClick={() => (window.location.href = "/")}
        >
          Return to the home page
        </button>
        <h2 className="font-poppins text-xl mt-5 text-center">Comments history</h2>
        {/* Add comments section */}
      </div>
    </div>
  );
};

export default QuizzCompletionPage;
