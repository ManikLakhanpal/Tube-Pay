import ProfileView from "./ProfileView";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
} 