import { useState, useEffect, useMemo } from "react";
import { Heart, Gift, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import toast from "react-hot-toast";

import DonationStats from "../components/DonationStats";
import DonationForm from "../components/DonationForm";
import Header from "@/components/Layout/Header";
import { DonateService } from "@/services/DonationService";
import { CreateDonationDto, DonationDto } from "@/types/Donation";

type NewDonation = Omit<CreateDonationDto, "id">;

const DonationPage = () => {
  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        const fetchedDonations = await DonateService.getVerifiedDonations();
        setDonations(fetchedDonations);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch verified donations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleAddDonation = async (newDonation: NewDonation) => {
    try {
      const donationId = await DonateService.createDonation({
        donorName: newDonation.donorName,
        donorContact: newDonation.donorContact,
        donationType: newDonation.donationType,
        amount: newDonation.amount,
        description: newDonation.description,
        transactionPhoto: newDonation.transactionPhoto,
      });

      const updatedDonations = await DonateService.getVerifiedDonations();
      setDonations(updatedDonations);

      toast.success(`Thank you ${newDonation.donorName} for your donation of ${
        newDonation.amount?.toLocaleString() ?? "0"
      } MMK!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add donation");
    }
  };

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) =>
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [donations, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="navbar-spacing">
        <div className="min-h-screen bg-gradient-soft">
          <header className="bg-card border-b border-border/50 shadow-card">
            <div className="max-w-4xl mx-auto px-4 py-2">
              {" "}
              {/* Reduced padding from py-6 to py-2 */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-warm rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gratitude-warm flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    Gratitude Ledger
                  </h1>
                  <p className="text-muted-foreground text-left ml-8">
                    လှူတန်းထားသော အလှုရှင်များစာရင်း
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <section className="mb-8">
              {isLoading ? (
                <p className="text-muted-foreground">Loading donations...</p>
              ) : (
                <DonationStats donations={donations} />
              )}
            </section>
            <section className="mb-8">
              <DonationForm onAddDonation={handleAddDonation} />
            </section>
            <section>
              <div className="max-w-4xl mx-auto mb-2">
                {" "}
                {/* Reduced margin from mb-6 to mb-2 */}
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recent Donations
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({filteredDonations.length} donations)
                  </span>
                </div>
              </div>
              {isLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="text-center py-6">
                  <Gift className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-md font-medium text-gray-500 mb-1">
                    {searchTerm
                      ? "No donations found"
                      : "No verified donations yet"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Add a donation to get started"}
                  </p>
                </div>
              ) : (
                <Card className="shadow-md border border-orange-500 bg-white rounded-lg max-w-4xl mx-auto">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-orange-600 font-medium text-sm">
                              Donor Name
                            </TableHead>
                            <TableHead className="text-orange-600 font-medium text-sm">
                              Amount (MMK)
                            </TableHead>
                            <TableHead className="text-orange-600 font-medium text-sm">
                              Date
                            </TableHead>
                            <TableHead className="text-orange-600 font-medium text-sm">
                              Note
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDonations.slice(0, 5).map((donation) => (
                            <TableRow
                              key={donation.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="text-sm text-gray-700">
                                {donation.donorName}
                              </TableCell>
                              <TableCell className="text-sm text-orange-600 font-medium">
                                {donation.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {donation.date || donation.receivedAt
                                  ? new Date(
                                      donation.date || donation.receivedAt || ""
                                    ).toLocaleDateString("en-GB")
                                  : new Date().toLocaleDateString("en-GB")}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                                {donation.note || donation.description || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          </main>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;
