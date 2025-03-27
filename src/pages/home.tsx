import React from 'react';
import { useNavigate } from 'react-router-dom';
import { accessElf } from '../utils/accessElf';

const Home = () => {
  const navigate = useNavigate();
  accessElf.track("home")

  const features = [
    {
      title: "Drag-and-Drop Interface",
      description: "Easily add, move, and connect workflow elements with intuitive drag-and-drop functionality"
    },
    {
      title: "Real-Time Updates",
      description: "See your changes instantly as you design and modify your workflows"
    },
    {
      title: "Visual Process Design",
      description: "Create clear, visual representations of your business processes and automation flows"
    },
    {
      title: "Whiteboard",
      description: "Use as a whiteboard to share ideas"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            WorkFlow Canvas
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create, visualize, and manage your workflows with an intuitive canvas interface
          </p>
          <button
            onClick={() => navigate('/workflow')}
            className="bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Open App
          </button>
        </div>
      </section>

      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
