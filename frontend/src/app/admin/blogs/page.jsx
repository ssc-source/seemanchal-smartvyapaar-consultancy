"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, RefreshCcw, Trash2, CheckCircle2, Archive, BookOpen } from "lucide-react";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export default function AdminBlogs() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await adminApi.getBlogPosts();
      setPosts(Array.isArray(res.data) ? res.data : []);
      if (!selectedPost && Array.isArray(res.data) && res.data.length > 0) {
        setSelectedPost(res.data[0]);
      }
    } catch (err) {
      setError(err.message || "Unable to load blog posts.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refreshPosts = () => fetchPosts();

  const reloadSelectedPost = async (post) => {
    if (!post?.id) return;
    try {
      const res = await adminApi.getBlogPost(post.id);
      setSelectedPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const runPostAction = async (postId, action) => {
    if (action === "delete" && !confirm("Delete this blog post? This cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      let res;
      if (action === "publish") {
        res = await adminApi.publishBlogPost(postId);
      } else if (action === "archive") {
        res = await adminApi.archiveBlogPost(postId);
      } else if (action === "delete") {
        res = await adminApi.deleteBlogPost(postId);
      }

      if (action === "delete") {
        setPosts((prev) => prev.filter((item) => item.id !== postId));
        setSelectedPost((prev) => (prev?.id === postId ? null : prev));
      } else {
        const updated = res.data;
        setPosts((prev) => prev.map((item) => (item.id === postId ? updated : item)));
        setSelectedPost(updated);
      }
    } catch (err) {
      alert(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const activePosts = posts;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500">Admin / Blog</div>
          <h1 className="text-3xl font-semibold text-slate-900">Blog Management</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">Review blog posts, publish or archive content, and manage live articles from the admin panel.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshPosts}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Posts</h2>
              <p className="text-sm text-slate-500">Total {posts.length} posts</p>
            </div>
          </div>

          <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-10 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 text-sm text-red-600">{error}</div>
            ) : activePosts.length === 0 ? (
              <div className="p-6 text-slate-500">No blog posts found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activePosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setSelectedPost(post);
                      reloadSelectedPost(post);
                    }}
                    className={`w-full text-left px-5 py-4 transition-colors hover:bg-slate-50 ${selectedPost?.id === post.id ? 'bg-slate-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">{post.title || 'Untitled post'}</h3>
                        <p className="mt-1 text-xs text-slate-500 truncate">/{post.slug || 'no-slug'}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        {STATUS_LABELS[post.status] || post.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{post.excerpt ? post.excerpt : 'No excerpt available.'}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
          </div>

          <div className="p-6">
            {!selectedPost ? (
              <div className="flex min-h-70 flex-col items-center justify-center text-slate-400">
                <BookOpen className="h-12 w-12 mb-4" />
                <p>Select a blog post to view details and actions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">{selectedPost.title || 'Untitled post'}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{STATUS_LABELS[selectedPost.status] || selectedPost.status}</span>
                    <span>&bull;</span>
                    <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                    {selectedPost.publishedAt && (
                      <><span>&bull;</span><span>Published {new Date(selectedPost.publishedAt).toLocaleDateString()}</span></>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                    <p className="mt-2 text-sm text-slate-800">{selectedPost.BlogCategory?.name || 'Uncategorized'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Tags</p>
                    <p className="mt-2 text-sm text-slate-800">{selectedPost.BlogTags?.length ? selectedPost.BlogTags.map((tag) => tag.name).join(', ') : 'None'}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedPost.excerpt || selectedPost.content || 'No content preview available.'}
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedPost.status !== 'PUBLISHED' && (
                    <button
                      type="button"
                      onClick={() => runPostAction(selectedPost.id, 'publish')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Publish
                    </button>
                  )}
                  {selectedPost.status !== 'ARCHIVED' && (
                    <button
                      type="button"
                      onClick={() => runPostAction(selectedPost.id, 'archive')}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Archive className="h-4 w-4" /> Archive
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => runPostAction(selectedPost.id, 'delete')}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
