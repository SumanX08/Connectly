import React,{memo} from "react";


const ProfileCard = memo(({profile}) => {



  return (
    <div className={`relative z-10 bg-zinc-900 border-gray-500 border-2 hover:border-none bg-gradient-to-tr from-purple-600 to-blue-700  hover:p-1 rounded-2xl w-full max-w-md mx-auto shadow-lg transition-all duration-300  hover:shadow-2xl `}>
  <div className="bg-zinc-900 text-white rounded-2xl py-4 px-2 ">
        
        {/* Top: Image + Name */}
        <div className="flex items-center mb-4">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="w-40 h-40 rounded-full object-cover border-4 border-white mr-4  text-center"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.username}, <span className="font-normal text-gray-300">{profile.age}</span></h2>
            <p className="text-sm text-gray-300">{profile.location}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="border border-zinc-700 rounded-xl px-3 py-2 mb-2">
          <h3 className="font-semibold text-gray-200 mb-">Bio</h3>
          <p className="text-sm text-gray-300">{profile.bio}</p>
        </div>

        {/* Skills */}
        <div className="border border-zinc-700 rounded-xl px-3 py-2 mb-2">
          <h3 className="font-semibold text-gray-200 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.skills?.map(skill => (
              <span key={skill} className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div className="border border-zinc-700 rounded-xl px-3 py-2">
          <h3 className="font-semibold text-gray-200 mb-2">Looking for</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.lookingFor?.map(skill => (
              <span key={skill} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
