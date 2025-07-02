import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useState, Dispatch, SetStateAction } from "react";
import { Button } from "../ui/Button";
import { Edit, UserIcon } from "lucide-react";
import Image from "next/image";
import { userAPI } from "@/lib/api";
import { User, Stream } from "@/types";
import StreamList from "../StreamList";

interface props {
  isOwnProfile: boolean | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function ProfileInformationHeader({
  isOwnProfile,
  isEditing,
  setIsEditing,
  user,
  setUser,
}: props) {
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
                    setFormData({
                      ...formData,
                      role: e.target.value as User["role"],
                    })
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

      <StreamList streams={user.streams as Stream[]} />
    </div>
  );
}
