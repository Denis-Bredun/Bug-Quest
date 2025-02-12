import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {updateAvatarPath, uploadAvatar, verifyAndCreateUser} from '../services/db_requests';
import { getUserInfo } from '../services/oauth';


const Callback = () => { 
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token'); 

        if (token) {
            console.log('Access token:', token);
            localStorage.setItem('access_token', token);

            
            getUserInfo(token).then(async userInfo => {
                if (userInfo) {
                    const { username, email } = userInfo;

                    const response = await verifyAndCreateUser({ username, email });
                    console.log("Callback response:", response.id);

                    if(!isNaN(response.id)){
                        //getU
                    } else {
                        console.log(response);
                        if(response.avatar_path == null){
                            const defaultAvatarUrl = '/default_profile_avatar.jpg';
                            const responsee = await fetch(defaultAvatarUrl);
                            const blob = await responsee.blob();
                            const defaultAvatarFile = new File([blob], "default_profile_avatar.jpg", { type: blob.type });

                            const formData = new FormData();
                            formData.append('image', defaultAvatarFile);

                            const image = await uploadAvatar(formData);
                            const imageName = image.replace("/uploads/", "");

                            await updateAvatarPath(response.id_User, imageName);
                            response.avatar_path = imageName;
                        }

                        localStorage.setItem("user", JSON.stringify(response));
                    }

                    navigate('/app/home');
                        
                } else {
                    console.error('Error: User info not found');
                    navigate('/login');
                }
            }).catch((error) => {
                console.error('Error fetching user info:', error);
                navigate('/login');
            });

        } else {
            console.error('Error: No access token found');
            navigate('/login'); 
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;
