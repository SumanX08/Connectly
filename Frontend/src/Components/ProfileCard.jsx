import {memo} from "react";


const ProfileCard = memo(({profile}) => {



  return (
    <div className="relative z-10 bg-gradient-to-tr from-purple-600 to-blue-700 p-[2px] hover:p-[3px] rounded-2xl md:w-full max-w-md mx-auto shadow-lg hover:shadow-2xl transition-all duration-300">
  <div className="bg-zinc-900 text-white rounded-2xl py-4 px-2">
        
        <div className="flex items-center mb-4">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="sm:w-32 sm:h-32 md:w-36 md:h-36 w-24 h-24 rounded-full object-cover border-2 border-white mr-4  text-center"
          />
          <div>
            <h2 className="text-md md:text-2xl font-bold">{profile.username}, <span className="font-normal text-gray-300">{profile.age}</span></h2>
            <p className="text-sm text-gray-300">{profile.location}</p>
          </div>
        </div>

        <div className="border border-zinc-700 rounded-xl px-3 py-2 mb-2">
          <h3 className="font-semibold text-gray-200  ">Bio</h3>
          <p className="text-sm text-gray-300">{profile.bio}</p>
        </div>

        <div className="border border-zinc-700 rounded-xl px-3 py-2 mb-2">
          <h3 className="font-semibold text-gray-200 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.skills?.map(skill => (
              <span key={skill} className="bg-purple-600 text-white px-3 py-1 md:py-2 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="border border-zinc-700 rounded-xl px-3 py-2">
          <h3 className="font-semibold text-gray-200 mb-2">Looking for</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.lookingFor?.map(skill => (
              <span key={skill} className="bg-blue-600 text-white px-3 py-1 md:py-2 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});



export default ProfileCard;
