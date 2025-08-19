import { Link } from "react-router-dom";


const CallToActionSection = () => {
  return (
    <section className="bg-gray-900/50 text-white py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to Find Your <br /> Next Collaborator?
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Join thousands of creators, developers, and entrepreneurs who are already
          building amazing things together.
        </p>
        <Link to='/signup'>
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Get Started
          </button>
          </Link>
          
      
      </div>
    </section>
  );
};

export default CallToActionSection;
