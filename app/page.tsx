import React from 'react';
import UserProfileCard from './components/UserProfileCard';
import CreatePostCard from './components/CreatePostCard';

export default function Home() {
  const myProfileData = {
    profileImageSrc: "/hanan-pic.jpg",
    dreamJob: "Software Engineer",
    networks: "Mindanao State University - Iligan Institute of Technology (MSU-IIT)",
    currentCity: "Iligan City, Lanao Del Norte, Philippines",
  };

  return (
    <div className="py-4 px-6 min-h-screen bg-white">
      {/* Page Header */}
      <div className="rounded-lg py-3 px-5 bg-[#3B82F6] text-lg font-bold text-white mb-2">
        Wall
      </div>

      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Profile */}
        <div className="w-full lg:w-1/4">
          <UserProfileCard
            profileImageSrc={myProfileData.profileImageSrc}
            dreamJob={myProfileData.dreamJob}
            networks={myProfileData.networks}
            currentCity={myProfileData.currentCity}
          />
        </div>

        {/* Right: Create Post */}
        <div className="w-full lg:flex-1">
          <CreatePostCard />
        </div>
      </div>
    </div>
  );
}
