import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

interface AboutCreatorCardProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  id: string;
}

export default function AboutCreatorCard({ name, role, avatarUrl, id }: AboutCreatorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <User className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-black">{name}</h4>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
        <Link href={`/profile/${id}`}>
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 