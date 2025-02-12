import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const sign_out = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
};

export const BottomBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 h-24 flex items-center justify-center shadow-md">
            <button
                className="flex items-center gap-3 px-6 py-4 text-2xl font-poppins text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out rounded-2xl"
                onClick={sign_out}
            >
                <FontAwesomeIcon className="h-7 w-7 text-gray-500" icon={faSignOutAlt} />
                <span>Sign Out</span>
            </button>
        </div>
    );
};
