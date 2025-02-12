import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faSignOutAlt, faTable} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {faDiscourse} from "@fortawesome/free-brands-svg-icons";

const sign_out = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
}

export const Sidebar = () => {
    console.log("Sidebar загружен");
    return (
        <div className={"flex flex-col w-64 border-r px-4"}>
            <div className="flex items-center h-20 border-b border-gray-300">
                <img src="/logo.ico" alt="Bug Icon" className="h-16 w-16 mr-2 ms-4"/>
                <span className="font-bold uppercase font-poppins text-start ps-2">Bug Quest</span>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 py-4">
                    <Link
                        to="/app/home"
                        className="flex items-center px-4 py-2 font-poppins text-gray-500 hover:text-gray-950 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-4'} icon={faHome}/>
                        Home
                    </Link>
                    <Link
                        to="/app/quizzes"
                        className="flex items-center px-4 py-2 font-poppins text-gray-500  hover:text-gray-950 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-4'} icon={faTable}/>
                        Quizzes
                    </Link>
                    <Link
                        to="/app/profiles"
                        className="flex items-center px-4 py-2 font-poppins text-gray-500  hover:text-gray-950 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-5'} icon={faDiscourse}/>
                        Explore
                    </Link>
                    <Link
                        to="/app/profile"
                        className="flex items-center px-4 py-2 font-poppins text-gray-500  hover:text-gray-950 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-5'} icon={faUser}/>
                        Profile
                    </Link>
                    <Link
                        to="/app/taskreview"
                        className="flex items-center px-4 py-2 font-poppins text-gray-500  hover:text-gray-950 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-5'} icon={faDiscourse}/>
                        Task review
                    </Link>
                </nav>

                <div className="py-4 border-t border-gray-300">
                    <button
                        className="flex items-center w-full px-4 py-2 font-poppins text-gray-500 hover:text-red-600 hover:bg-gray-200"
                        onClick={() => sign_out()}
                    >
                        <FontAwesomeIcon size={"1x"} className={'mr-4'} icon={faSignOutAlt}/>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}