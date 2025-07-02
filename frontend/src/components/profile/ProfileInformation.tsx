import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "../ui/Button";
import { Edit, UserIcon, Eye, Video } from "lucide-react";
import Image from "next/image";
import { userAPI } from "@/lib/api";
import { User, Stream } from "@/types";
import { useRouter } from "next/navigation";

interface props {
    isOwnProfile: boolean | null;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    user: User
    setUser: Dispatch<SetStateAction<User | null>>;
}

export default function ProfileInformationHeader({
    isOwnProfile,
    isEditing,
    setIsEditing,
    user,
    setUser,
}: props) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
    });

    const handleSave = async () => {
        try {
          const updatedUser = await userAPI.updateProfile(formData);
          if (updatedUser) {
            setUser(await userAPI.getProfile(user.id));
            setIsEditing(false);
          }
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      };

  return (
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
                    setFormData({ ...formData, role: e.target.value as User["role"] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="USER">User</option>
                  <option value="STREAMER">Streamer</option>
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
        {user.streams && user?.streams.length > 0 ? (
          <div className="space-y-4">
            {user?.streams.map((stream: Stream) => (
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
                        onClick={() => router.push(`/streams/${stream.id}`)}
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
  );
}
