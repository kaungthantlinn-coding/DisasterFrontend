import React, { useState } from 'react';
import { 
  Heart, 
  Shield, 
  CheckCircle, 
  ExternalLink, 
  Phone, 
  Mail, 
  MessageCircle,
  Users,
  Target,
  Globe,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  DollarSign,
  CreditCard,
  Smartphone,
  QrCode,
  Star,
  Building,
  Calendar,
  AlertCircle,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Activity,
  Calendar as CalendarIcon,
  MapPin as LocationIcon,
  Upload,
  FileText,
  User,
  MessageSquare
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const verifiedOrganizations = [
  {
    id: 1,
    name: "Myanmar Red Cross Society",
    logo: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&h=200&fit=crop&crop=center",
    mission: "Providing emergency medical aid and disaster relief across Myanmar",
    description: "The Myanmar Red Cross Society has been at the forefront of humanitarian response in Myanmar for over 70 years. We provide critical medical aid, emergency response, and disaster relief services to communities across the country. Our trained volunteers and medical professionals work tirelessly to save lives and alleviate suffering during times of crisis.",
    verified: true,
    totalDonated: "$2,450,000",
    donorCount: 15420,
    lastUpdated: "2024-01-15",
    donationUrl: "https://redcross.org.mm/donate",
    categories: ["Medical Aid", "Emergency Response", "Disaster Relief"],
    impact: "Helped 50,000+ families in 2023",
    founded: "1950",
    location: "Yangon, Myanmar",
    website: "https://redcross.org.mm",
    achievements: [
      "Responded to 150+ emergency situations in 2023",
      "Trained 5,000+ community volunteers",
      "Distributed medical supplies to 200+ health facilities"
    ],
    programs: [
      "Emergency Medical Response",
      "Disaster Preparedness Training",
      "Blood Donation Services",
      "Community Health Programs"
    ]
  },
  {
    id: 2,
    name: "World Vision Myanmar",
    logo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=200&h=200&fit=crop&crop=center",
    mission: "Child-focused humanitarian organization working in disaster-affected communities",
    description: "World Vision Myanmar is dedicated to working with children, families, and communities to overcome poverty and injustice. We focus on child protection, education, and emergency relief, ensuring that every child has the opportunity to experience life in all its fullness.",
    verified: true,
    totalDonated: "$1,890,000",
    donorCount: 12350,
    lastUpdated: "2024-01-14",
    donationUrl: "https://worldvision.org.mm/donate",
    categories: ["Child Protection", "Education", "Emergency Relief"],
    impact: "Supporting 35,000+ children nationwide",
    founded: "1988",
    location: "Yangon, Myanmar",
    website: "https://worldvision.org.mm",
    achievements: [
      "Built 50+ schools in rural communities",
      "Provided clean water access to 100,000+ people",
      "Supported 15,000+ children through sponsorship programs"
    ],
    programs: [
      "Child Sponsorship",
      "Education Support",
      "Clean Water Projects",
      "Emergency Response"
    ]
  },
  {
    id: 3,
    name: "Save the Children Myanmar",
    logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop&crop=center",
    mission: "Protecting children's rights and providing emergency assistance",
    description: "Save the Children Myanmar works to ensure every child has the right to survival, protection, development and participation. We deliver immediate and lasting improvements to children's lives worldwide through our emergency response and development programs.",
    verified: true,
    totalDonated: "$1,650,000",
    donorCount: 9870,
    lastUpdated: "2024-01-13",
    donationUrl: "https://savethechildren.org.mm/donate",
    categories: ["Child Welfare", "Education", "Health"],
    impact: "Reached 28,000+ children in crisis",
    founded: "1995",
    location: "Yangon, Myanmar",
    website: "https://savethechildren.org.mm",
    achievements: [
      "Provided education to 20,000+ out-of-school children",
      "Delivered healthcare services to 50,000+ children",
      "Established 30+ child-friendly spaces"
    ],
    programs: [
      "Child Protection Services",
      "Education Programs",
      "Health and Nutrition",
      "Emergency Response"
    ]
  },
  {
    id: 4,
    name: "UNICEF Myanmar",
    logo: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&h=200&fit=crop&crop=center",
    mission: "Working for every child's right to survival, development, and protection",
    description: "UNICEF Myanmar works in partnership with the Government and civil society to ensure that every child in Myanmar survives, learns and is protected from violence, exploitation and abuse. We advocate for children's rights and provide life-saving assistance during emergencies.",
    verified: true,
    totalDonated: "$3,200,000",
    donorCount: 18900,
    lastUpdated: "2024-01-16",
    donationUrl: "https://unicef.org.mm/donate",
    categories: ["Child Rights", "Health", "Education", "Emergency"],
    impact: "Protecting 75,000+ children's futures",
    founded: "1950",
    location: "Yangon, Myanmar",
    website: "https://unicef.org.mm",
    achievements: [
      "Vaccinated 500,000+ children against preventable diseases",
      "Provided learning materials to 100,000+ students",
      "Supported 25,000+ children with disabilities"
    ],
    programs: [
      "Child Health and Nutrition",
      "Education for All",
      "Child Protection",
      "Water, Sanitation and Hygiene"
    ]
  },
  {
    id: 5,
    name: "Médecins Sans Frontières",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center",
    mission: "Providing medical humanitarian aid in emergency situations",
    description: "Médecins Sans Frontières (MSF) provides medical humanitarian aid to people affected by conflict, epidemics, disasters, or exclusion from healthcare. Our teams are made up of medical professionals, logistical experts, and administrative staff who work together to deliver quality medical care.",
    verified: true,
    totalDonated: "$2,100,000",
    donorCount: 11200,
    lastUpdated: "2024-01-12",
    donationUrl: "https://msf.org.mm/donate",
    categories: ["Medical Aid", "Emergency Medicine", "Healthcare"],
    impact: "Treated 40,000+ patients in 2023",
    founded: "1971",
    location: "International",
    website: "https://msf.org.mm",
    achievements: [
      "Operated 15+ medical facilities",
      "Performed 5,000+ surgical procedures",
      "Provided mental health support to 10,000+ people"
    ],
    programs: [
      "Emergency Medical Care",
      "Surgical Services",
      "Mental Health Support",
      "Epidemic Response"
    ]
  },
  {
    id: 6,
    name: "Oxfam Myanmar",
    logo: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=center",
    mission: "Fighting poverty and injustice through emergency response and development",
    description: "Oxfam Myanmar works with communities to tackle poverty and injustice. We provide emergency response during crises and support long-term development programs that help people build better lives for themselves and their families.",
    verified: true,
    totalDonated: "$1,750,000",
    donorCount: 8650,
    lastUpdated: "2024-01-11",
    donationUrl: "https://oxfam.org.mm/donate",
    categories: ["Water & Sanitation", "Food Security", "Emergency Response"],
    impact: "Provided clean water to 60,000+ people",
    founded: "1942",
    location: "Yangon, Myanmar",
    website: "https://oxfam.org.mm",
    achievements: [
      "Built 200+ water systems in rural areas",
      "Supported 30,000+ farmers with agricultural training",
      "Provided emergency aid to 80,000+ people"
    ],
    programs: [
      "Water and Sanitation",
      "Food Security",
      "Livelihoods Support",
      "Emergency Response"
    ]
  }
];

const Donate: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>('');
  
  // Payment slip upload and donor form states
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [donorAmount, setDonorAmount] = useState<string>('');
  const [referenceNote, setReferenceNote] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['All', 'Medical Aid', 'Child Protection', 'Emergency Response', 'Education', 'Water & Sanitation'];
  const regions = ['All', 'Yangon', 'Mandalay', 'Naypyidaw', 'Shan State', 'Kachin State', 'International'];

  // Payment handling functions
  const generatePaymentReference = () => {
    return 'TGF' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentReference(generatePaymentReference());
    setShowQRCode(true);
    // In a real implementation, this would generate actual QR codes for each payment method
  };

  const generateQRCodeData = (method: string, amount: number, reference: string) => {
    // This would generate real QR code data for each payment method
    const baseData = {
      method,
      amount,
      reference,
      merchant: 'TrustGiveFlow Foundation',
      timestamp: new Date().toISOString()
    };
    
    switch(method) {
      case 'wavepay':
        return `wavepay://pay?amount=${amount}&reference=${reference}&merchant=TrustGiveFlow`;
      case 'kbzpay':
        return `kbzpay://transfer?amount=${amount}&ref=${reference}&to=TrustGiveFlow`;
      case 'cbpay':
        return `cbpay://payment?amt=${amount}&ref=${reference}&payee=TrustGiveFlow`;
      default:
        return JSON.stringify(baseData);
    }
  };

  const copyPaymentLink = (method: string) => {
    const qrData = generateQRCodeData(method, donationAmount, paymentReference);
    navigator.clipboard.writeText(qrData);
    alert('Payment link copied to clipboard!');
  };

  // File upload handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only image files (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setPaymentSlip(file);
    }
  };

  // Form submission
  const handleFormSubmission = async () => {
    if (!paymentSlip) {
      alert('Please upload a payment slip');
      return;
    }
    
    if (!donorName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!donorAmount.trim()) {
      alert('Please enter the donation amount');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setShowConfirmation(true);
        
        // Reset form
        setPaymentSlip(null);
        setDonorName('');
        setDonorAmount('');
        setReferenceNote('');
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  // Generate actual QR code data for display
  const generateActualQRCode = (method: string) => {
    const qrData = generateQRCodeData(method, donationAmount, paymentReference);
    // In a real implementation, you would use a QR code library like qrcode.js
    // For now, we'll return a placeholder SVG
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="20" height="20" fill="black"/>
        <rect x="60" y="20" width="20" height="20" fill="black"/>
        <rect x="100" y="20" width="20" height="20" fill="black"/>
        <rect x="140" y="20" width="20" height="20" fill="black"/>
        <rect x="20" y="60" width="20" height="20" fill="black"/>
        <rect x="100" y="60" width="20" height="20" fill="black"/>
        <rect x="180" y="60" width="20" height="20" fill="black"/>
        <rect x="60" y="100" width="20" height="20" fill="black"/>
        <rect x="140" y="100" width="20" height="20" fill="black"/>
        <rect x="20" y="140" width="20" height="20" fill="black"/>
        <rect x="100" y="140" width="20" height="20" fill="black"/>
        <rect x="180" y="140" width="20" height="20" fill="black"/>
        <rect x="60" y="180" width="20" height="20" fill="black"/>
        <rect x="140" y="180" width="20" height="20" fill="black"/>
        <text x="100" y="195" text-anchor="middle" font-size="8" fill="gray">${method.toUpperCase()}</text>
      </svg>
    `)}`;
  };

  const filteredOrganizations = verifiedOrganizations.filter(org => {
    const matchesCategory = selectedCategory === 'All' || org.categories.includes(selectedCategory);
    const matchesRegion = selectedRegion === 'All' || org.location.includes(selectedRegion);
    const matchesKeyword = searchKeyword === '' || 
      org.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      org.mission.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      org.description.toLowerCase().includes(searchKeyword.toLowerCase());
    
    return matchesCategory && matchesRegion && matchesKeyword;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedRegion, searchKeyword]);

  const totalDonated = verifiedOrganizations.reduce((sum, org) => {
    return sum + parseInt(org.totalDonated.replace(/[$,]/g, ''));
  }, 0);

  const totalDonors = verifiedOrganizations.reduce((sum, org) => sum + org.donorCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              TrustGiveFlow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 drop-shadow-sm">
              အလှူရှင်များနှင့် အကူအညီလိုအပ်သူများကို ချိတ်ဆက်ပေးသော ယုံကြည်စိတ်ချရသော ပလပ်ဖောင်း
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">100+</div>
                <div className="text-blue-200 drop-shadow-sm">အတည်ပြုပြီး အဖွဲ့အစည်းများ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">$5M+</div>
                <div className="text-blue-200 drop-shadow-sm">စုစုပေါင်း အလှူငွေ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">5000+</div>
                <div className="text-blue-200 drop-shadow-sm">အလှူရှင်များ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Organizations Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">အတည်ပြုပြီး အဖွဲ့အစည်းများ</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ကျွန်ုပ်တို့၏ စစ်ဆေးပြီး အတည်ပြုထားသော အဖွဲ့အစည်းများမှတစ်ဆင့် လုံခြုံစိတ်ချရစွာ အလှူပေးနိုင်ပါသည်။
              </p>
            </div>

            {/* Streamlined Filter Section */}
            <div className="relative mb-12">
              {/* Single Row Filter Layout */}
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  
                  {/* Search Input */}
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="အဖွဲ့အစည်းအမည် သို့မဟုတ် ရည်ရွယ်ချက်ဖြင့် ရှာဖွေပါ..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      {searchKeyword && (
                        <button
                          onClick={() => setSearchKeyword('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Icon */}
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[140px]"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Region Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 whitespace-nowrap">
                    အတည်ပြုပြီး အဖွဲ့အစည်းများ
                  </button>
                </div>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {currentOrganizations.map((org) => (
                <div 
                  key={org.id} 
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  style={{
                    minHeight: '500px',
                    maxHeight: '500px'
                  }}
                >
                  {/* Organization Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={org.logo} 
                      alt={org.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Verified Badge */}
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                    
                    {/* Organization Name Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                        {org.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-white/90 text-xs">
                        <LocationIcon className="w-3 h-3" />
                        <span>{org.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Mission */}
                    <div className="mb-3">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {org.mission}
                      </p>
                    </div>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center p-2.5 bg-blue-50 rounded-lg">
                        <div className="font-bold text-base text-blue-600">{org.totalDonated}</div>
                        <div className="text-xs text-blue-500">Total Raised</div>
                      </div>
                      <div className="text-center p-2.5 bg-green-50 rounded-lg">
                        <div className="font-bold text-base text-green-600">{org.donorCount.toLocaleString()}</div>
                        <div className="text-xs text-green-500">Supporters</div>
                      </div>
                    </div>

                    {/* Impact Statement */}
                    <div className="mb-4 p-2.5 bg-purple-50 rounded-lg border border-purple-100 flex-1">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">2023 Impact</span>
                      </div>
                      <p className="text-xs text-purple-600 font-medium">{org.impact}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrganization(org)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                      
                      <a
                        href={org.donationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-1 shadow-md hover:shadow-lg text-sm"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Donate</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isCurrentPage = page === currentPage;
                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                    const isFirstOrLast = page === 1 || page === totalPages;
                    
                    if (!isNearCurrentPage && !isFirstOrLast) {
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          isCurrentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-6 text-gray-600">
              <p className="text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
                {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchKeyword) && (
                  <span className="ml-1">
                    (filtered from {verifiedOrganizations.length} total)
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">လွန်ခဲ့သော အလှူများ</h2>
              <p className="text-lg text-gray-600">
                ကျွန်ုပ်တို့၏ ပွင့်လင်းမြင်သာမှုနှင့် တိုးတက်မှုများကို ကြည့်ရှုပါ
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">$12.1M</div>
                <div className="text-gray-600">စုစုပေါင်း အလှူငွေ</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">71,837</div>
                <div className="text-gray-600">အလှူရှင်များ</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">250,000+</div>
                <div className="text-gray-600">အကူအညီရရှိသူများ</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">လတ်တလော လှုပ်ရှားမှုများ</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Anonymous Donor</div>
                      <div className="text-sm text-gray-600">Myanmar Red Cross Society သို့ အလှူပေးခဲ့သည်</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">$500</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">John Smith</div>
                      <div className="text-sm text-gray-600">UNICEF Myanmar သို့ အလှူပေးခဲ့သည်</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">$250</div>
                    <div className="text-xs text-gray-500">5 hours ago</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Save the Children Myanmar သို့ အလှူပေးခဲ့သည်</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">$1,000</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Direct Donation Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform မှတစ်ဆင့် လှူဒါန်းမှု</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ကျွန်ုပ်တို့၏ ပလပ်ဖောင်းမှတစ်ဆင့် တိုက်ရိုက် အလှူပေးနိုင်ပြီး အကူအညီလိုအပ်သူများထံ လုံခြုံစွာ ရောက်ရှိစေနိုင်ပါသည်။
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ဆက်သွယ်ရန် အချက်အလက်များ</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">ဖုန်းခေါ်ဆိုမှု</h4>
                      <p className="text-gray-600">+95 9 123 456 789</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">အီးမေးလ်</h4>
                      <p className="text-gray-600">donate@trustgiveflow.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">တိုက်ရိုက် စကားပြောခန်း</h4>
                      <p className="text-gray-600">24/7 အကူအညီ ရရှိနိုင်ပါသည်</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                >
                  {showContactForm ? 'လှူဒါန်းမှု ပုံစံကို ဖျောက်ရန်' : 'တိုက်ရိုက် လှူဒါန်းရန်'}
                </button>
              </div>



              {/* Payment Methods */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ငွေပေးချေမှု နည်းလမ်းများ</h3>
                
                <div className="space-y-6">
                  {/* Bank Transfer */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      ဘဏ်လွှဲငွေ
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>ဘဏ်အမည်:</strong> KBZ Bank</p>
                      <p><strong>အကောင့်နံပါတ်:</strong> 123-456-789-012</p>
                      <p><strong>အကောင့်အမည်:</strong> TrustGiveFlow Foundation</p>
                    </div>
                  </div>

                  {/* Mobile Money */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-6 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-green-600" />
                      မိုဘိုင်းငွေ - QR ကုဒ်နှင့် ဖုန်းနံပါတ်များ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Wave Pay */}
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg p-2 shadow-sm">
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-yellow-600" />
                          </div>
                        </div>
                        <div className="font-bold text-yellow-700 text-lg mb-2">Wave Pay</div>
                        <div className="text-sm text-gray-600">09-123-456-789</div>
                      </div>

                      {/* KBZ Pay */}
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg p-2 shadow-sm">
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-blue-600" />
                          </div>
                        </div>
                        <div className="font-bold text-blue-700 text-lg mb-2">KBZ Pay</div>
                        <div className="text-sm text-gray-600">09-987-654-321</div>
                      </div>

                      {/* CB Pay */}
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg p-2 shadow-sm">
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-purple-600" />
                          </div>
                        </div>
                        <div className="font-bold text-purple-700 text-lg mb-2">CB Pay</div>
                        <div className="text-sm text-gray-600">09-555-666-777</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Upload Form */}
                  {/* Payment Upload Form Removed as requested */}

                  {/* QR Code Modal */}
                  {showQRCode && selectedPaymentMethod && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                        <button
                          onClick={() => setShowQRCode(false)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {selectedPaymentMethod === 'wavepay' && 'Wave Pay'}
                            {selectedPaymentMethod === 'kbzpay' && 'KBZ Pay'}
                            {selectedPaymentMethod === 'cbpay' && 'CB Pay'}
                            {' '}ငွေပေးချေမှု
                          </h3>
                          
                          {/* QR Code Display */}
                          <div className="w-48 h-48 mx-auto mb-4 bg-white border-2 border-gray-200 rounded-lg p-4">
                            <img 
                              src={generateActualQRCode(selectedPaymentMethod)} 
                              alt="Payment QR Code" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          {/* Payment Details */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">ပမာဏ:</span>
                                <span className="font-medium">{donationAmount.toLocaleString()} ကျပ်</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">ရည်ညွှန်းနံပါတ်:</span>
                                <span className="font-medium">{paymentReference}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">လက်ခံသူ:</span>
                                <span className="font-medium">TrustGiveFlow Foundation</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <button
                              onClick={() => copyPaymentLink(selectedPaymentMethod)}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                            >
                              ငွေပေးချေမှု လင့်ခ် ကူးယူရန်
                            </button>
                            <button
                              onClick={() => {
                                // In real implementation, this would open the respective payment app
                                const appUrl = generateQRCodeData(selectedPaymentMethod, donationAmount, paymentReference);
                                window.open(appUrl, '_blank');
                              }}
                              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm text-white ${
                                selectedPaymentMethod === 'wavepay' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                selectedPaymentMethod === 'kbzpay' ? 'bg-blue-500 hover:bg-blue-600' :
                                'bg-purple-500 hover:bg-purple-600'
                              }`}
                            >
                              {selectedPaymentMethod === 'wavepay' && 'Wave Pay'}
                              {selectedPaymentMethod === 'kbzpay' && 'KBZ Pay'}
                              {selectedPaymentMethod === 'cbpay' && 'CB Pay'}
                              {' '}အက်ပ်ဖွင့်ရန်
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirmation Modal */}
                  {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center">
                          {/* Success Icon */}
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ!
                          </h3>
                          
                          <p className="text-gray-600 mb-6">
                            သင့်ငွေပေးချေမှုအထောက်အထားကို လက်ခံရရှိပါပြီ။ ကျွန်ုပ်တို့မှ စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။
                          </p>
                          
                          {/* Submission Details */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <h4 className="font-medium text-gray-900 mb-3">တင်သွင်းထားသော အချက်အလက်များ</h4>
                            <div className="space-y-2 text-sm">
                              {donorName && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">လှူဒါန်းသူ:</span>
                                  <span className="font-medium">{donorName}</span>
                                </div>
                              )}
                              {donorAmount && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">ပမာဏ:</span>
                                  <span className="font-medium">{parseInt(donorAmount).toLocaleString()} ကျပ်</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">ဖိုင်:</span>
                                <span className="font-medium">{paymentSlip?.name}</span>
                              </div>
                              {referenceNote && (
                                <div className="pt-2 border-t border-gray-200">
                                  <span className="text-gray-600 block mb-1">မှတ်ချက်:</span>
                                  <span className="font-medium text-sm">{referenceNote}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                setShowConfirmation(false);
                                // Reset form
                                setPaymentSlip(null);
                                setDonorName('');
                                setDonorAmount('');
                                setReferenceNote('');
                              }}
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              အိုကေ
                            </button>
                            <button
                              onClick={() => {
                                setShowConfirmation(false);
                                // Navigate to donations page or show more info
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                            >
                              အခြားလှူဒါန်းမှုများ ကြည့်ရန်
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </div>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  တိုက်ရိုက် လှူဒါန်းမှု
                </h3>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      လှူဒါန်းသူအမည် *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="သင့်အမည်ကို ရိုက်ထည့်ပါ"
                      required
                    />
                  </div>
                  

                  

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      အလှူပမာဏ
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="အလှူပမာဏ ကို ရိုက်ထည့်ပါ (အနည်းဆုံး ၁၀၀၀ ကျပ်)"
                      min="1000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ငွေပေးချေမှုနည်းလမ်း *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required>
                      <option value="">ငွေပေးချေမှုနည်းလမ်းကို ရွေးချယ်ပါ</option>
                      <option value="bank">ဘဏ်လွှဲ</option>
                      <option value="kbzpay">KBZ Pay</option>
                      <option value="cbpay">CB Pay</option>
                      <option value="wavepay">Wave Pay</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ငွေပေးချေမှုအထောက်အထား *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">ငွေပေးချေမှုအထောက်အထားကို ရွေးချယ်ပါ</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="payment-proof"
                        required
                      />
                      <label
                        htmlFor="payment-proof"
                        className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        ဖိုင်ရွေးချယ်ရန်
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF ဖိုင်များ လက်ခံသည် (အများဆုံး 5MB)
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      နှစ်သက်သော အဖွဲ့အစည်းများ
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">အဖွဲ့အစည်းကို ရွေးချယ်ပါ</option>
                      {verifiedOrganizations.map((org) => (
                        <option key={org.id} value={org.name}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      မှတ်ချက် (ရွေးချယ်ရန်)
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="လှူဒါန်းမှုနှင့်ပတ်သက်သော မှတ်ချက်များ ရိုက်ထည့်ပါ"
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                    >
လှူဒါန်းမှု တင်သွင်းရန်
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ယုံကြည်မှုနှင့် လုံခြုံရေး</h2>
              <p className="text-lg text-gray-600">
                သင့်အလှူငွေများ လုံခြုံစွာ ရောက်ရှိစေရန် ကျွန်ုပ်တို့ အာမခံပါသည်
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">အတည်ပြုပြီး မိတ်ဖက်များ</h3>
                <p className="text-gray-600">
                  ကျွန်ုပ်တို့၏ အဖွဲ့အစည်းများအားလုံးကို စစ်ဆေးပြီး အတည်ပြုထားပါသည်
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">အချိန်နှင့်တပြေးညီ ခြေရာခံခြင်း</h3>
                <p className="text-gray-600">
                  သင့်အလှူငွေများ မည်သို့အသုံးပြုသည်ကို အချိန်နှင့်တပြေးညီ ကြည့်ရှုနိုင်ပါသည်
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% ပွင့်လင်းမြင်သာမှု</h3>
                <p className="text-gray-600">
                  အလှူငွေများ၏ အသုံးပြုမှုကို အပြည့်အဝ ပွင့်လင်းစွာ ဖော်ပြပါသည်
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Organization Detail Modal */}
      {selectedOrganization && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img 
                src={selectedOrganization.logo} 
                alt={selectedOrganization.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedOrganization(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Organization Name */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>အတည်ပြုပြီး</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedOrganization.name}
                </h2>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-1">
                    <LocationIcon className="w-4 h-4" />
                    <span>{selectedOrganization.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Founded {selectedOrganization.founded}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Mission & Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mission & Vision</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {selectedOrganization.description}
                </p>
              </div>

              {/* Impact Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{selectedOrganization.totalDonated}</div>
                  <div className="text-sm text-blue-500 font-medium">Total Donations</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{selectedOrganization.donorCount.toLocaleString()}</div>
                  <div className="text-sm text-green-500 font-medium">Active Donors</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{selectedOrganization.founded}</div>
                  <div className="text-sm text-purple-500 font-medium">Year Founded</div>
                </div>
              </div>

              {/* Programs */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrganization.programs.map((program: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{program}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {selectedOrganization.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOrganization.categories.map((category: string, index: number) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a 
                      href={selectedOrganization.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Last Updated: {selectedOrganization.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedOrganization(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-medium transition-colors duration-200"
                >
                  Close
                </button>
                <a
                  href={selectedOrganization.donationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-5 h-5" />
                  <span>Donate Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Donate;