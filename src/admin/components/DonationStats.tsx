
import { DonateService } from "@/services/DonationService";
import { DonationStatsDto } from "@/types/Donation";
import { useState, useEffect } from "react";

const DonationStats: React.FC = () => {
  const [stats, setStats] = useState<DonationStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const stats = await DonateService.getVerifiedStats();
        setStats(stats);
      } catch (err) {
        setError("Failed to load donation stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading stats...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md border border-orange-500 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-md p-3 rounded-lg text-center">
            <h3 className="text-sm text-gray-600">Total Donations</h3>
            <p className="text-lg font-semibold text-orange-600">
              {stats.verifiedDonations}
            </p>
          </div>
          <div className="bg-white shadow-md p-3 rounded-lg text-center">
            <h3 className="text-sm text-gray-600">Total Donors</h3>
            <p className="text-lg font-semibold text-orange-600">
              {stats.verifiedDonors}
            </p>
          </div>
          <div className="bg-white shadow-md p-3 rounded-lg text-center">
            <h3 className="text-sm text-gray-600">Total Amount </h3>
            <p className="text-lg font-semibold text-orange-600">
              {stats.averageVerifiedDonation.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              MMK
            </p>
          </div>
          <div className="bg-white shadow-md p-3 rounded-lg text-center">
            <h3 className="text-sm text-gray-600">This Month</h3>
            <p className="text-lg font-semibold text-orange-600">
              {stats.verifiedThisMonthDonations}
              {stats.averageVerifiedDonation.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              MMK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationStats;
