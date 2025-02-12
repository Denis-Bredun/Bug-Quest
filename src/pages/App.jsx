import {Routes, Route, Navigate, BrowserRouter} from "react-router";
import LoginPage from "./login/LoginPage.jsx";
import SignUpPage from "./signup/SignUpPage.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import Callback from "../callback/Callback.jsx";
import QuestView from "./quest_view/QuestView.jsx";
import GreetingPage from "./greeting/GreetingPage.jsx";
import TaskReviewPage from "./taskreview/TaskReviewPage.jsx";
import NotFoundPage from "../pages/not_found_page/NotFoundPage.jsx";
import QuizzCompletionPage from "../pages/quizzes/QuizzCompletionPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GreetingPage />} />

                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>

                <Route path="/app/*" element={<AppLayout/>}/>

                <Route path="/app" element={<Navigate to="/app/home"/>}/>

                <Route path="*" element={<NotFoundPage />} />
                <Route path="/app/quest_view/:questId" element={<QuestView />} />
                <Route path="/app/quest_completation/:userId/:questId" element={<QuizzCompletionPage/>}/>
                <Route path="callback" element={<Callback/>}/>
                <Route path="/taskreview" element={<TaskReviewPage/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default App;
