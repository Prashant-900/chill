import React, { useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";  // Import useRouter for navigation

const AddFriendPopup = ({ isOpen, onClose, name }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null); // Changed to null for better checking
    const [usernotfound, setusernotfound] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const router = useRouter();  // Initialize useRouter

    const handleMouseDown = (e) => {
        if (e.target.closest(".draggable-header")) {
            setIsDragging(true);
            setOffset({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handlesearchuser = async () => {
        try {
            const response = await fetch(`/api/user?username=${searchQuery}`);
            if (!response.ok) {
                setSearchResults(null); // Reset search results if no user 
                setusernotfound(true);
                return;
            }
            setusernotfound(false);
            const userData = await response.json();
            setSearchResults(userData); // Update search results
        } catch (error) {
            console.error("Error:", error);
            setSearchResults(null); // Reset if there was an error
        }
    };

    const handleaddfreind = async (friendname) => {
        try {
            const response = await fetch(`/api/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ username: name, friendUsername: friendname }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error:", data.message);
                alert(data.message);
            } else {
                alert("Friend added successfully!");
                // Reload the page and redirect to the profile page
                window.location.reload();  // Force page reload
              
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    return isOpen ? (
        <div
            className="fixed z-[62] flex items-center justify-center min-h-screen w-full"
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div
                className="relative bg-white/70 backdrop-blur-lg rounded-lg shadow-lg w-11/12 max-w-md p-6 pt-0"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            >
                {/* Draggable Header */}
                <div
                    className="draggable-header p-4 pr-0 pl-0 rounded-t-lg text-white flex justify-between items-center"
                    onMouseDown={handleMouseDown}
                    style={{
                        cursor: isDragging ? "grabbing" : "grab",
                    }}
                >
                    <h2 className="text-xl font-semibold">Add a Friend</h2>
                    <button onClick={onClose} className="p-2 bg-pink-600 rounded-full hover:bg-pink-700">
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by name..."
                        className="w-full px-4 py-2 rounded-lg border-2 border-pink-300 text-pink-800 focus:outline-none focus:ring focus:ring-pink-300"
                    />
                    <Search
                        onClick={handlesearchuser}
                        className="absolute right-3 top-2.5 text-pink-500 cursor-pointer"
                    />
                </div>

                {/* Search Results */}
                <div className="space-y-3">
                    {searchResults && searchResults.username ? ( // Check if the searchResults object is valid and contains name
                        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-pink-200">
                            <div className="flex items-center gap-3">
                                <img
                                    src={searchResults.image}
                                    alt={searchResults.username}
                                    className="w-12 h-12 rounded-full border-2 border-pink-300"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-800">{searchResults.username}</h3>
                                </div>
                            </div>
                            <button onClick={() => handleaddfreind(searchResults.username)} className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2">
                                <UserPlus size={16} />
                            </button>
                        </div>
                    ) : (
                        usernotfound && (
                            <div className="text-center text-gray-500">No user found</div> // Display message if no user found
                        )
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default AddFriendPopup;
