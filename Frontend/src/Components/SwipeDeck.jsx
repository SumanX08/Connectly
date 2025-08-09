import React from "react";
import ProfileCard from "./ProfileCard";
import { useState } from "react";


const profiles = [
    {
        name: "Elena Rodriguez",
        age: 26,
        about:"kjdhfa hdkafhk hsdlfhdskjafh hklahsdfkha aldhkahf hlkajdhfk klhfkahdf akjhfdkh akajsdhfk fakjdhfk ",
        location: "Brooklyn, NY",
        skills: ["UX Design", "Figma", "User Research"],
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Alex Tan",
        age: 28,
        about:"kjdhfa hdkafhk hsdlfhdskjafh hklahsdfkha aldhkahf hlkajdhfk klhfkahdf akjhfdkh akajsdhfk fakjdhfk ",
        location: "San Francisco, CA",
        skills: ["Backend", "Node.js", "MongoDB"],
        image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Priya Sharma",
        age: 25,
        about:"kjdhfa hdkafhk hsdlfhdskjafh hklahsdfkha aldhkahf hlkajdhfk klhfkahdf akjhfdkh akajsdhfk fakjdhfk ",
        location: "Delhi, India",
        skills: ["React", "UI Design", "TypeScript"],
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Pa Sharma",
        age: 25,
        about:"kjdhfa hdkafhk hsdlfhdskjafh hklahsdfkha aldhkahf hlkajdhfk klhfkahdf akjhfdkh akajsdhfk fakjdhfk ",
        location: "Delhi, India",
        skills: ["React", "UI Design", "TypeScript"],
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Suman Sharma",
        age: 25,
        about:"kjdhfa hdkafhk hsdlfhdskjafh hklahsdfkha aldhkahf hlkajdhfk klhfkahdf akjhfdkh akajsdhfk fakjdhfk ",
        location: "Delhi, India",
        skills: ["React", "UI Design", "TypeScript"],
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=400&h=400&q=80",
    },
];

const bgVariants = ["bg-zinc-900", "bg-zinc-700", "bg-gray-500"]

const SwipeDeck = () => {
    const [cards, setCards] = useState(profiles);

  const handleSwipe = () => {
    setCards(prev => prev.slice(1)); // remove top card
  };

  const visibleProfiles = cards.slice(0, 3);

    return (
        <div className="relative w-full h-[450px] max-w-3xl mx-auto">
            {visibleProfiles.map((profile, index) => {
                const z = visibleProfiles.length - index;
                const offset = index * 20;
                const bg = bgVariants[index] || "bg-zinc-700";

                return (
                    <div
                        key={index}
                        className={`absolute w-full transition-all duration-300 ${bg} rounded-2xl shadow-md`}
                        style={{
                            zIndex: z,
                            top: `${offset}px`,
                            right: `${offset}px`,
                        }}
                    >
                <ProfileCard {...profile} onSwipe={handleSwipe} />
                    </div>
    );
})}
        </div >
    );
};

export default SwipeDeck;
