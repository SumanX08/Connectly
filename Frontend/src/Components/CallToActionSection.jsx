const CallToActionSection = () => {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to Find Your <br /> Next Collaborator?
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Join thousands of creators, developers, and entrepreneurs who are already
          building amazing things together.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Get Started Free →
          </button>
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
