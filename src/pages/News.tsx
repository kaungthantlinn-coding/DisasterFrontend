import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Filter,
  Search,
  Globe,
  AlertTriangle,
  Users,
  Award
} from 'lucide-react';

const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All News', count: 24 },
    { id: 'emergency', name: 'Emergency Response', count: 8 },
    { id: 'community', name: 'Community Stories', count: 6 },
    { id: 'technology', name: 'Technology Updates', count: 5 },
    { id: 'partnerships', name: 'Partnerships', count: 3 },
    { id: 'awards', name: 'Awards & Recognition', count: 2 }
  ];

  const featuredNews = [
    {
      id: 1,
      title: "DisasterWatch Responds to Major Earthquake in Southeast Asia",
      excerpt: "Our rapid response team coordinated with local authorities to provide immediate assistance to over 10,000 affected residents.",
      category: "emergency",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "New AI-Powered Early Warning System Launches",
      excerpt: "Revolutionary technology can predict natural disasters up to 72 hours in advance, giving communities crucial time to prepare.",
      category: "technology",
      date: "2024-01-12",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    }
  ];

  const regularNews = [
    {
      id: 3,
      title: "Community Heroes: Volunteers Save Lives During Flash Flood",
      excerpt: "Local volunteers used our platform to coordinate rescue efforts, saving 50+ people from rising waters.",
      category: "community",
      date: "2024-01-10",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      title: "Partnership with Global Relief Organization Announced",
      excerpt: "Strategic alliance will expand our reach to 50 additional countries and improve response capabilities.",
      category: "partnerships",
      date: "2024-01-08",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      title: "DisasterWatch Wins Innovation Award at Global Summit",
      excerpt: "Recognition for our groundbreaking approach to community-driven disaster response and management.",
      category: "awards",
      date: "2024-01-05",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 6,
      title: "Mobile App Update Brings Enhanced Offline Capabilities",
      excerpt: "New features allow users to report emergencies and access critical information even without internet connection.",
      category: "technology",
      date: "2024-01-03",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 7,
      title: "Training Program Graduates 1,000th Emergency Responder",
      excerpt: "Milestone achievement in our mission to build local capacity for disaster response worldwide.",
      category: "community",
      date: "2024-01-01",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 8,
      title: "Real-Time Data Integration Improves Response Times by 40%",
      excerpt: "Advanced analytics and machine learning help emergency teams make faster, more informed decisions.",
      category: "technology",
      date: "2023-12-28",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return AlertTriangle;
      case 'community': return Users;
      case 'technology': return Globe;
      case 'awards': return Award;
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'community': return 'bg-blue-100 text-blue-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'partnerships': return 'bg-green-100 text-green-800';
      case 'awards': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-black mb-6">
                Latest News
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Stay updated with the latest developments in disaster response, community stories, 
                and technological innovations from DisasterWatch.
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
                  placeholder="Search news..."
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

        {/* Featured News */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Featured Stories</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => {
                const CategoryIcon = getCategoryIcon(article.category);
                return (
                  <article key={article.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl mb-6">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
                    
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Regular News */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Recent Updates</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map((article) => {
                const CategoryIcon = getCategoryIcon(article.category);
                return (
                  <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          <CategoryIcon className="w-3 h-3 mr-1" />
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{article.excerpt}</p>
                      
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
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

export default News;
