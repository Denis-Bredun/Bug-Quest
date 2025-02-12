import {BottomBar} from "../components/bottombar/BottomBar.jsx";
import TopBar from "../components/topbar/TopBar.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import HomePage from "../pages/home/HomePage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import ExplorePage from "../pages/explore/ExplorePage.jsx";
import CreateQuest_page from "../pages/create/CreateQuest.tsx";
import TaskReviewPage from "../pages/taskreview/TaskReviewPage.jsx"

const AppLayout = () => {
    const location = useLocation();

    const routeNames = {
        "/app/home": "Home",
        "/app/quizzes": "Quizzes",
        "/app/profile": "Profile",
        "/app/profiles": "Explore",
        "/app/create": "New Quiz",
        "/app/taskreview": "Task Review"
    };

    const currentRouteName = routeNames[location.pathname] || "Home";

    return (
        <div className={'flex h-screen'}>
            <BottomBar/>
            <div className={'flex flex-col flex-1 overflow-y-auto'}>
                <TopBar routeName={currentRouteName}/>
                <div className={'flex-1 overflow-y-auto'}>
                    <Routes>
                        <Route path="home" element={<HomePage/>}/>
                        {/* <Route path="quizzes" element={<QuizzCompletionPage/>}/> */}
                        <Route path="profile" element={<ProfilePage/>}/>
                        <Route path="profiles" element={<ExplorePage/>}/>
                        <Route path="create" element={<CreateQuest_page/>}/>
                        <Route path="taskreview" element={<TaskReviewPage/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
