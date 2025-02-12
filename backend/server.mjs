import express from "express";
import {fileURLToPath} from 'url';
import {Db} from "./db.mjs";
import cors from "cors";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 20 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
        }
        cb(null, true);
    },
});


Db.create_db();


app.get('/user/avatar/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    console.log('Sending image:', imagePath);

    fs.readFile(imagePath, (err, data) => {
        if (err) {
            console.error("Error sending the image:", err);
            return res.status(404).send('Image not found');
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(data);
    });
});

app.post('/user/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'No image uploaded'});
    }


    const imagePath = `/uploads/${req.file.filename}`;
    console.log('Image uploaded successfully:', imagePath);


    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imagePath,
    });
});


app.post('/user/google-auth', async (req, res) => {
    const {nickname, email, avatarPath, rating} = req.body;

    try {
        const existingUser = await Db.getUserByEmail(email);
        console.log(existingUser);
        if (existingUser !== undefined) {
            return res.status(201).json({message: existingUser});
        }

        const result = await Db.createUserGoogleAuth(nickname, email, avatarPath, rating);
        console.log("result" + result);
        res.status(201).json({message: result});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/user/email-auth', async (req, res) => {
    const {nickname, email, password, rating, avatarPath} = req.body;
    try {
        const result = await Db.createUserEmailAuth(nickname, email, password, rating, avatarPath);
        res.status(201).json({message: result});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post('/user/login', (req, res) => {
    const {email, password} = req.body;

    Db.getUserByEmailAndPassword(email, password, (user) => {
        if (user) {
            console.log("Authentication successful");
            console.log(user);
            res.status(200).json({message: 'Authentication successful', user: user});
        } else {
            console.log("Invalid email or password");
            res.status(401).json({error: 'Invalid email or password'});
        }
    });
});


app.put('/user/avatar', (req, res) => {
    const {userId, newPath} = req.body;
    try {
        Db.updateAvatarPath(userId, newPath);
        console.log('Avatar path updated');
        res.status(200).json({message: 'Avatar path updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.put('/user/nickname', (req, res) => {
    const {userId, newNickname} = req.body;
    try {
        Db.updateNickname(userId, newNickname);
        res.status(200).json({message: 'Nickname updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.put('/user/profile-description', (req, res) => {
    const {userId, newDescription} = req.body;
    try {
        Db.updateProfileDescription(userId, newDescription);
        res.status(200).json({message: 'Profile description updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.get('/user/nickname', (req, res) => {
    const {nickname} = req.query;
    Db.getUserByNickname(nickname, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    });
});

app.get('/quest/:id', (req, res) => {
    const {id} = req.params;
    Db.getQuestById(id, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'Quest not found'});
        }
    });
});


app.get('/quest-history/user/:userId', (req, res) => {
    const {userId} = req.params;
    Db.getQuestHistoryByUserId(userId, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'Quest history not found'});
        }
    });
});


app.get('/progress/user/:userId/quest/:questId', (req, res) => {
    const {userId, questId} = req.params;
    Db.getProgressByUserIdAndQuestId(userId, questId, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            console.log("Progress not found");
            res.status(200).json({error: 'Progress not found'});
        }
    });
});


app.get('/quest-status/:id', (req, res) => {
    const {id} = req.params;
    Db.getQuestStatusById(id, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'Quest status not found'});
        }
    });
});


app.get('/quest-history/sort-by-date/:userId', (req, res) => {
    const {userId} = req.params;
    Db.sortQuestHistoryByCreationDate(userId, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'Quest history not found'});
        }
    });
});


app.get('/quest-history/filter-by-date/:userId', (req, res) => {
    const {userId} = req.params;
    const {date} = req.query;
    Db.filterQuestHistoryByCreationDate(userId, date, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'Quest history not found'});
        }
    });
});


app.get('/quest-user/:questId', (req, res) => {
    const {questId} = req.params;
    Db.getUserDataFromQuestObject(questId, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    });
});

app.get('/quest-hashcode/:hashcode', async (req, res) => {
    const { hashcode } = req.params;
    console.log("Received hashcode:", hashcode);

    try {
        const row = await Db.getQuestByHashCode(hashcode)

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: 'No quest exists' });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/comments/quest/:questId', (req, res) => {
    const {questId} = req.params;
    Db.getCommentsByQuestId(questId, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'Comments not found'});
        }
    });
});


app.get('/comments/quest/:questId/user-ids', (req, res) => {
    const {questId} = req.params;
    Db.getUserIdsFromCommentsByQuestId(questId, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'User IDs not found'});
        }
    });
});


app.get('/multimedia/:id', (req, res) => {
    const {id} = req.params;
    Db.getMultimediaById(id, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'Multimedia not found'});
        }
    });
});


