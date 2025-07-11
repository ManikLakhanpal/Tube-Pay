import { Button } from "@/components/ui/Button";
import { Eye, DollarSign } from "lucide-react";
import Link from "next/link";

interface StreamActionsProps {
  streamLink?: string;
  isOwner: boolean;
  onEdit: () => void;
}

export default function StreamActions({ streamLink, isOwner, onEdit }: StreamActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {streamLink && (
        <Link
          href={streamLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-wrap"
        >
          <Button className="w-full truncate" size="lg">
            <Eye className="h-5 w-5 mr-2" />
            Watch on YouTube
          </Button>
        </Link>
      )}
      <Button
        variant="outline"
        className="flex-1"
        size="lg"
        onClick={() => {
          const element = document.getElementById("support");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <DollarSign className="h-5 w-5 mr-2" />
        Support Creator
      </Button>
      {isOwner && (
        <Button
          variant="outline"
          className="flex-1"
          size="lg"
          onClick={onEdit}
        >
          Edit Stream
        </Button>
      )}
    </div>
  );
} 