import React from 'react'

function Preview() {
 
    return (
    <section className="bg-gray-900/50 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Take a Sneak Peek 👀</h2>
        <p className="text-gray-400 text-lg mb-12">
          Experience how easy it is to discover collaborators, swipe through profiles, and start building your next big thing — right from your screen.
        </p>

        {/* Preview Box */}
        <div className="bg-[#0e0e0e] border border-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Placeholder Profile Preview */}
            <div className="w-full md:w-1/2">
              <img
                src="https://via.placeholder.com/400x300?text=Swipe+Interface+Preview"
                alt="Preview"
                className="rounded-lg shadow"
              />
            </div>

            {/* Textual Description or CTA */}
            <div className="w-full md:w-1/2 text-left space-y-4">
              <h3 className="text-2xl font-semibold">Match with real collaborators</h3>
              <p className="text-gray-400">
                Profiles are tailored to show you the right people. No noise — just meaningful connections based on your skills and goals.
              </p>
              <button className="mt-4 bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200 font-medium transition">
                Try It Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default Preview