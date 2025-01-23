"use client";
import Profile from "./ui/profie";
import { useEffect, useState } from "react"; // Removed useRef
import Backgorund from "./ui/backgorund";
import ProfileIcon from "./ui/component/profileicon";
import Login from "./ui/login";
import Signup from "./ui/signup";
import Sendmessage from "./ui/component/sendmessage";
import Messagepopup from "./ui/component/showmessages";

export default function Home() {
  const [token, setToken] = useState(null);
  const [friends, setFriends] = useState([]);
  const [animateProfile, setAnimateProfile] = useState(false);
  const [where, setWhere] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [showprofile, setshowprofile] = useState(false);
  const [userdata, setuserdata] = useState(null);
  const [showmessgae, setshowmessgae] = useState(false);

  // Fetch user details on initial load
  useEffect(() => {
    async function getUserDetails(username) {
      try {
        const response = await fetch(`/api/user?username=${username}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching user:", errorData.message);
          return;
        }
        const userData = await response.json();
        setuserdata(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Fetch userdata only if token is set
    if (token && !userdata) {
      getUserDetails(token);
    }
  }, [token, userdata]);

  // Set token from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
    setIsCheckingToken(false);
  }, []);

  // Fetch friends only when userdata is loaded and has friends
  useEffect(() => {
    if (userdata && userdata.friends && userdata.friends.length > 0) {
      const fetchFriends = async () => {
        try {
          const response = await fetch("/api/getFriends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernames: userdata.friends }),
          });

          if (response.ok) {
            const friendsData = await response.json();
            setFriends(friendsData);
          } else {
            console.error("Failed to fetch friends");
          }
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriends();
    }
  }, [userdata]);

  const handleProfileToggle = () => {
    if (!showprofile) {
      setshowprofile(true);
      setTimeout(() => setAnimateProfile(true), 50);
    } else {
      setAnimateProfile(false);
      setTimeout(() => setshowprofile(false), 600);
    }
  };

  const handleSwitch = () => setWhere(!where);

  const handleRemoveFriend = (friendUsername) => {
    console.log(friendUsername);
    if (userdata && userdata.friends) {
      // Filter out the friend being removed
      const updatedFriends = userdata.friends.filter(friend => friend.username !== friendUsername);
      setuserdata(prevData => ({
        ...prevData,
        friends: updatedFriends,  // Update the friends list in userdata
      }));
    }
  };

  const handleremovemessage = async (messageId) => {
    try {
      const response = await fetch("/api/deletemessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: token, messageId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setuserdata(prevData => ({
          ...prevData,
          messages: prevData.messages.filter(message => message._id !== messageId),
        }));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (isCheckingToken) return null;

  return (
    <>
      <Backgorund open={()=>setshowmessgae(true)}/>
      <Sendmessage friends={friends} own={userdata}/>
      {showmessgae && <Messagepopup
          images={userdata?.messages?.[0]?.image || []}
          text={userdata?.messages?.[0]?.text || ""}
          onClose={() => {
            setshowmessgae(false);
            handleremovemessage(userdata?.messages?.[0]?._id);
          }}
          userimage={userdata?.messages?.[0]?.userimage}
          username={userdata?.messages?.[0]?.username}
        />}
      {!token ? (
        <div className="fixed top-1/2 left-1/2 min-w-full transform -translate-x-1/2 -translate-y-1/2 z-50">
          {where ? (
            <Login toSignup={handleSwitch} settoken={setToken} />
          ) : (
            <Signup toLogin={handleSwitch} settoken={setToken} />
          )}
        </div>
      ) : (
        <ProfileIcon click={handleProfileToggle} />
      )}
      {showprofile && (
        <div className="fixed z-[60] inset-0 flex items-center justify-center  backdrop-blur-sm">
          <div
            className={`relative w-full flex items-center justify-center transform transition-transform duration-700 ease-out ${animateProfile ? "translate-x-0" : "translate-x-full"}`}
          >
            <Profile name={token} userdata={userdata} friends={friends} setFriends={setFriends} onremovefriend={handleRemoveFriend} />
          </div>
        </div>
      )}
    </>
  );
}
