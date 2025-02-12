import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate,Link } from "react-router-dom";
import { signInWithGoogle } from "../../services/oauth";
import { getUserByEmail } from "../../services/db_requests";

 

const LoginPage = () => {
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const user = await getUserByEmail(email,password);
        if(user) {
            console.log("Login successful");
            console.log(JSON.stringify(user.user));
            localStorage.setItem('user', JSON.stringify(user.user));
            navigate('/app/home');
        } else {
            console.error("User not found");
            alert("User not found");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="lg:p-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2 text-left">
                        <h1 className="text-2xl font-semibold font-poppins tracking-tight">
                            Login to your account
                        </h1>
                        <p className="text-sm text-muted-foreground font-poppins">
                            Don&apos;t have an account?&nbsp;
                            <Link className="text-teal-700 hover:underline" to='/signup'>
                                Sign up for an account.
                            </Link>
                        </p>
                    </div>
                    <div className='grid gap-6'>
                        <form onSubmit={handleLogin}>
                            <div className='grid gap-3'>
                                <div className="grid gap-1">
                                    <label
                                        className="text-sm font-poppins font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1"
                                        htmlFor="email">Email</label>
                                    <input type="email"
                                           className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
                                           id="email" name="email"
                                           placeholder="name@example.com"
                                           autoCapitalize="none" autoComplete="email"
                                           autoCorrect="off" required />
                                </div>

                                <div className="grid gap-1">
                                    <label
                                        className="text-sm font-poppins font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1"
                                        htmlFor="password">Password</label>
                                    <input type="password"
                                           className="w-full border-2 rounded-xl p-2 mt-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
                                           id="password" name="password"
                                           autoCapitalize="none"
                                           autoCorrect="off" required />
                                </div>

                                <button
                                    className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
                                    Sign In with Email
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"></div>
                        <div className="relative flex justify-center text-xs uppercase"><span
                            className="bg-background px-2 text-muted-foreground font-poppins">Or continue with</span>
                        </div>
                    </div>

                    <button
                        className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
                        type="button" onClick={signInWithGoogle} disabled="">
                        <FontAwesomeIcon icon={faGoogle} className='me-4'/>
                        Sign in with Google
                    </button>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;

