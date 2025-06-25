"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { userAPI, streamAPI } from "@/lib/api";
import { Stream, User } from "@/types";
import {
  User as UserIcon,
  Edit,
  Video,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/PopupBox";

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
  const router = useRouter();
  // Create Stream state
  const [showCreateStream, setShowCreateStream] = useState(false);
  const [streamForm, setStreamForm] = useState({
    title: "",
    description: "",
    streamLink: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

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

  // Create Stream logic
  const canCreateStream = isOwnProfile && user?.role === "STREAMER";
  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");
    try {
      const newStream = await streamAPI.createStream({
        title: streamForm.title,
        description: streamForm.description,
        streamLink: streamForm.streamLink,
      });
      if (newStream) {
        setCreateSuccess("Stream created successfully!");
        setStreamForm({ title: "", description: "", streamLink: "" });
        setShowCreateStream(false);
        setUser((prev) =>
          prev
            ? { ...prev, streams: [newStream, ...(prev.streams || [])] }
            : prev
        );
      } else {
        setCreateError(
          "Failed to create stream. Make sure you are a streamer."
        );
      }
    } catch (err) {
      console.log(err);
      setCreateError("Failed to create stream. Make sure you are a streamer.");
    } finally {
      setCreating(false);
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

        {/* Create Stream Button and Modal */}
        {canCreateStream && (
          <div className="mb-8">
            <Modal
              open={showCreateStream}
              onClose={() => setShowCreateStream(false)}
            >
              <form onSubmit={handleCreateStream} className="space-y-4">
                <h2 className="text-xl text-black font-bold mb-2">
                  Create Stream
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={streamForm.title}
                    onChange={(e) =>
                      setStreamForm({ ...streamForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Stream Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={streamForm.description}
                    onChange={(e) =>
                      setStreamForm({
                        ...streamForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    rows={2}
                    placeholder="Stream Description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stream Link (YouTube, etc.)
                  </label>
                  <input
                    type="url"
                    value={streamForm.streamLink}
                    onChange={(e) =>
                      setStreamForm({
                        ...streamForm,
                        streamLink: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                {createError && (
                  <div className="text-red-600 text-sm">{createError}</div>
                )}
                {createSuccess && (
                  <div className="text-green-600 text-sm">{createSuccess}</div>
                )}
                <div className="flex space-x-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Stream"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateStream(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        )}

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
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            avatarUrl: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="USER">User</option>
                        <option value="STREAMER">Streamer</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
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
                        <h3 className="text-xl font-semibold text-black">
                          {user.name}
                        </h3>
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
                        <p className="font-medium capitalize">
                          {user.role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Streams List */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-black">Streams</h2>
              {user.streams && user.streams.length > 0 ? (
                <div className="space-y-4">
                  {user.streams.map((stream: Stream) => (
                    <div
                      key={stream.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {stream.isLive && (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-red-600">
                                LIVE
                              </span>
                            </div>
                          )}

                          <h3
                            className="text-lg font-semibold text-black cursor-pointer hover:underline"
                            onClick={() => router.push(`/streams/${stream.id}`)}
                          >
                            {stream.title}
                          </h3>
                          <p
                            className="text-gray-600 text-sm mb-1 line-clamp-2 cursor-pointer"
                            onClick={() => router.push(`/streams/${stream.id}`)}
                          >
                            {stream.description}
                          </p>
                          <div className="flex space-x-2 rounded-md mt-2">
                            {stream.streamLink && (
                              <a
                                href={stream.streamLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button variant="outline" className="w-full">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Watch Stream
                                </Button>
                              </a>
                            )}
                            <Button
                              className="w-full flex-1"
                              onClick={() =>
                                router.push(`/streams/${stream.id}`)
                              }
                            >
                              <Video className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 text-right sm:mt-3">
                            {stream.createdAt && (
                              <span>
                                {new Date(stream.createdAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 min-w-fit"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No streams yet.</div>
              )}
            </div>
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
                      <span className="text-sm text-gray-600">
                        Total Streams
                      </span>
                    </div>
                    <span className="font-semibold">{user.streams.length}</span>
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
                        <Video className="h-4 w-4 mr-2" />
                        Create Stream
                      </Button>
                    )}
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        className="w-full justify-star text-black hover:cursor-pointer hover:bg-green-500"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        View Income
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
