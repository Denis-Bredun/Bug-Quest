import sqlite3 from "sqlite3";

const db = new sqlite3.Database("my_database.db");
import bcrypt from "bcrypt";

const saltRounds = 10;


function createUserGoogleAuth(nickname, email, avatarPath = null, rating = 0) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO User (username, Email, avatar_path, Rating,Hashcode_password)
                       VALUES (?, ?, ?, ?,?)
                       ON CONFLICT(Email) DO UPDATE SET username=excluded.username, avatar_path=excluded.avatar_path`;

        db.run(query, [nickname, email, avatarPath, rating, ''], function (err) {
            if (err) return reject(err);

            console.log(`User with ID ${this.lastID} created/updated.`);
            resolve({id: this.lastID, message: "User created/updated successfully"});
        });
    });
}


function createUserEmailAuth(nickname, email, password, rating = 0, avatarPath = null) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM User WHERE Email = ?", [email], (err, row) => {
            if (err) return reject(err);
            if (row) return reject(new Error("Email already exists."));

            bcrypt.hash(password, saltRounds, (err, hashcode) => {
                if (err) return reject(err);

                const query = `INSERT INTO User (username, Email, Hashcode_password, Rating, avatar_path)
                             VALUES (?, ?, ?, ?, ?)`;

                db.run(query, [nickname, email, hashcode, rating, avatarPath], function (err) {
                    if (err) return reject(err);
                    resolve({id: this.lastID});
                });
            });
        });
    });
}

async function getUserByEmail(email) {
    try {
        const query = 'SELECT * FROM User WHERE Email = $1';
        return new Promise((resolve, reject) => {
            db.get(query, [email], function (err, row) {
                if (err) {
                    reject('Error fetching user by email: ' + err.message);
                }
                resolve(row || undefined);
            });
        });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Database error');
    }
}


function getUserByEmailAndPassword(email, password, callback) {
    const query = `SELECT * FROM User WHERE Email = ?`;

    db.get(query, [email], function (err, row) {
        if (err) {
            return console.error('Error fetching user:', err.message);
        }

        if (row) {


            bcrypt.compare(password, row.Hashcode_password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    callback(null);
                    return;
                }

                if (isMatch) {
                    callback(row);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    });
}


function updateAvatarPath(userId, newPath) {
    const query = `UPDATE User SET avatar_path = ? WHERE id_User = ?`;
    db.run(query, [newPath, userId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Avatar path updated for user with ID ${userId}.`);
    });
}

function updateNickname(userId, newNickname) {
    const query = `UPDATE User SET username = ? WHERE id_User = ?`;
    db.run(query, [newNickname, userId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Nickname updated for user with ID ${userId}.`);
    });
}

function updateProfileDescription(userId, newDescription) {
    const query = `UPDATE User SET Description = ? WHERE id_User = ?`;
    db.run(query, [newDescription, userId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Profile description updated for user with ID ${userId}.`);
    });
}

