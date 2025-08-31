




// "use client"

// import type React from "react"
// import { useNavigate } from "react-router-dom"

// import { useState, useEffect } from "react"
// import { OrganizationService } from "../services/organizationService"
// import type { OrganizationDto } from "../types/Organization"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
// import { Button } from "../components/ui/button"
// import { Building2, Globe, Mail, Calendar, ExternalLink, Loader2, AlertCircle, Users, MapPin } from "lucide-react"



// const Organization: React.FC = () => {
//   const [organizations, setOrganizations] = useState<OrganizationDto[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrganizations()
//   }, [])

//   const fetchOrganizations = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const data = await OrganizationService.getAll()
//       setOrganizations(data)
//     } catch (err) {
//       setError("Failed to load organizations. Please try again later.")
//       console.error("Error fetching organizations:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "N/A"
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const handleWebsiteClick = (url?: string) => {
//     if (url) {
//       const formattedUrl = url.startsWith("http") ? url : `https://${url}`
//       window.open(formattedUrl, "_blank", "noopener,noreferrer")
//     }
//   }

//   const handleEmailClick = (email?: string) => {
//     if (email) {
//       window.location.href = `mailto:${email}`
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//             <Building2 className="w-6 h-6 text-blue-800 absolute top-3 left-1/2 -translate-x-1/2" />
//           </div>
//           <p className="text-gray-600 text-lg mt-2">Loading organizations...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <Button onClick={fetchOrganizations} className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
//             Try Again
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6 ring-4 ring-blue-100/50">
//             <Building2 className="w-12 h-12 text-blue-600" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
//             Partner Organizations
//           </h1>
//           <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
//             Discover the organizations working together to make a difference in disaster response and community support.
//           </p>
//         </div>

//         {/* Organizations Grid */}
//         {organizations.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6 ring-2 ring-gray-100">
//               <Building2 className="w-12 h-12 text-gray-300" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-600 mb-4">No organizations available</h3>
//             <p className="text-gray-500 text-lg">
//               Organizations will appear here once they are added by administrators.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {organizations.map((org) => (
//               <Card
//                 key={org.id}
//                 className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-md bg-white hover:-translate-y-2 overflow-hidden"
//               >
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

//                 <CardHeader className="pb-6 pt-7">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-4 mb-3">
//                         {org.logoUrl ? (
//                           <img
//                             src={org.logoUrl || "/placeholder.svg"}
//                             alt={`${org.name} logo`}
//                             className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement
//                               target.style.display = "none"
//                             }}
//                           />
//                         ) : (
//                           <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                             <Building2 className="w-8 h-8 text-white" />
//                           </div>
//                         )}
//                         <div className="flex-1 min-w-0">
//                           <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 truncate">
//                             {org.name}
//                           </CardTitle>

//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0">
//                   {org.description && (
//                     <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">
//                       {org.description}
//                     </CardDescription>
//                   )}

//                   <div className="space-y-3">
//                     {org.websiteUrl && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleWebsiteClick(org.websiteUrl)}
//                         className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 py-3 group/btn"
//                       >
//                         <Globe className="w-5 h-5 mr-3" />
//                         <span>Visit Website</span>
//                         <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
//                       </Button>
//                     )}

//                     {org.contactEmail && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleEmailClick(org.contactEmail)}
//                         className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 py-3"
//                       >
//                         <Mail className="w-5 h-5 mr-3" />
//                         Contact
//                       </Button>
//                     )}

//                     {org.id === 6 && (
//                       <Button
//                         variant="outline"
//                         className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
//                         onClick={() => navigate(`/donate/${org.id}`)}
//                       >
//                         Donate
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Stats */}
//         <div className="mt-16 text-center">
//           <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
//             <Building2 className="w-5 h-5 text-blue-600 mr-3" />
//             <span className="text-blue-800 font-semibold text-base">
//               {organizations.length} organization{organizations.length !== 1 ? "s" : ""} available
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Organization




"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { OrganizationService } from "../services/organizationService"
import type { OrganizationDto } from "../types/Organization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Building2, Globe, Mail, Calendar, ExternalLink, Loader2, AlertCircle, Users, MapPin, X, Phone, Heart, Shield, Target } from "lucide-react"
import { useNavigate } from "react-router-dom";

