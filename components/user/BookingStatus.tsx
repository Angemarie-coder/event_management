interface BookingStatusProps {
  booking: {
    id: number;
    status: "pending" | "approved" | "rejected";
    quantity: number;
    createdAt: string;
    event: {
      title: string;
      date: string;
    };
  };
}

export default function BookingStatus({ booking }: BookingStatusProps) {
  const statusColors = {
    approved: "text-green-600",
    rejected: "text-red-500",
    pending: "text-yellow-500",
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800">
      <h2 className="font-semibold">{booking.event.title}</h2>
      <p className="text-sm">🎟 Quantity: {booking.quantity}</p>
      <p className={`text-sm font-bold ${statusColors[booking.status]}`}>
        Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </p>
      <p className="text-xs text-gray-400">
        Booked on {new Date(booking.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
