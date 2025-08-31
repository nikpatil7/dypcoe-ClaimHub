import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // In a real application, this would send data to a backend endpoint
    // This is a simulated API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      //to send email
    emailjs.sendForm('service_2cpr4er','template_agh0n2s',e.target,'T3iiHRgOkAe50F-ub');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }

    
      };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions about a lost item or need help with the platform? Reach out to our team and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
            <FaPhone className="text-2xl" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Phone</h3>
          <p className="text-gray-600">
            Lost & Found Office: 020-12345678<br />
            Security Department: 020-87654321
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
            <FaEnvelope className="text-2xl" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Email</h3>
          <p className="text-gray-600">
            lostandfound@dypcoe.edu<br />
            security@dypcoe.edu
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 mb-4 mx-auto">
            <FaMapMarkerAlt className="text-2xl" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
          <p className="text-gray-600">
            D. Y. Patil Educational Complex,<br />
            Sector 29, Nigdi Pradhikaran,<br />
            Akurdi, Pune 411044.<br />
          </p>
        </div>
      </div>   

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Your Name*</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2" name='email'>Your Email*</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Your E-mail"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2" name="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Query about a lost item"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message*</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </div>
          
          <div className="md:w-1/2 bg-blue-50 p-8 flex items-center justify-center">
            <div className="h-full w-full">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Office Hours</h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-2"><strong>Monday to Friday:</strong> 9:00 AM - 5:00 PM</p>
                <p className="text-gray-600 mb-2"><strong>Saturday:</strong> 10:00 AM - 2:00 PM</p>
                <p className="text-gray-600"><strong>Sunday:</strong> Closed</p>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Emergency Contact</h3>
              <p className="text-gray-600">
                For urgent matters related to lost valuable items, please contact the campus security directly at:
              </p>
              <p className="font-medium text-blue-800 mt-2">+91 98765 43210</p>
              
              <div className="w-full md:w-1/2 h-64">
  <div className="h-full w-full bg-gray-200 rounded overflow-hidden relative">
    <iframe
      title="DYPCOE Pune Exact Location"
      className="absolute inset-0 w-full h-full"
      frameBorder="0"
      style={{ border: 0 }}
      src="https://www.google.com/maps?q=18.457551,73.850844&hl=es;z=14&output=embed"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;