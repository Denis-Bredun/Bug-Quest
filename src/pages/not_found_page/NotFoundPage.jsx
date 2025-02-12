import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-poppins text-teal-500">404</h1>
                <p className="mt-4 text-xl text-gray-600 font-poppins">Page Not Found</p>
                <p className="mt-2 text-sm text-gray-500 font-poppins">Oops! The page you're looking for doesn't exist.</p>
            </div>
            <button
                onClick={() => navigate("/home")}
                className="mt-8 flex items-center gap-2 bg-teal-500 rounded-xl px-[14px] py-[8px] hover:bg-teal-600 text-white">
                <FontAwesomeIcon className="h-4 w-4 text-white" icon={faHome} />
                <span className="font-poppins">Go to Home</span>
            </button>
        </div>
    );
};

export default NotFoundPage;
