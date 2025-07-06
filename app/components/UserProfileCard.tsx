import React from 'react';
import Image from 'next/image'; 

interface UserProfileCardProps {
    profileImageSrc: string; 
    dreamJob: string;
    networks: string; 
    currentCity: string; 
}

export const  UserProfileCard: React.FC<UserProfileCardProps> = ({ profileImageSrc, dreamJob, networks, currentCity }) => {
    return (
        <div className="flex flex-col mt-4 rounded-lg bg-white">

            {/* Profile Image */}
            <div className="w-full">
                <Image
                    src={profileImageSrc}
                    alt={`Profile pic`}
                    width={250}
                    height={300}
                    className="w-full h-auto object-cover pb-8"
                />
            </div>

            {/* User Info */}
            <div className="flex flex-col border-r-2 border-gray-200">
                <div className='py-2 w-full border-t-2 border-blue-300 bg-blue-100'>
                    <p className='pl-3 font-semibold'>Information</p>
                </div>

                <div className="flex flex-col mt-3 text-gray-600 text-sm space-y-1 pl-3">
                    <div>
                        <p className="text-base text-gray-400">Dream Job</p>
                        <p className='font-semibold'>{dreamJob}</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-400">Networks</p>
                        <p className='font-semibold'>{networks}</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-400">Current City</p>
                        <p className='font-semibold'>{currentCity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