const Organization: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>(null)
  const [detailViewOpen, setDetailViewOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await OrganizationService.getAll()
      setOrganizations(data)
    } catch (err) {
      setError("Failed to load organizations. Please try again later.")
      console.error("Error fetching organizations:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleWebsiteClick = (url?: string) => {
    if (url) {
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`
      window.open(formattedUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleEmailClick = (email?: string) => {
    if (email) {
      window.location.href = `mailto:${email}`
    }
  }

  const handleViewDetails = (org: OrganizationDto) => {
    setSelectedOrg(org)
    setDetailViewOpen(true)
  }

  const closeDetailView = () => {
    setDetailViewOpen(false)
    setSelectedOrg(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <Building2 className="w-6 h-6 text-blue-800 absolute top-3 left-1/2 -translate-x-1/2" />
          </div>
          <p className="text-gray-600 text-lg mt-2">Loading organizations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchOrganizations} className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6 ring-4 ring-blue-100/50">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Partner Organizations
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the organizations working together to make a difference in disaster response and community support.
          </p>
        </div>

        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg mb-6 ring-2 ring-gray-100">
              <Building2 className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No organizations available</h3>
            <p className="text-gray-500 text-lg">
              Organizations will appear here once they are added by administrators.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-md bg-white hover:-translate-y-2 overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(org)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                <CardHeader className="pb-6 pt-7">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl || "/placeholder.svg"}
                            alt={`${org.name} logo`}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 truncate">
                            {org.name}
                          </CardTitle>
                        </div>

                        {/* Donate Button ကို ညာဘက်အခြမ်းမှာထားခြင်း */}
                        {org.id === 6 && (
                          <Button
                            variant="default"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/donate/${org.id}`);
                            }}
                          >
                            Donate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {org.description && (
                    <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">
                      {org.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">


                    {org.websiteUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWebsiteClick(org.websiteUrl);
                        }}
                        className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 py-3 group/btn"
                      >
                        <Globe className="w-5 h-5 mr-3" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      </Button>
                    )}


                    {org.contactEmail && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmailClick(org.contactEmail);
                        }}
                        className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 py-3"
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        Contact
                      </Button>


                    )}

                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(org);
                      }}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white py-3"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <Building2 className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-blue-800 font-semibold text-base">
              {organizations.length} organization{organizations.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>
      </div>

      {/* Detail View Overlay */}
      {detailViewOpen && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDetailView}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-shrink-0">
                  {selectedOrg.logoUrl ? (
                    <img
                      src={selectedOrg.logoUrl}
                      alt={`${selectedOrg.name} logo`}
                      className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-100 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedOrg.name}</h1>



                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Disaster Response
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Community Support
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      Humanitarian Aid
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedOrg.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    About Us
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedOrg.description}</p>
                </div>
              )}

              {/* Mission Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide immediate and effective disaster response services to communities in crisis,
                  ensuring that aid reaches those who need it most in their time of greatest need.
                </p>
              </div>



              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrg.contactEmail && (
                    <Button
                      variant="outline"
                      onClick={() => handleEmailClick(selectedOrg.contactEmail)}
                      className="justify-start text-gray-700 h-12"
                    >
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      <span>{selectedOrg.contactEmail}</span>
                    </Button>
                  )}

                  {selectedOrg.websiteUrl && (
                    <Button
                      variant="outline"
                      onClick={() => handleWebsiteClick(selectedOrg.websiteUrl)}
                      className="justify-start text-gray-700 h-12"
                    >
                      <Globe className="w-5 h-5 mr-3 text-blue-500" />
                      <span>Visit Website</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="justify-start text-gray-700 h-12"
                  >
                    <Phone className="w-5 h-5 mr-3 text-blue-500" />
                    <span>+1 (555) 123-4567</span>
                  </Button>


                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                  onClick={() => handleViewDetails(selectedOrg)}
                >
                  Volunteer With Us
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 h-12"
                  onClick={() => handleWebsiteClick(selectedOrg.websiteUrl)}
                >
                  Make a Donation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Organization