"use client";

import Modal from "../ui/PopupBox";
import { useState } from "react";
import { streamAPI } from "@/lib/api";
import { Button } from "../ui/Button";
import { User } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface props {
  showCreateStream: boolean;
  setShowCreateStream: (show: boolean) => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function CreateStreamDialog({
  showCreateStream,
  setShowCreateStream,
  setUser
}: props) {
  const [streamForm, setStreamForm] = useState({
    title: "",
    description: "",
    streamLink: "",
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

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

  return (
    <div className="mb-8">
      <Modal open={showCreateStream} onClose={() => setShowCreateStream(false)}>
        <form onSubmit={handleCreateStream} className="space-y-4">
          <h2 className="text-xl text-black font-bold mb-2">Create Stream</h2>
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
              className="w-full px-3 py-2 text-black border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full text-black px-3 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full text-black px-3 py-2 border placeholder:text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
  );
}
