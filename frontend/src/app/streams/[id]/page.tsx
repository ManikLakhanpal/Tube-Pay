'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { streamAPI } from '@/lib/api';
import { Payment, Stream } from '@/types';
import { Video, Eye, Calendar, User, ArrowLeft, DollarSign, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

// Modal component for editing/deleting stream
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/80" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-11/12 max-w-xs sm:max-w-md relative z-50 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

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
    title: stream?.title ?? '',
    description: stream?.description ?? '',
    streamLink: stream?.streamLink ?? '',
    isLive: stream?.isLive ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStream = async () => {
      if (params.id) {
        try {
          const streamData = await streamAPI.getStreamById(params.id as string);
          setStream(streamData);
        } catch (error) {
          console.error('Error fetching stream:', error);
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
        title: stream.title ?? '',
        description: stream.description ?? '',
        streamLink: stream.streamLink ?? '',
        isLive: stream.isLive ?? false,
      });
    }
  }, [stream, showEditModal]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    setEditSuccess('');
    try {
      if (!stream) throw new Error('Stream not loaded');
      const updated = await streamAPI.updateStream(stream.id, editForm);
      setStream(updated);
      setEditSuccess('Stream updated!');
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating stream:', err);
      setEditError('Failed to update stream.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setEditError('');
    try {
      if (!stream) throw new Error('Stream not loaded');
      await streamAPI.deleteStream(stream.id);
      setEditSuccess('Stream deleted!');
      router.push('/streams');
    } catch (err) {
      console.error('Error deleting stream:', err);
      setEditError('Failed to delete stream.');
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Stream not found</h3>
            <p className="text-gray-600 mb-6">
              The stream you&apos;re looking for doesn&apos;t exist or has been removed.
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
        <div className="mb-6">
          <Link href="/streams">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Streams</span>
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {stream.isLive && (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600">LIVE</span>
                </>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(stream.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4">{stream.title}</h1>
          
          {stream.description && (
            <p className="text-gray-600 mb-6">{stream.description}</p>
          )}

          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{stream.streamer.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Started {new Date(stream.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {stream.streamLink && (
              <a
                href={stream.streamLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full" size="lg">
                  <Eye className="h-5 w-5 mr-2" />
                  Watch on YouTube
                </Button>
              </a>
            )}
            <Button variant="outline" className="flex-1" size="lg">
              <DollarSign className="h-5 w-5 mr-2" />
              Support Creator
            </Button>
            {isOwner && (
              <Button variant="outline" className="flex-1" size="lg" onClick={() => setShowEditModal(true)}>
                Edit Stream
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      {stream.streamLink ? (
                        <a
                          href={stream.streamLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black hover:underline"
                        >
                          Click here to watch on YouTube
                        </a>
                      ) : (
                        'Stream link not available'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Support This Creator</span>
                </CardTitle>
                <CardDescription>
                  Show your appreciation by sending a donation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 text-lg">
                      $5
                    </Button>
                    <Button variant="outline" className="h-16 text-lg">
                      $10
                    </Button>
                    <Button variant="outline" className="h-16 text-lg">
                      $25
                    </Button>
                    <Button variant="outline" className="h-16 text-lg">
                      $50
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Leave a message for the creator..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <Button className="w-full" size="lg">
                    Send Donation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-black">{stream.streamer.name}</h4>
                    <p className="text-sm text-gray-600">{stream.streamer.role}</p>
                  </div>
                </div>
                <Link href={`/profile/${stream.streamer.id}`}>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stream.payments && stream.payments.length > 0 ? (
                    <div className="space-y-4">
                      {stream.payments.map((payment: Payment) => (
                        <div key={payment.id} className="flex items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {payment.user?.avatarUrl ? (
                              <Image
                                src={payment.user.avatarUrl}
                                alt={payment.user.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-black">{payment.user?.name || 'Anonymous'}</div>
                            {payment.message && (
                              <div className="text-gray-700 text-sm">{payment.message}</div>
                            )}
                          </div>
                          <div className="font-semibold text-green-600 text-lg">₹{payment.amount}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">No donations yet</p>
                      <p className="text-xs text-gray-500">Be the first to support!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Stream Modal */}
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <h2 className="text-xl text-black font-bold mb-2">Edit Stream</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Stream Title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Stream Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stream Link (YouTube, etc.)</label>
              <input
                type="url"
                value={editForm.streamLink}
                onChange={e => setEditForm({ ...editForm, streamLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editForm.isLive ? 'live' : 'complete'}
                onChange={e => setEditForm({ ...editForm, isLive: e.target.value === 'live' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="live">Live</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            {editError && <div className="text-red-600 text-sm">{editError}</div>}
            {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
            <div className="flex space-x-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="outline" type="button" onClick={() => setShowDeleteConfirm(true)} disabled={deleting} className="border-red-500 text-red-600 hover:bg-red-50">
                Delete Stream
              </Button>
            </div>
          </form>
        </Modal>
        {/* Delete Confirmation Modal */}
        <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <h2 className="text-xl text-black font-bold mb-2">Delete Stream?</h2>
            <p className="text-gray-700">Are you sure you want to delete this stream? This action cannot be undone.</p>
            {editError && <div className="text-red-600 text-sm">{editError}</div>}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleDelete} disabled={deleting} className="border-red-500 text-red-600 hover:bg-red-50">{deleting ? 'Deleting...' : 'Delete'}</Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
} 