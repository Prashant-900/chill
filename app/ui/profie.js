import { UserPlus, Heart, Mail, UserMinus } from "lucide-react";
import AddFriendPopup from "./component/addfriendpopup";
import { useState, memo } from "react";
import History from "./history";

const Profile = memo(({ userdata,friends,setFriends }) => {

    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [showhistory, setshowhistory] = useState(false);
    const [historydata, sethistorydata] = useState([])
    const handlelogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
    const currentUserId = userdata.username;
    
    

    const handleAddFriendOpen = () => setIsAddFriendOpen(true);
    const handleAddFriendClose = () => setIsAddFriendOpen(false);

    const handleshowhistory = (friendUsername) => {
        userdata.history.map((entry) => {
            if (entry.from === friendUsername || entry.to === friendUsername) {
                sethistorydata((prev) => [...prev, entry]);
            }
        });
        setshowhistory(true);
    };


    const handleRemoveFriend = async (friendUsername) => {
        try {
            const response = await fetch("/api/removeFriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: userdata.username,  // Logged-in user's username
                    friendUsername,
                }),
            });
    
            if (response.ok) {
                // Update the friends list after successful removal using function-based setState
                setFriends((prevFriends) =>
                    prevFriends.filter((friend) => friend.username !== friendUsername)
                );
                alert("Friend removed successfully!");
            } else {
                alert("Failed to remove friend.");
            }
        } catch (error) {
            console.error("Error removing friend:", error);
            alert("An error occurred while removing the friend.");
        }
    };

    return (
        <>
            {showhistory && <History sethistorydata={sethistorydata} currentUserId={currentUserId} historyData={historydata} setshowhistory={setshowhistory} />}
            <AddFriendPopup
                name={userdata.username}
                isOpen={isAddFriendOpen}
                onClose={handleAddFriendClose}
            />
            <div className="p-8 w-full max-w-4xl relative">
                {/* Logout button */}
                <button
                    onClick={handlelogout}
                    className="absolute z-[60] top-10 right-10 p-2 bg-red-600/60 text-white rounded-lg hover:bg-red-600 backdrop-blur-sm transition-all duration-300"
                >
                    <span>Logout</span>
                </button>

                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 flex items-center gap-6 shadow-lg">
                    {/* Profile Section */}
                    <div className="relative">
                        <img
                            src={userdata.image}
                            alt="Profile"
                            className="rounded-full w-32 h-32 object-cover border-4 border-pink-200"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2 shadow-md">
                            <Heart size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2 text-pink-800">
                            {userdata.username}
                        </h1>
                        <button
                            onClick={handleAddFriendOpen}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 flex items-center gap-2 transition-all duration-300"
                        >
                            <UserPlus size={20} />
                            Add Friend
                        </button>
                    </div>
                </div>

                {/* Friends Section */}
                <div className="bg-white/80 backdrop-blur-sm mt-6 rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-pink-800 mb-4">Friends</h2>
                    <div className="space-y-4">
                        {friends.map((friend, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-pink-200 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={friend.image}
                                        alt={friend.username}
                                        className="w-12 h-12 rounded-full border-2 border-pink-200"
                                    />
                                    <div>
                                        <h3 className="font-medium text-xl text-gray-800">
                                            {friend.username}
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={()=>handleshowhistory(friend.username)} className="p-2 rounded-lg bg-pink-100 hover:bg-pink-200 transition-all duration-200">
                                        <Mail size={16} className="text-pink-500" />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFriend(friend.username)} // Call a function to handle removal
                                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200"
                                    >
                                        <UserMinus size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
});

export default Profile;
