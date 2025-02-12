import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestById, getCommentsByQuestId, getUserIdsFromCommentsByQuestId } from '../../services/db_requests.js'; 
import { Star, Share2 } from "lucide-react";

const QuestView = () => {
    const { questId } = useParams();  
    const [questData, setQuestData] = useState(null);
    const [comments, setComments] = useState([]);  
    const [reviewers, setReviewers] = useState([]);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const handleShare = () => {
      const url = window.location.href; 
      navigator.clipboard.writeText(url); 
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    };

    console.log(questId);



    useEffect(() => {
        const fetchQuestData = async () => {
            try {
                
                const data = await getQuestById(questId);
                console.log("data",data);
                setQuestData(data);  
            } catch (error) {
                setError('Failed to load quest data.');
            }
        };
        fetchQuestData();
    }, [questId]);  

    
    useEffect(() => {
        const fetchCommentsAndReviewers = async () => {
            try {
                const commentsData = await getCommentsByQuestId(questId);
                setComments(commentsData);  

                const reviewersData = await getUserIdsFromCommentsByQuestId(questId);  
                setReviewers(reviewersData);
            } catch (error) {
                setError('Failed to load comments or reviewer data.');
            }
        };

        if (questId) {
            fetchCommentsAndReviewers();
        }
    }, [questId]);

    
    if (error) {
        return <div>{error}</div>;
    }

    
    if (!questData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quest-view p-6 max-w-4xl mx-auto bg-white shadow-lg border-2 border-gray-300 rounded-xl">
        <button
            className="w-full mb-5 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
            onClick={() => (window.location.href = "/app/home")}
        >
            Return to the home page
        </button>
        
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <span className="text-gray-700">Rating:</span>
                <span className="ml-1 text-yellow-500">
                    <Star className="text-yellow-400" size={20} />{questData.Rating}
                </span>
                <span className="ml-2 text-teal-700">{questData.status}</span>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-36 h-36 mx-auto mt-4 border-2 border-teal-700 rounded-full flex items-center justify-center bg-white overflow-hidden">
                    <img id="preview" className="w-full h-full object-cover hidden" alt="Preview" src={questData.previewImageUrl} />
                </div>
                <div className="flex items-center mt-2">
                    <span className="text-gray-800 font-poppins">Author:</span>
                    <span className="ml-1">{questData.creatorName}</span>
                </div>
            </div>
        </div>
    
        <div className="my-4">
            <h1 className="text-xl font-bold">{questData.Header}</h1>
            <p className="text-gray-700">{questData.Description}</p>
        </div>
    
        {/* Контейнер с рамкой для кнопок */}
        <div className="border-2 border-gray-300 rounded-xl p-4 shadow-md mt-4">
            <div className="flex justify-between items-center">
                <button className="font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">Edit Quest</button>
                <button
                    onClick={handleShare}
                    className="flex items-center text-sm text-teal-700 border border-teal-700 px-3 py-1 rounded-lg hover:bg-teal-700 hover:text-white transition-colors duration-300"
                >
                    <Share2 size={16} className="mr-1" />
                    Share
                </button>
                {copied && <div className="text-sm text-teal-700 mt-2">Copied!</div>}
            </div>
    
            <div className="flex flex-wrap gap-4 justify-center mt-4">
                <button className="font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">Begin Quest</button>
                <button className="font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">Continue</button>
                <button className="font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">Try Again</button>
                <button className="w-full font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">Restart Quest</button>
            </div>
        </div>
    
        {/* Контейнер с рамкой для комментариев */}
        <input
          className="w-full border-2 rounded-xl p-2 mt-4 hover:border-teal-700 transition-colors duration-300 ease-in-out"
          type="text"
          name="description"
          placeholder="Write your comment..."
        />
        <button className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
          Save your comment
        </button>
        <div className="border-2 border-gray-300 rounded-xl p-4 shadow-md mt-4">
            <h2 className="text-lg font-poppins">Comments history</h2>
            {comments.length > 0 ? (
                comments.map((comment, index) => {
                    const reviewerId = reviewers[index];
                    return (
                        <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2 flex items-center">
                            <div className="w-12 h-12 border-2 border-green-500 rounded-full flex items-center justify-center bg-white overflow-hidden mr-2">
                                <img id={`reviewer-${reviewerId}`} className="w-full h-full object-cover hidden" alt={`Reviewer ${reviewerId}`} />
                            </div>
                            <p><strong>{comment.username}:</strong> {comment.text}</p>
                        </div>
                    );
                })
            ) : (
                <div>No comments yet</div>
            )}
        </div>
    </div>
    );
};

export default QuestView;
