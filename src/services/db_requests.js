const BASE_URL = 'http://localhost:3000';

export const createUserGoogleAuth = async (nickname, email, avatarPath = null, rating = 0) => {
    try {
        const response = await fetch(`${BASE_URL}/user/google-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname, email, avatarPath, rating}),
        });
        const data = await response.json();
        const {message} = data;

        console.log("db_requests");
        if (message && message.id) {
            return message.id;
        }

        return message;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createUserEmailAuth = async (nickname, email, password, rating = 0, avatarPath = null) => {
    try {
        const response = await fetch(`${BASE_URL}/user/email-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nickname, email, password, rating, avatarPath})
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();


        const {message} = data;


        return message.id;

    } catch (error) {
        console.error('Error creating user:', error);
    }
}


export const getUserByEmail = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password}),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const responseBody = await response.json();

        console.log(responseBody);

        return responseBody;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
};


export const updateAvatarPath = async (userId, newPath) => {
    try {
        const response = await fetch(`${BASE_URL}/user/avatar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, newPath})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const uploadAvatar = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/user/upload-image`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const updateNickname = async (userId, newNickname) => {
    try {
        const response = await fetch(`${BASE_URL}/user/nickname`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, newNickname})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const updateProfileDescription = async (userId, newDescription) => {
    try {
        const response = await fetch(`${BASE_URL}/user/profile-description`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, newDescription})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const fetchAvatarImage = async (avatar_path) => {
    try {
        const imageUrl = `${BASE_URL}/user/avatar/${avatar_path}`;
        const response = await fetch(imageUrl);

        console.log("response" + response);

        if (!response.ok) {
            throw new Error('Error fetching avatar image');
        }

        const blob = await response.blob();
        return blob;  // Return the actual binary data
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return null;
    }
};


export const getUserByNickname = async (nickname) => {
    try {
        const response = await fetch(`${BASE_URL}/user/nickname?nickname=${nickname}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getQuestById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/quest/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getQuestHistoryByUserId = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-history/user/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getProgressByUserIdAndQuestId = async (userId, questId) => {
    try {
        const response = await fetch(`${BASE_URL}/progress/user/${userId}/quest/${questId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getQuestStatusById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-status/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const sortQuestHistoryByCreationDate = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-history/sort-by-date/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const filterQuestHistoryByCreationDate = async (userId, date) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-history/filter-by-date/${userId}?date=${date}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getUserDataFromQuestObject = async (questId) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-user/${questId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getCommentsByQuestId = async (questId) => {
    try {
        const response = await fetch(`${BASE_URL}/comments/quest/${questId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getUserIdsFromCommentsByQuestId = async (questId) => {
    try {
        const response = await fetch(`${BASE_URL}/comments/quest/${questId}/user-ids`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getMultimediaById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/multimedia/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getQuestionsByQuestId = async (questId) => {
    try {
        const response = await fetch(`${BASE_URL}/questions/quest/${questId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getQuestionTypeById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/question-type/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const getAnswerByQuestionId = async (questionId, questionTypeId) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/question/${questionId}/type/${questionTypeId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const addQuestToHistory = async (userId, questId) => {
    try {
        const response = await fetch(`${BASE_URL}/quest-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, questId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createProgress = async (userId, questId, progressValue, questionNumber, remainingTime, statusId) => {
    try {
        const response = await fetch(`${BASE_URL}/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, questId, progressValue, questionNumber, remainingTime, statusId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const updateProgress = async (progressId, progressValue, questionNumber, remainingTime, statusId) => {
    try {
        const response = await fetch(`${BASE_URL}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({progressId, progressValue, questionNumber, remainingTime, statusId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createQuest = async (title, description, userId, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate) => {
    try {
        const response = await fetch(`${BASE_URL}/quest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                userId,
                multimediaId,
                hasTimeLimit,
                timeForQuest,
                rating,
                creationDate
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createQuestion = async (title, textDescription, questionTypeId, multimediaId, questId) => {
    try {
        const response = await fetch(`${BASE_URL}/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, textDescription, questionTypeId, multimediaId, questId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createOpenAnswer = async (questionId, correctAnswer) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({questionId, correctAnswer})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createObjectSearchAnswer = async (questionId) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/object-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({questionId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};


export const createSingleChoiceAnswer = async (questId, title, description, multimediaId, option1, option2, option3, option4, rightAnswer) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/single-choice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questId,
                title,
                description,
                multimediaId,
                option1,
                option2,
                option3,
                option4,
                rightAnswer
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createOrderingTask = async (questId, title, description, multimediaId, option1, option2, option3, option4, correctOrder) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/sequence`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questId,
                title,
                description,
                multimediaId,
                option1,
                option2,
                option3,
                option4,
                correctOrder
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createFreeTask = async (questId, title, description, multimediaId, correctAnswer) => {
    try {
        const response = await fetch(`${BASE_URL}/answer/open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questId,
                title,
                description,
                multimediaId,
                correctAnswer
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getQuestByHashCode = async () => {

}

export const updateQuestAttributes = async (questId, title, description, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate) => {
    try {
        const response = await fetch(`${BASE_URL}/quest`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questId,
                title,
                description,
                multimediaId,
                hasTimeLimit,
                timeForQuest,
                rating,
                creationDate
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const updateQuestionAttributes = async (questionId, title, textDescription, questionTypeId, multimediaId, questId) => {
    try {
        const response = await fetch(`${BASE_URL}/question`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({questionId, title, textDescription, questionTypeId, multimediaId, questId})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};
export const updateAnswerAttributes = async (answerId, correctAnswer) => {
    try {
        const response = await fetch(`${BASE_URL}/answer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({answerId, correctAnswer})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const addComment = async (userId, questId, comment) => {
    try {
        const response = await fetch(`${BASE_URL}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, questId, comment})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}


export const verifyAndCreateUser = async (token) => {
    console.log("token", token);
    if (!token) {
        console.error("Token is missing in verifyAndCreateUser");
        return;
    }

    const {username, email} = token;
    console.log("username", username);
    console.log("email", email);
    const res = await createUserGoogleAuth(username, email, null, 0);

    return res;

};
