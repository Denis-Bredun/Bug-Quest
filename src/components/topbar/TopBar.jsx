import { useEffect, useState } from "react";
import { fetchAvatarImage } from "../../services/db_requests";
import { useNavigate } from "react-router";

const TopBar = ({ routeName = "Home" }) => {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const navigate = useNavigate();

    const toProfile = async () => {
        navigate("/app/profile")
    }

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setUser(storedUser);
                
                if (storedUser.avatar_path) {
                    try {
                        const blob = await fetchAvatarImage(storedUser.avatar_path);
                        if (blob) {
                            const blobUrl = URL.createObjectURL(blob);
                            setAvatarUrl(blobUrl);
                        }
                    } catch (error) {
                        console.error("Error fetching avatar:", error);
                    }
                }
            }
        };

        fetchData();
    }, [user?.avatar_path]);

    useEffect(() => {
        console.log("Updated avatarUrl:", avatarUrl);
    }, [localStorage]);

    return (
        <div className="sticky top-0 z-40 flex items-center justify-between font-poppins h-24 bg-white border-b border-gray-200 px-6 shadow-md">
            <div className="flex items-center">
                <img src="/logo.ico" alt="Bug Icon" className="w-20 h-20" />
                <span className="font-bold uppercase text-2xl ps-4">Bug Quest</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-950">{routeName}</h1>
            <div className="flex items-center gap-4">
                {user?.username && (
                    <span className="text-gray-900 font-medium text-xl">{user.username}</span>
                )}
                <img
                    src={avatarUrl || ""}
                    alt="Profile"
                    onClick={toProfile}
                    className="h-16 w-16 rounded-full object-cover cursor-pointer"
                />
            </div>
        </div>
    );
};

export default TopBar;
