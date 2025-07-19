import React from 'react';
import { Header } from '../components/Layout';
import { Award, Users, Target, Mail, Linkedin, Twitter } from 'lucide-react';

interface LeadershipMember {
  name: string;
  position: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
}

const leadershipTeam: LeadershipMember[] = [
  {
    name: "Dr. Sarah Chen",
    position: "Executive Director",
    bio: "Dr. Chen brings over 15 years of experience in disaster management and international humanitarian response. She has led emergency response operations across Southeast Asia and holds a PhD in Crisis Management.",
    email: "s.chen@gdrc.org",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Michael Rodriguez",
    position: "Operations Director",
    bio: "Michael oversees all field operations and coordinates with local emergency services. His background includes 12 years with international relief organizations and expertise in logistics management.",
    email: "m.rodriguez@gdrc.org",
    linkedin: "#"
  },
  {
    name: "Dr. Aung Kyaw",
    position: "Regional Coordinator - Myanmar",
    bio: "Dr. Kyaw leads our Myanmar operations and community outreach programs. He has extensive experience in disaster preparedness and has worked with local communities for over 10 years.",
    email: "a.kyaw@gdrc.org",
    linkedin: "#"
  },
  {
    name: "Lisa Thompson",
    position: "Technology Director",
    bio: "Lisa heads our technology initiatives and platform development. She has a background in emergency communication systems and has developed several award-winning disaster response applications.",
    email: "l.thompson@gdrc.org",
    twitter: "#"
  }
];

const Leadership: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg">
                <Award size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Leadership Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated professionals who guide our mission to build resilient communities 
              and coordinate effective disaster response worldwide.
            </p>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20">
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-blue-600 font-semibold text-sm">{member.position}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="flex space-x-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors duration-300"
                      >
                        <Mail size={16} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors duration-300"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors duration-300"
                      >
                        <Twitter size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <div className="flex justify-center mb-6">
              <Target size={48} className="text-blue-200" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Leadership Philosophy</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              We believe in collaborative leadership that empowers communities, embraces innovation, 
              and maintains the highest standards of transparency and accountability in everything we do. 
              Our diverse team brings together expertise from emergency management, technology, 
              community development, and international relations to create comprehensive solutions 
              for disaster preparedness and response.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
