import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Link } from "react-router";
import { signInWithGoogle } from "../../services/oauth";
import {createUserEmailAuth, fetchAvatarImage, updateAvatarPath, uploadAvatar} from "../../services/db_requests";

const SignUpPage = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleEmailSignUp = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.target);
        const nickname = formData.get("name").trim();
        const email = formData.get("email").trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        const nicknamePattern = /^[A-Za-z][A-Za-z0-9_]{2,}$/;
        if (!nicknamePattern.test(nickname)) {
            setError("Invalid nickname! It must be at least 3 characters long, start with a letter, and contain only English letters, numbers, and underscores.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Invalid email format!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            let res = await createUserEmailAuth(nickname, email, password);
            setSuccess("Account created successfully!");

            let user = {
                id_User: res,
                username: nickname,
                Hascode_password: password,
                Email: email,
                Description: null,
                avatar_path: null,
                Rating: 0,
            };

            console.log(user);
            const defaultAvatarUrl = '/default_profile_avatar.jpg';
            const response = await fetch(defaultAvatarUrl);
            const blob = await response.blob();
            const defaultAvatarFile = new File([blob], "default_profile_avatar.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append('image', defaultAvatarFile);

            const image = await uploadAvatar(formData);
            const imageName = image.replace("/uploads/", "");

            await updateAvatarPath(user.id_User, imageName);
            user.avatar_path = imageName;
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/app/home");
        } catch (err) {
            setError("Registration failed. Try again.");
            console.error("Error creating user:", err);
            navigate('/signup');
        }
    };


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="lg:p-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2 text-left">
                        <h1 className="text-2xl font-semibold font-poppins tracking-tight">
                            Sign Up for an account
                        </h1>
                        <p className="text-sm text-muted-foreground font-poppins">
                            Already have an account?&nbsp;
                            <Link className="text-teal-700 hover:underline" to="/login">
                                Sign in.
                            </Link>
                        </p>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-teal-700">{success}</p>}
                    <div className='grid gap-6'>
                        <form onSubmit={handleEmailSignUp}>
                            <div className='grid gap-3'>
                                <div className="grid gap-1">
                                    <label className="text-sm font-poppins font-medium leading-none py-1" htmlFor="name">
                                        Username
                                    </label>
                                    <input type="text" className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out" id="name" name="name" placeholder="username123" required />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-poppins font-medium leading-none py-1" htmlFor="email">
                                        Email
                                    </label>
                                    <input type="email" className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out" id="email" name="email" placeholder="name@example.com" required />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-poppins font-medium leading-none py-1" htmlFor="password">
                                        Password
                                    </label>
                                    <input type="password" className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out" id="password" name="password" required />
                                </div>
                                <div className="grid gap-1">
                                    <label className="text-sm font-poppins font-medium leading-none py-1" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input type="password" className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out" id="confirmPassword" name="confirmPassword" required />
                                </div>
                                <button className="w-full mt-2 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
                                    Sign Up with Email
                                </button>
                                <div className="relative py-4">
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground font-poppins">Or continue with</span>
                                    </div>
                                </div>
                                <button onClick={signInWithGoogle} className="w-full font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
                                    <FontAwesomeIcon icon={faGoogle} className='me-4' />
                                    Sign Up with Google
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
