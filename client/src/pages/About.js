import React from 'react';
import { FaUniversity, FaInfo, FaHandsHelping, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">About Lost & Found - DYPCOE College</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our platform is designed to connect students who have lost their belongings with those who have found them, streamlining the lost and found process at D. Y. Patil College of Engineering.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
            <FaUniversity className="text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To create a hassle-free environment where lost items find their way back to their rightful owners quickly and efficiently. We aim to reduce the stress and inconvenience caused by losing personal belongings on campus.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
            <FaInfo className="text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">How It Works</h2>
          <ol className="text-gray-600 list-decimal pl-5 space-y-2">
            <li>Found items are submitted to security guards at designated locations.</li>
            <li>Security guards log in and upload item details with images and categories.</li>
            <li>Students browse or search for their lost items on the platform.</li>
            <li>To claim an item, students fill the claim form with their details.</li>
            <li>Student reaches out to the security department to claim the item.</li>
            <li>Security guards verify the claim and return the item to the student.</li>
            
          </ol>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Our Team</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
          The Lost & Found service is managed by DYPCOE College's security department in collaboration with the student welfare committee. Our dedicated team works tirelessly to ensure lost items are returned to their owners.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
              <FaHandsHelping className="text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Security Department</h3>
            <p className="text-gray-600 text-sm">
              Manages the physical lost and found office, verifies student identities, and handles item storage and retrieval.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
              <FaHandsHelping className="text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Student Welfare Committee</h3>
            <p className="text-gray-600 text-sm">
              Promotes the service among students and collects feedback to improve the platform.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
              <FaHandsHelping className="text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Tech Team</h3>
            <p className="text-gray-600 text-sm">
              Maintains and updates the platform to ensure smooth operation and user-friendly experience.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Visit Us</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="bg-blue-50 p-6 rounded-lg max-w-md">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-blue-800 text-xl mr-2" />
              <h3 className="font-semibold">Lost & Found Office</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Located at the Security Office near the Main Gate
              <br />
              D. Y. Patil College of Engineering, Pune.
              <br />
              Sector 29, Nigdi Pradhikaran,
              <br />
              Akurdi, Pune 411044.
            </p>
            <p className="text-gray-600">
              <strong>Office Hours:</strong> Monday - Saturday, 9:00 AM - 5:00 PM
              <br />
              <strong>Contact:</strong> 020-27653054
            </p>
          </div>
          <div className="w-full md:w-1/2 h-64">
        <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center relative">
    
    <iframe
      title="DYPCOE AKURDI Exact Location"
      className="absolute inset-0 w-full h-full rounded"
      frameBorder="0"
      style={{ border: 0 }}
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2311.9453408068907!2d73.75695437168173!3d18.645783608261848!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9f02f4b8f47%3A0x994b7c247d09fde!2sD.%20Y.%20Patil%20International%20University!5e0!3m2!1sen!2sus!4v1753816432928!5m2!1sen!2sus"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>
          
        </div>
      </div>
    </div>
  );
};

export default About;