import { useEffect, useState } from "react";
import { getAllBookings, markBookingPaid, adminSignOut, cleanupExpiredBookings, isBookingExpired } from "../../firebase.js";
import { PENDING_HOLD_MINUTES } from "../../constants.js";

function StatusBadge({ booking }) {
  const expired = isBookingExpired(booking);
  const status = expired ? "Expired" : booking.status || "Pending Payment";
  const isPaid = status === "Paid";
  const isExpired = status === "Expired";
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
        isPaid ? "bg-green-100 text-green-700" : isExpired ? "bg-gray-100 text-gray-500" : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    const data = await getAllBookings();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, []);

  const handleMarkPaid = async (booking) => {
    setUpdatingId(booking.id);
    await markBookingPaid(booking);
    await loadBookings();
    setUpdatingId(null);
  };

  const handleCleanup = async () => {
    setCleaning(true);
    setCleanupMessage("");
    const count = await cleanupExpiredBookings();
    await loadBookings();
    setCleanupMessage(count > 0 ? `Removed ${count} expired booking${count > 1 ? "s" : ""}.` : "No expired bookings to remove.");
    setCleaning(false);
  };

  const expiredCount = bookings.filter(isBookingExpired).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-2xl font-bold text-gray-800">Bookings</h1>
          <div className="flex items-center gap-3 flex-wrap">
            {expiredCount > 0 && (
              <button
                onClick={handleCleanup}
                disabled={cleaning}
                className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
              >
                {cleaning ? "Cleaning up..." : `Clean Up ${expiredCount} Expired`}
              </button>
            )}
            <button onClick={loadBookings} className="text-sm font-semibold text-green-700 hover:text-green-800">
              Refresh
            </button>
            <button onClick={() => adminSignOut()} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
              Log Out
            </button>
          </div>
        </div>

        {cleanupMessage && (
          <p className="text-sm text-gray-500 mb-4 -mt-2">{cleanupMessage}</p>
        )}

        <p className="text-xs text-gray-400 mb-4">
          Unpaid bookings automatically free up their slot after {PENDING_HOLD_MINUTES} minutes, but stay listed
          here as "Expired" until you clean them up.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-semibold">Reference</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Slots</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0">
                    <td className="p-4 font-medium text-gray-800">{b.reference}</td>
                    <td className="p-4 text-gray-700">{b.name}</td>
                    <td className="p-4 text-gray-700">{b.phone}</td>
                    <td className="p-4 text-gray-700">{b.date}</td>
                    <td className="p-4 text-gray-700">{(b.slots || []).join(", ")}</td>
                    <td className="p-4 text-gray-700">₱{b.total}</td>
                    <td className="p-4"><StatusBadge booking={b} /></td>
                    <td className="p-4">
                      {b.status !== "Paid" && (
                        <button
                          onClick={() => handleMarkPaid(b)}
                          disabled={updatingId === b.id}
                          className="text-xs font-semibold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                        >
                          {updatingId === b.id ? "Updating..." : "Mark as Paid"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}