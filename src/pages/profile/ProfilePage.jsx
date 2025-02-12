import  { useEffect, useState } from "react";
import {  updateNickname,updateProfileDescription,fetchAvatarImage,uploadAvatar, updateAvatarPath } from "../../services/db_requests.js"; 

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [newNickname, setNewNickname] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);


  
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      const avatarPath = storedUser?.avatar_path;
      console.log("Avatar path use effect:", avatarPath);
      if (avatarPath) {
        const blob = await fetchAvatarImage(avatarPath);
        console.log("Blob:", blob);
        
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          setAvatarUrl(blobUrl); 
        }
      }
    };

    fetchData();
  }, [user?.avatar_path]); 


useEffect(() => {
  console.log("Updated avatarUrl:", avatarUrl);
}, [avatarUrl]);

  const handleNicknameChange = async () => {
    const nicknamePattern = /^[A-Za-z][A-Za-z0-9_]{2,}$/;

    if (!newNickname.trim()) {
      console.error("You can't set an empty nickname");
      alert("You can't set an empty nickname. Try again.");
      return;
    }

    if (!nicknamePattern.test(newNickname)) {
      console.error("Invalid nickname format");
      alert("Nickname must be at least 3 characters long, start with a letter, and contain only English letters, numbers, and underscores.");
      return;
    }

    if (user) {
      await updateNickname(user.id_User, newNickname);
      user.username = newNickname;
      localStorage.setItem("user", JSON.stringify(user));
      console.log(JSON.parse(localStorage.getItem("user")));
      setUser(JSON.parse(localStorage.getItem("user")));

      window.location.reload();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedImage);
  
    try {
      
      const image = await uploadAvatar(formData);

      console.log("Image uploaded:", image);
      const imageName = image.replace("/uploads/", "");
      console.log("Image name:", imageName);

      await updateAvatarPath(user.id_User, imageName);
      user.avatar_path = imageName;
      localStorage.setItem("user", JSON.stringify(user));
      const response = await fetchAvatarImage(imageName);
      if (response) {
        const blobUrl = URL.createObjectURL(response);
        setAvatarUrl(blobUrl);
        user.avatar_path = imageName;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };
  
  const handleDescriptionChange = async () => {
    if (user) {
      const response = await updateProfileDescription(user.id_User, newDescription);
        user.Description = newDescription
        localStorage.setItem("user", JSON.stringify(user));
        console.log(JSON.parse(localStorage.getItem("user")));
        setUser(JSON.parse(localStorage.getItem("user")));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  
      <div className="mx-auto lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg p-10">
      <button
          className="w-full mb-5 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
          onClick={() => (window.location.href = "/app/home")}
        >
          Return to the home page
        </button>
        <h2 className="font-poppins text-center text-2xl font-semibold">Account settings</h2>
        <div className="flex flex-col items-center">
  <div className="w-36 h-36 mx-auto mt-4 border-2 border-teal-700 rounded-full flex items-center justify-center bg-white overflow-hidden">
    {avatarUrl && (
      <img
        id="preview"
        className="w-full h-full object-cover"
        alt="Preview"
        src={avatarUrl}
      />
    )}
  </div>
</div>


        {user && (
          <>
            <p className="text-teal-700 font-poppins text-xl mt-8 block text-center">
              Account e-mail: {user.Email}
            </p>

            <p className="text-teal-700 font-poppins text-xl mt-8 block text-center">
              Account nickname: {user.username}
            </p>
            <input
              className="font-poppins flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
            <button onClick={handleNicknameChange} className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
              Update nickname
            </button>

            <p className="text-teal-700 font-poppins text-xl mt-8 block text-center">
              Account description: {user.Description}
            </p>
            <input
              className="font-poppins flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button onClick={handleDescriptionChange} className="w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out">
              Update description
            </button>
            <p className="text-teal-700 font-poppins text-xl mt-8 block text-center">
  Upload Profile Image:
</p>
            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="w-full border-2 rounded-xl p-2 mt-4"
            />
<button 
  onClick={handleImageUpload} 
  className="mb-8 w-full mt-4 font-poppins border-2 rounded-xl p-2 hover:border-teal-700 transition-colors duration-300 ease-in-out"
>
  Upload Image
</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
