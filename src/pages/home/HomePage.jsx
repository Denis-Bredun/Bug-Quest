import { useState, useEffect } from 'react';
import { getQuestHistoryByUserId,getQuestById,getMultimediaById,getProgressByUserIdAndQuestId,getQuestStatusById,fetchAvatarImage,getQuestByHashCode } from '../../services/db_requests';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faFilter, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { useNavigate } from "react-router";

const HomePage =  () => {
    const [open, setOpen] = useState(false);
    const [quizId, setQuizId] = useState("");
    const [quests, setQuests] = useState([]); 
    const [questsMedia, setQuestsMedia] = useState([]); 
    const [sortOrder, setSortOrder] = useState("latest")
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));


    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        const fetchQuests = async () => {
            const userId = user.id_User;
            
            const response = await getQuestHistoryByUserId(userId);
            let quests = [];
            let questsMedia = [];
    
            for (let i = 0; i < response.length; i++) {
                console.log(response[i].quest_id);
                let res = await getQuestById(response[i].quest_id);
    
                
                let multimedia = res.multimedia_id ? await getMultimediaById(res.multimedia_id) : { path: "" };
                let progress = await getProgressByUserIdAndQuestId(userId, res.quest_id);
                console.log(progress);
                let status;
                if(progress === "Progress not found") {
                    console.log("we here");
                    status = "Not Started";
                } else {
                     status = progress?.status_id ? await getQuestStatusById(progress.status_id) : "Not Started";
                    
                }
                res.multimedia = multimedia.path || "";
                const blob = res.multimedia ? await fetchAvatarImage(res.multimedia) : null;
                const blobUrl = blob ? URL.createObjectURL(blob) : "";
                questsMedia.push(blobUrl);
    
                res.status = status;
                quests.push(res);
            }
            quests.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));

            
            setQuests(quests); 
            setQuestsMedia(questsMedia);
            console.log("quests", quests);
        };
    
        fetchQuests(); 
    }, [user.id_User]);
    
    useEffect(() => {
        console.log("quests", quests);
    }, [quests]);
    
    const handleSubmit = async (quest_id) => {
        
    
        if (quest_id) {
            navigate(`/app/quest_view/${quest_id}`);
        } else {
            alert("Quest exists, but ID is missing!");
        }
    };
    

    const toggleSortOrder = () => {
        const newOrder = sortOrder === "latest" ? "oldest" : "latest";
        setSortOrder(newOrder);

        setQuests((prevQuests) => {
            const sortedQuests = [...prevQuests].sort((a, b) => 
                newOrder === "latest"
                    ? new Date(b.creation_date) - new Date(a.creation_date)
                    : new Date(a.creation_date) - new Date(b.creation_date)
            );
            return sortedQuests;
        });
    };


    return (
        <div className="p-4">
            <div className="flex justify-between mb-8 px-60">
                <button
                    onClick={handleOpen}
                    className="flex items-center gap-3 bg-teal-500 rounded-2xl px-6 py-4 hover:bg-teal-600 text-white transition-colors duration-300 ease-in-out text-2xl">
                    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faSignInAlt}/>
                    <span className="font-poppins">Join the Quest</span>
                </button>

                <button
                    onClick={() => navigate("/app/create")}
                    className="flex items-center gap-3 bg-teal-500 rounded-2xl px-6 py-4 hover:bg-teal-600 text-white transition-colors duration-300 ease-in-out text-2xl">
                    <FontAwesomeIcon className="h-7 w-7 text-white" icon={faAdd}/>
                    <span className="font-poppins">New Quest</span>
                </button>
            </div>

            <h2 className="text-4xl font-bold text-center my-10">Quest History</h2>

            <div className="flex justify-center mb-10">
                <button
                    onClick={toggleSortOrder}
                    className="flex items-center gap-3 clickable justify-center rounded-2xl border border-solid px-6 py-4 font-poppins text-2xl text-gray-700 hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                    <FontAwesomeIcon className="h-7 w-7 text-gray-400" icon={faFilter}/>
                    <span>Sort: {sortOrder === "latest" ? "Latest → Oldest" : "Oldest → Latest"}</span>
                </button>
            </div>

            <div className="space-y-6">
                {quests.map((quest, index) => (
                    <div key={quest.quest_id} className="border hover:cursor-pointer hover:bg-gray-100 rounded-lg p-6 flex justify-between items-center shadow-md">
                        <div className="flex-1 me-14">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">{quest.Header}</h3>
                                <div className="flex items-center gap-10">
                                    <span className="text-lg text-gray-600">Status</span>
                                    <span className="text-2xl font-semibold">{quest.Rating}★</span>
                                </div>
                                <p className="text-lg text-gray-500 mt-2">{quest.description}</p>
                            </div>
                            <div className="flex items-center gap-6">
                                {questsMedia[index] && <img src={questsMedia[index]} alt="Media" className="w-16 h-16 rounded-full"/>}
                            </div>
                            <p className="text-lg text-gray-500 mt-2">{quest.Description}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <img src={'/logo.ico'} alt="User Avatar" className="w-16 h-16 rounded-full"/>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog className="flex justify-center items-center flex-col" size={"xs"} open={open} handler={handleOpen}>
                <DialogHeader className="font-poppins text-2xl">Join Quiz</DialogHeader>
                <DialogBody>
                    <p className="text-center text-gray-600 font-poppins text-lg">Input the code received for the quiz to join</p>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <span className="bg-teal-500 text-white px-6 py-3 font-bold font-poppins text-lg">Code</span>
                        <input
                            type="text"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            className="w-full p-3 font-bold text-start border-none text-black outline-none focus:border-none hover:border-none focus:outline-none font-poppins text-lg"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <button onClick={handleOpen} className="flex items-center gap-3 rounded-2xl border border-solid px-6 py-3 font-poppins text-lg hover:bg-gray-100 mr-4">
                        <span>Cancel</span>
                    </button>
                    <button className="flex gap-3 bg-teal-500 rounded-2xl px-6 py-3 hover:bg-teal-600 text-white text-lg" onClick={() => handleSubmit(quizId)}>
                        <span>Submit</span>
                    </button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

export default HomePage;