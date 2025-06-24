"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { userAPI } from "@/lib/api";
import { User } from "@/types";
import { User as UserIcon, Edit, Video, DollarSign, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function ProfileView({ userId }: { userId?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    role: "",
  });
  const { user: authUser } = useAuth();
  const isOwnProfile = !userId || (authUser && userId === authUser.uid);

  useEffect(() => {
    const fetchUser = async () => {
      const id = userId || authUser?.uid;
      if (id) {
        try {
          const userData = await userAPI.getProfile(id);
          if (userData) {
            setUser(userData);
            setFormData({
              name: userData.name,
              avatarUrl: userData.avatarUrl || "",
              role: userData.role,
            });
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

  const handleSave = async () => {
    try {
      const updatedUser = await userAPI.updateProfile(formData);
      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600 mb-6">
              Unable to load this profile.
            </p>
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
            {isOwnProfile ? "Manage your account and preferences" : `Viewing ${user.name}'s profile`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing && isOwnProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="USER">User</option>
                        <option value="STREAMER">Streamer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-8 w-8 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-black">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-1">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Member since:</span>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>
                        <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
                      <span className="text-sm text-gray-600">Total Streams</span>
                    </div>
                    <span className="font-semibold">{user.streams.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Total Donations</span>
                    </div>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Days Active</span>
                    </div>
                    <span className="font-semibold">
                      {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isOwnProfile && (
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Create Stream
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Donations
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 