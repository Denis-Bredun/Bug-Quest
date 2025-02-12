import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

const ExplorePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg p-10">
      <h2 className="font-poppins text-center text-2xl font-semibold">Profile View</h2>
      <button
          className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
          onClick={() => (window.location.href = "/")}
        >
          Return to the home page
        </button>

        <h2 className="font-poppins text-center text-2xl font-semibold mt-6">(UserName)'s Profile</h2>

        <div className="w-36 h-36 mx-auto mt-4 border-2 border-teal-700 rounded-full flex items-center justify-center bg-white overflow-hidden">
          <img id="preview" className="w-full h-full object-cover hidden" alt="Preview" />
        </div>

        <div className="font-poppins space-y-5 mt-6 text-center">
          <h5 className="text-lg font-medium">Rate:</h5>
          <p className="text-teal-700">User's e-mail: bububu@gmail.com</p>
          <p className="text-teal-700">Account nickname: 123</p>
          <p className="text-teal-700">Account description: meow</p>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
