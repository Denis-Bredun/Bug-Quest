import { Link } from "react-router-dom";

const GreetingPage = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="p-12 rounded-xl  w-full max-w-4xl text-center border-2 border-white shadow-md">
                <img src="/logo.ico" alt="Bug Quest Logo" className="mx-auto mb-6 w-64 h-64 " />
                <h1 className="text-5xl font-semibold text-teal-700 mb-6 font-poppins tracking-tight animate-bounce">
                    Welcome to Bug Quest!
                </h1>
                <p className="text-xl text-gray-800 mb-8 font-poppins">
                    Create virtual quests with interactive tasks! Use text, images, videos, and other elements for learning, entertainment, and team-building.
                </p>
                <div className="flex flex-col items-center">
    <div className="flex justify-center gap-8">
        <Link to="/signup" className="inline-flex items-center justify-center text-lg font-medium font-poppins border-2 rounded-xl p-2 pl-4 hover:border-teal-700 transition-colors duration-300 ease-in-out">
            Sign Up
        </Link>
        <Link to="/login" className="inline-flex font-poppins items-center justify-center text-lg font-medium border-2 rounded-xl p-4 pl-4 hover:border-teal-700 transition-colors duration-300 ease-in-out">
            Log In
        </Link>
    </div>
</div>
                </div>
        </div>
    );
};

export default GreetingPage;
