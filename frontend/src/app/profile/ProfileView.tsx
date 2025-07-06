"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { userAPI } from "@/lib/api";
import { User } from "@/types";
import {
  User as UserIcon,
  Video,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CreateStreamDialog from "@/components/profile/CreateStreamDialog";
import ProfileInformationHeader from "@/components/profile/ProfileInformation";

export default function ProfileView({ userId }: { userId?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user: authUser } = useAuth();
  const router = useRouter();
  const isOwnProfile = !userId || (authUser && userId === authUser.uid);

  // Create Stream state
  const [showCreateStream, setShowCreateStream] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const id = userId || authUser?.uid;
      if (id) {
        try {
          const userData = await userAPI.getProfile(id);
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, authUser]);

  // Create Stream logic
  const canCreateStream = isOwnProfile && user?.role === "STREAMER";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile not found
            </h3>
            <p className="text-gray-600 mb-6">Unable to load this profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Profile</h1>
          <p className="text-gray-600 mt-2">
            {isOwnProfile
              ? "Manage your account and preferences"
              : `Viewing ${user.name}'s profile`}
          </p>
        </div>

        {/* Create Stream Modal */}
        {canCreateStream && (
          <CreateStreamDialog
            showCreateStream={showCreateStream}
            setShowCreateStream={setShowCreateStream}
            setUser={setUser}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <ProfileInformationHeader
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            user={user}
            setUser={setUser}
          />

          {/* Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Total Streams
                      </span>
                    </div>
                    <span className="font-semibold">{user.streams ? user.streams.length : 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Total Donations
                      </span>
                    </div>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Days Active</span>
                    </div>
                    <span className="font-semibold">
                      {Math.floor(
                        (Date.now() - new Date(user.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {isOwnProfile && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {canCreateStream && (
                        <Button
                          variant="primary"
                          className="w-full justify-start hover:cursor-pointer"
                          onClick={() => setShowCreateStream(true)}
                        >
                          <Video className="h-4 w-4 mr-2 justify-center" />
                          Create Stream
                        </Button>
                      )}
                      {isOwnProfile && (
                        <Button
                          variant="outline"
                          className="w-full justify-start text-black hover:cursor-pointer hover:bg-green-500"
                          onClick={() => router.push('/payments')}
                        >
                          <DollarSign className="h-4 w-4 mr-2 justify-center" />
                          View Income
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>No donations yet.</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
