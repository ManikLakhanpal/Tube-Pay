"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { streamAPI } from "@/lib/api";
import { Stream } from "@/types";
import { Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StreamHeader from "@/components/streams/StreamHeader";
import StreamActions from "@/components/streams/StreamActions";
import LiveStreamCard from "@/components/streams/LiveStreamCard";
import SupportCreatorCard from "@/components/streams/SupportCreatorCard";
import AboutCreatorCard from "@/components/streams/AboutCreatorCard";
import RecentSupportCard from "@/components/streams/RecentSupportCard";
import EditStreamModal from "@/components/streams/EditStreamModal";
import DeleteConfirmModal from "@/components/streams/DeleteConfirmModal";

export default function StreamDetailPage() {
  const params = useParams();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const isOwner = authUser && stream && authUser.uid === stream.streamer.id;
  const router = useRouter();
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: stream?.title ?? "",
    description: stream?.description ?? "",
    streamLink: stream?.streamLink ?? "",
    isLive: stream?.isLive ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      if (params.id) {
        try {
          const streamData = await streamAPI.getStreamById(params.id as string);
          setStream(streamData);
        } catch (error) {
          console.error("Error fetching stream:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStream();
  }, [params.id]);

  // Sync editForm with stream when modal opens
  useEffect(() => {
    if (stream && showEditModal) {
      setEditForm({
        title: stream.title ?? "",
        description: stream.description ?? "",
        streamLink: stream.streamLink ?? "",
        isLive: Boolean(stream.isLive ?? false),
      });
    }
  }, [stream, showEditModal]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditError("");
    setEditSuccess("");
    try {
      if (!stream) throw new Error("Stream not loaded");
      console.log("Sending update data:", editForm);
      const updated = await streamAPI.updateStream(stream.id, {
        ...editForm,
        isLive: editForm.isLive.toString(),
      });
      console.log("Received updated stream:", updated);
      if (updated) {
        setStream(updated);
        setEditSuccess("Stream updated!");
        setShowEditModal(false);
      } else {
        setEditError("Failed to update stream - no response from server.");
      }
    } catch (err) {
      console.error("Error updating stream:", err);
      setEditError("Failed to update stream.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setEditError("");
    try {
      if (!stream) throw new Error("Stream not loaded");
      await streamAPI.deleteStream(stream.id);
      setEditSuccess("Stream deleted!");
      router.push("/profile");
    } catch (err) {
      console.error("Error deleting stream:", err);
      setEditError("Failed to delete stream.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stream...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Stream not found
            </h3>
            <p className="text-gray-600 mb-6">
              The stream you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/streams">
              <Button>Back to Streams</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StreamHeader
          isLive={Boolean(stream.isLive ?? false)}
          createdAt={stream.createdAt}
          title={stream.title}
          description={stream.description}
        />
        <StreamActions
          streamLink={stream.streamLink}
          isOwner={Boolean(isOwner)}
          onEdit={() => setShowEditModal(true)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <LiveStreamCard streamLink={stream.streamLink} />
            <SupportCreatorCard 
              streamId={stream.id} 
              onPaymentSuccess={() => {
                // Refresh the stream data to show updated payments
                const fetchStream = async () => {
                  try {
                    const streamData = await streamAPI.getStreamById(stream.id);
                    setStream(streamData);
                  } catch (error) {
                    console.error("Error refreshing stream:", error);
                  }
                };
                fetchStream();
              }}
            />
          </div>
          <div className="space-y-6">
            <AboutCreatorCard
              name={stream.streamer.name}
              role={stream.streamer.role}
              avatarUrl={stream.streamer.avatarUrl}
              id={stream.streamer.id}
            />
            <RecentSupportCard payments={stream.payments} />
          </div>
        </div>
        <EditStreamModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          editForm={editForm}
          setEditForm={setEditForm}
          onSubmit={handleEditSubmit}
          saving={saving}
          error={editError}
          success={editSuccess}
          onDelete={handleDelete}
          deleting={deleting}
          onShowDelete={() => setShowDeleteConfirm(true)}
        />
        <DeleteConfirmModal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onDelete={handleDelete}
          deleting={deleting}
          error={editError}
        />
      </div>
    </div>
  );
}
