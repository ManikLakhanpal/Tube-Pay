export const getStatusColor = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return "text-green-600 bg-green-100";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100";
    case "FAILED":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}; 