function getUserByNickname(nickname, callback) {
    const query = `SELECT * FROM User WHERE username = ?`;
    db.get(query, [nickname], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getQuestById(questId, callback) {
    const query = `SELECT * FROM Quest WHERE quest_id = ?`;
    db.get(query, [questId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getQuestHistoryByUserId(userId, callback) {
    const query = `SELECT * FROM Quest_history WHERE id_User = ?`;
    db.all(query, [userId], function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    });
}

function getProgressByUserIdAndQuestId(userId, questId, callback) {
    const query = `SELECT * FROM progress_completation WHERE id_User = ? AND quest_id = ?`;
    db.get(query, [userId, questId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getQuestStatusById(statusId, callback) {
    const query = `SELECT * FROM Quest_stat WHERE stat_id = ?`;
    db.get(query, [statusId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function sortQuestHistoryByCreationDate(userId, callback) {
    getQuestHistoryByUserId(userId, function (rows) {
        rows.sort((a, b) => new Date(a.date_of_creation) - new Date(b.date_of_creation));
        callback(rows);
    });
}

function filterQuestHistoryByCreationDate(userId, date, callback) {
    getQuestHistoryByUserId(userId, function (rows) {
        const filteredRows = rows.filter(row => new Date(row.date_of_creation) >= new Date(date));
        callback(filteredRows);
    });
}

function getUserDataFromQuestObject(questId, callback) {
    const query = `SELECT * FROM User WHERE id_User = (SELECT id_User FROM Quest WHERE quest_id = ?)`;
    db.get(query, [questId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getCommentsByQuestId(questId, callback) {
    const query = `SELECT * FROM Comment WHERE quest_id = ?`;
    db.all(query, [questId], function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    });
}

function getUserIdsFromCommentsByQuestId(questId, callback) {
    const query = `SELECT DISTINCT id_User FROM Comment WHERE quest_id = ?`;
    db.all(query, [questId], function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        callback(rows.map(row => row.id_User));
    });
}

function getMultimediaById(multimediaId, callback) {
    const query = `SELECT * FROM Multedia WHERE multimedia_id = ?`;
    db.get(query, [multimediaId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getQuestionsByQuestId(questId, callback) {
    const query = `SELECT * FROM Question WHERE quest_id = ?`;
    db.all(query, [questId], function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    });
}


function getQuestionTypeById(typeId, callback) {
    const query = `SELECT * FROM question_type WHERE question_type_id = ?`;
    db.get(query, [typeId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);
    });
}

function getAnswerByQuestionId(questionId, questionTypeId, callback) {
    let query = '';
    switch (questionTypeId) {
        case 1:
            query = `SELECT * FROM Open_response WHERE question_id = ?`;
            break;
        case 2:
            query = `SELECT * FROM Search_object_on_image WHERE question_id = ?`;
            break;
        case 3:
            query = `SELECT * FROM Sim_time_answer WHERE question_id = ?`;
            break;
        case 4:
            query = `SELECT * FROM Seq_answer WHERE question_id = ?`;
            break;
    }
    db.get(query, [questionId], function (err, row) {
        if (err) {
            return console.error(err.message);
        }
        callback(row);

    });
}

function addQuestToHistory(userId, questId) {
    const query = `INSERT INTO Quest_history (id_User, quest_id) VALUES (?, ?)`;
    db.run(query, [userId, questId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Quest with ID ${questId} added to history for user with ID ${userId}.`);
    });
}


function createProgress(userId, questId, progressValue, questionNumber, remainingTime, statusId) {
    const query = `INSERT INTO progress_completation (id_User, quest_id, progress_value, question_number, time_left, stat_id)
                       VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [userId, questId, progressValue, questionNumber, remainingTime, statusId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Progress created for user with ID ${userId} and quest with ID ${questId}.`);
    });
}

function updateProgress(progressId, progressValue, questionNumber, remainingTime, statusId) {
    const query = `UPDATE progress_completation SET progress_value = ?, question_number = ?, time_left = ?, stat_id = ?
                       WHERE progress_id = ?`;
    db.run(query, [progressValue, questionNumber, remainingTime, statusId, progressId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Progress with ID ${progressId} updated.`);
    });
}

function createQuest(title, description, userId, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate, dbPath) {
    return new Promise((resolve, reject) => {

        const query = `INSERT INTO Quest (Header, Description, id_User, multimedia_id, time_limit, quest_time, Rating, date_of_creation)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(query, [title, description, userId, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate], function (err) {
            if (err) {
                reject(new Error(`Error creating quest: ${err.message}`));
                return;
            }

            const questId = this.lastID;
            resolve(questId);
        });
    });
}

function createQuestion(title, textDescription, questionTypeId, multimediaId, questId) {
    const query = `INSERT INTO Question (Header, Text_Description, question_type_id, multimedia_id, quest_id)
                       VALUES (?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(query, [title, textDescription, questionTypeId, multimediaId, questId], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this.lastID);
            }
        });
    })
}

function createOpenAnswer(questionId, correctAnswer) {
    const query = `INSERT INTO Open_response (question_id, Right_answer) VALUES (?, ?)`;
    db.run(query, [questionId, correctAnswer], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Open answer created for question ID: ${questionId}.`);
    });
}

function createObjectSearchAnswer(questionId) {
    const query = `INSERT INTO Search_object_on_image (question_id) VALUES (?)`;
    db.run(query, [questionId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Object search answer created for question ID: ${questionId}.`);
    });
}


function createSingleChoiceAnswer(questionId, choice1, choice2, choice3, choice4, correctChoice) {
    const query = `INSERT INTO Sim_time_answer (question_id, Option_1, Option_2, Option_3, Option_4, Right_answer) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [questionId, choice1, choice2, choice3, choice4, correctChoice], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Single choice answer created for question ID: ${questionId}.`);
    });
}

function createSequenceAnswer(questionId, sequence) {
    const query = `INSERT INTO Seq_answer (question_id, Sequence) VALUES (?, ?)`;
    db.run(query, [questionId, sequence], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Sequence answer created for question ID: ${questionId}.`);
    });
}

function getQuestByHashCode(hashcode) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Quest WHERE hash_code = ?`;

        console.log("Executing query:", query, "with hashcode:", hashcode);

        db.get(query, [hashcode], (err, row) => {
            if (err) {
                console.error("Database error:", err.message);
                return reject(err);
            }

            console.log("DB Query Result:", row);
            resolve(row ? row : null);
        });
    });
}


function updateQuestAttributes(questId, title, description, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate) {
    const query = `UPDATE Quest SET Description = ?, Description = ?, multimedia_id = ?, time_limit = ?, quest_time = ?, Raiting = ?, date_of_creation = ? 
                       WHERE quest_id = ?`;
    db.run(query, [title, description, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate, questId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Quest with ID ${questId} updated.`);
    });
}

function updateQuestionAttributes(questionId, title, textDescription, questionTypeId, multimediaId, questId) {
    const query = `UPDATE Question SET Description = ?, Text_Description = ?, question_type_id = ?, multimedia_id = ?, quest_id = ? 
                       WHERE question_id = ?`;
    db.run(query, [title, textDescription, questionTypeId, multimediaId, questId, questionId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Question with ID ${questionId} updated.`);
    });
}

function updateAnswerAttributes(answerId, correctAnswer) {
    const query = `UPDATE Open_response SET Right_answer = ? WHERE answer_id = ?`;
    db.run(query, [correctAnswer, answerId], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Answer with ID ${answerId} updated.`);
    });
}

function addComment(userId, questId, comment) {
    const query = `INSERT INTO Comment (id_User, quest_id, Comment) VALUES (?, ?, ?)`;
    db.run(query, [userId, questId, comment], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Comment added for quest ID ${questId} by user ID ${userId}.`);
    });
}


async function create_db() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Quest_stat (
            stat_id INTEGER PRIMARY KEY,
            stat_name TEXT
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS User (
            id_User INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT NOT NULL,
            Hashcode_password TEXT NOT NULL,
            Description TEXT,
            Email TEXT UNIQUE NOT NULL,
            avatar_path TEXT,
            Rating INTEGER DEFAULT 0
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Quest (
            quest_id INTEGER PRIMARY KEY,
            Header TEXT,
            Description TEXT,
            id_User INTEGER,
            multimedia_id INTEGER,
            time_limit BOOLEAN,
            hash_code TEXT,
            quest_time INTEGER,
            Rating INTEGER,
            date_of_creation TEXT,
            FOREIGN KEY(id_User) REFERENCES User(id_User),
            FOREIGN KEY(multimedia_id) REFERENCES Multedia(multimedia_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS progress_completation (
            progress_id INTEGER PRIMARY KEY,
            id_User INTEGER,
            quest_id INTEGER,
            progress_value INTEGER,
            question_number INTEGER,
            time_left INTEGER,
            stat_id INTEGER,
            FOREIGN KEY(id_User) REFERENCES User(id_User),
            FOREIGN KEY(quest_id) REFERENCES Quest(quest_id),
            FOREIGN KEY(stat_id) REFERENCES Quest_stat(stat_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Quest_history (
            history_id INTEGER PRIMARY KEY,
            id_User INTEGER,
            quest_id INTEGER,
            FOREIGN KEY(id_User) REFERENCES User(id_User),
            FOREIGN KEY(quest_id) REFERENCES Quest(quest_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Multedia (
            multimedia_id INTEGER PRIMARY KEY,
            multimedia_path TEXT
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS question_type (
            question_type_id INTEGER PRIMARY KEY,
            Value TEXT
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Question (
            question_id INTEGER PRIMARY KEY,
            Header TEXT,
            Text_description TEXT,
            question_type_id INTEGER,
            multimedia_id INTEGER,
            quest_id INTEGER,
            FOREIGN KEY(question_type_id) REFERENCES question_type(question_type_id),
            FOREIGN KEY(multimedia_id) REFERENCES Multedia(multimedia_id),
            FOREIGN KEY(quest_id) REFERENCES Quest(quest_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Open_response (
            answer_id INTEGER PRIMARY KEY,
            question_id INTEGER,
            Right_answer TEXT,
            FOREIGN KEY(question_id) REFERENCES Question(question_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Search_object_on_image (
            search_id INTEGER PRIMARY KEY,
            question_id INTEGER,
            FOREIGN KEY(question_id) REFERENCES Question(question_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Sim_time_answer (
            option_id INTEGER PRIMARY KEY,
            question_id INTEGER,
            Option_1 TEXT,
            Option_2 TEXT,
            Option_3 TEXT,
            Option_4 TEXT,
            Right_answer TEXT,
            FOREIGN KEY(question_id) REFERENCES Question(question_id)
          )`);

        db.run(`CREATE TABLE IF NOT EXISTS Seq_answer (
            seq_id INTEGER PRIMARY KEY,
            question_id INTEGER,
            option_1 VARCHAR(255) NOT NULL,  
            option_2 VARCHAR(255) NOT NULL,  
            option_3 VARCHAR(255) NOT NULL,  
            option_4 VARCHAR(255) NOT NULL,  
            correct_order TEXT NOT NULL, 
            FOREIGN KEY(question_id) REFERENCES Question(question_id))`)

        db.run(`DELETE FROM question_type`);

        db.run(`INSERT INTO question_type (Value) VALUES ('FREE_TEXT');`);
        db.run(`INSERT INTO question_type (Value) VALUES ('ORDERING_TASK');`);
        db.run(`INSERT INTO question_type (Value) VALUES ('PICTURE_CHOICE_TASK');`);
        db.run(`INSERT INTO question_type (Value) VALUES ('SINGLE_CHOICE_TASK');`);
    });

    console.log("Database initialized");
}

function createSingleChoiceTask(questionId, option1, option2, option3, option4, rightAnswer) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Sim_time_answer (question_id, Option_1, Option_2, Option_3, Option_4, Right_answer) VALUES (?, ?, ?, ?, ?, ?)`,
            [questionId, option1, option2, option3, option4, rightAnswer],
            function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            }
        )
    });
}

function createOrderingTask(questionId, option1, option2, option3, option4, correctOrder) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Seq_answer (question_id, option_1, option_2, option_3, option_4, correct_order) VALUES (?, ?, ?, ?, ?, ?)`,
            [questionId, option1, option2, option3, option4, correctOrder],
            function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            }
        )
    });
}

function createFreeTextTask(questionId, rightAnswer) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Open_response (question_id, Right_answer) VALUES (?, ?)`,
            [questionId, rightAnswer],
            function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            }
        )
    });
}


export const Db = {
    createUserGoogleAuth,
    createUserEmailAuth,
    updateAvatarPath,
    updateNickname,
    updateProfileDescription,
    getUserByNickname,
    getQuestById,
    getQuestHistoryByUserId,
    getProgressByUserIdAndQuestId,
    getQuestStatusById,
    sortQuestHistoryByCreationDate,
    filterQuestHistoryByCreationDate,
    getUserDataFromQuestObject,
    getCommentsByQuestId,
    getUserIdsFromCommentsByQuestId,
    getMultimediaById,
    getQuestionsByQuestId,
    getQuestionTypeById,
    getAnswerByQuestionId,
    addQuestToHistory,
    createProgress,
    updateProgress,
    createQuest,
    createQuestion,
    createOpenAnswer,
    createObjectSearchAnswer,
    createSingleChoiceAnswer,
    createSequenceAnswer,
    updateQuestAttributes,
    updateQuestionAttributes,
    updateAnswerAttributes,
    addComment,
    getUserByEmailAndPassword,
    create_db,
    getUserByEmail,
    createSingleChoiceTask,
    createOrderingTask,
    getQuestByHashCode,
    createFreeTextTask
};
    
