import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { 
  BookOpen, 
  Download, 
  Play, 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Star
} from 'lucide-react';

const Resources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources', count: 45 },
    { id: 'guides', name: 'Emergency Guides', count: 12 },
    { id: 'training', name: 'Training Materials', count: 8 },
    { id: 'videos', name: 'Video Tutorials', count: 15 },
    { id: 'documents', name: 'Documents', count: 6 },
    { id: 'tools', name: 'Planning Tools', count: 4 }
  ];

  const featuredResources = [
    {
      id: 1,
      title: "Complete Emergency Preparedness Guide",
      description: "Comprehensive 50-page guide covering all aspects of disaster preparedness for families and communities.",
      type: "guide",
      category: "guides",
      format: "PDF",
      size: "2.5 MB",
      downloads: 15420,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Disaster Response Training Course",
      description: "Interactive online course teaching essential disaster response skills and coordination techniques.",
      type: "course",
      category: "training",
      format: "Online",
      duration: "4 hours",
      downloads: 8930,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    }
  ];

  const resources = [
    {
      id: 3,
      title: "Earthquake Safety Checklist",
      description: "Step-by-step checklist for earthquake preparedness and response.",
      type: "checklist",
      category: "guides",
      format: "PDF",
      size: "500 KB",
      downloads: 12350,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      title: "First Aid Training Video Series",
      description: "Professional first aid training videos for emergency responders.",
      type: "video",
      category: "videos",
      format: "MP4",
      duration: "2.5 hours",
      downloads: 9870,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      title: "Community Emergency Plan Template",
      description: "Customizable template for creating community-specific emergency response plans.",
      type: "template",
      category: "tools",
      format: "DOCX",
      size: "1.2 MB",
      downloads: 6540,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 6,
      title: "Flood Response Procedures",
      description: "Detailed procedures for responding to flood emergencies and evacuations.",
      type: "procedure",
      category: "guides",
      format: "PDF",
      size: "800 KB",
      downloads: 7890,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 7,
      title: "Volunteer Coordinator Handbook",
      description: "Complete guide for managing volunteers during disaster response operations.",
      type: "handbook",
      category: "training",
      format: "PDF",
      size: "3.1 MB",
      downloads: 4320,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 8,
      title: "Emergency Communication Setup",
      description: "Video tutorial on setting up emergency communication systems.",
      type: "video",
      category: "videos",
      format: "MP4",
      duration: "45 minutes",
      downloads: 5670,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
      case 'checklist':
      case 'procedure':
      case 'handbook':
        return BookOpen;
      case 'video':
        return Play;
      case 'course':
        return Users;
      case 'template':
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
      case 'checklist':
      case 'procedure':
      case 'handbook':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'course':
        return 'bg-green-100 text-green-800';
      case 'template':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-black mb-6">
                Resources
              </h1>
              <p className="text-xl lg:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                Access comprehensive guides, training materials, and tools to enhance your disaster 
                preparedness and response capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Featured Resources</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div key={resource.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                    <div className="flex items-start space-x-4 mb-6">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{resource.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{resource.format}</span>
                        <span>{resource.size || resource.duration}</span>
                        <span>{resource.downloads.toLocaleString()} downloads</span>
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resource Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-8">All Resources</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div key={resource.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                    <div className="relative overflow-hidden">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs ml-1">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{resource.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{resource.format}</span>
                        <span>{resource.size || resource.duration}</span>
                        <span>{resource.downloads.toLocaleString()} downloads</span>
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