app.get('/questions/quest/:questId', (req, res) => {
    const {questId} = req.params;
    Db.getQuestionsByQuestId(questId, (rows) => {
        if (rows) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({error: 'Questions not found'});
        }
    });
});


app.get('/question-type/:id', (req, res) => {
    const {id} = req.params;
    Db.getQuestionTypeById(id, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'Question type not found'});
        }
    });
});


app.get('/answer/question/:questionId/type/:questionTypeId', (req, res) => {
    const {questionId, questionTypeId} = req.params;
    Db.getAnswerByQuestionId(questionId, questionTypeId, (row) => {
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({error: 'Answer not found'});
        }
    });
});


app.post('/quest-history', (req, res) => {
    const {userId, questId} = req.body;
    try {
        Db.addQuestToHistory(userId, questId);
        res.status(201).json({message: 'Quest added to history'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/progress', (req, res) => {
    const {userId, questId, progressValue, questionNumber, remainingTime, statusId} = req.body;
    try {
        Db.createProgress(userId, questId, progressValue, questionNumber, remainingTime, statusId);
        res.status(201).json({message: 'Progress created'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.put('/progress', (req, res) => {
    const {progressId, progressValue, questionNumber, remainingTime, statusId} = req.body;
    try {
        Db.updateProgress(progressId, progressValue, questionNumber, remainingTime, statusId);
        res.status(200).json({message: 'Progress updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/quest', async (req, res) => {
    const {title, description, userId, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate} = req.body;

    try {
        const questId = await Db.createQuest(title, description, userId, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate)

        res.status(201).json({questId: questId})
    } catch (e) {
        res.status(501).json({error: e.message})
    }
});


app.post('/question', (req, res) => {
    const {title, textDescription, questionTypeId, multimediaId, questId} = req.body;
    try {
        Db.createQuestion(title, textDescription, questionTypeId, multimediaId, questId);
        res.status(201).json({message: 'Question created'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/answer/object-search', (req, res) => {
    const {questionId} = req.body;
    try {
        Db.createObjectSearchAnswer(questionId);
        res.status(201).json({message: 'Object search answer created'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/answer/single-choice', async (req, res) => {

    const {questId, title, description, multimediaId, option1, option2, option3, option4, rightAnswer} = req.body;

    try {
        const questionId = await Db.createQuestion(title, description, 4, multimediaId, questId);
        console.log(questionId);

        const taskId = await Db.createSingleChoiceTask(questionId, option1, option2, option3, option4, rightAnswer);
        console.log(taskId);
        res.status(201).json({message: 'Question created'});
    } catch (error) {
        res.status(501).json({error: error.message});
    }
});


app.post('/answer/sequence', async (req, res) => {
    const {questId, title, description, multimediaId, option1, option2, option3, option4, correctOrder} = req.body;

    try {
        const questionId = await Db.createQuestion(title, description, 2, multimediaId, questId);
        console.log(questionId);

        const taskId = await Db.createOrderingTask(questionId, option1, option2, option3, option4, correctOrder);
        console.log(taskId);
        res.status(201).json({message: 'Question created'});
    } catch (error) {
        res.status(501).json({error: error.message});
    }
});


app.post('/answer/open', async (req, res) => {
    const {questId, title, description, multimediaId, correctAnswer} = req.body;

    try {
        const questionId = await Db.createQuestion(title, description, 2, multimediaId, questId);
        console.log(questionId);

        const taskId = await Db.createFreeTextTask(questionId, correctAnswer);
        console.log(taskId);
        res.status(201).json({message: 'Question created'});
    } catch (error) {
        res.status(501).json({error: error.message});
    }
});

app.put('/quest', (req, res) => {
    const {questId, title, description, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate} = req.body;
    try {
        Db.updateQuestAttributes(questId, title, description, multimediaId, hasTimeLimit, timeForQuest, rating, creationDate);
        res.status(200).json({message: 'Quest updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.put('/question', (req, res) => {
    const {questionId, title, textDescription, questionTypeId, multimediaId, questId} = req.body;
    try {
        Db.updateQuestionAttributes(questionId, title, textDescription, questionTypeId, multimediaId, questId);
        res.status(200).json({message: 'Question updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
app.put('/answer', (req, res) => {
    const {answerId, correctAnswer} = req.body;
    try {
        Db.updateAnswerAttributes(answerId, correctAnswer);
        res.status(200).json({message: 'Answer updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.post('/comment', (req, res) => {
    const {userId, questId, comment} = req.body;
    try {
        Db.addComment(userId, questId, comment);
        res.status(201).json({message: 'Comment added'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


