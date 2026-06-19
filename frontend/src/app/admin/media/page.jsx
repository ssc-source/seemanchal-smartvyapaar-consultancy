"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Plus, Edit2, Trash2, Image as ImageIcon, RefreshCw, Search } from "lucide-react";

function bytesToSize(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export default function MediaAdminPage() {
  const router = useRouter();
  const [media, setMedia] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [q, setQ] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const fileRef = useRef();

  const fetchMedia = async (page = meta.page) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getMedia({ page, limit: meta.limit, q: q || undefined, folder: folderFilter || undefined });
      setMedia(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, limit: 20 });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const me = await adminApi.me();
        const perms = me.data.user.permissions || [];
        if (!perms.includes('MEDIA_UPLOAD')) {
          router.replace('/admin');
          return;
        }
      } catch (e) {
        router.replace('/admin/login');
        return;
      }
      fetchMedia(1);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => fetchMedia(1);

  const uniqueFolders = Array.from(new Set(media.map(m => m.folder).filter(Boolean)));

  const handlePage = (next) => fetchMedia(next);

  const openUpload = () => { setShowUpload(true); setUploadProgress(0); };

  const doUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert('Please select an image');
    const allowed = ['image/png','image/jpg','image/jpeg','image/webp'];
    if (!allowed.includes(file.type)) return alert('Unsupported file type');

    const form = new FormData();
    form.append('image', file);
    form.append('altText', document.getElementById('uploadAlt')?.value || '');
    form.append('folder', document.getElementById('uploadFolder')?.value || '');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.protocol}//${window.location.host.replace(/:\d+$/, '')}${''}/api/admin/media/upload`);
    xhr.withCredentials = true;
    if (adminApi.token) xhr.setRequestHeader('Authorization', `Bearer ${adminApi.token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = async () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        alert('Upload successful');
        setShowUpload(false);
        fetchMedia(1);
      } else {
        const msg = (() => { try { return JSON.parse(xhr.responseText).message || JSON.parse(xhr.responseText).error; } catch { return xhr.responseText || 'Upload failed'; } })();
        alert(msg);
      }
    };
    xhr.onerror = () => { setUploading(false); alert('Upload failed'); };
    setUploading(true);
    xhr.send(form);
  };

  const startEdit = (m) => {
    setEditItem({ ...m });
  };

  const saveEdit = async () => {
    try {
      await adminApi.updateMedia(editItem.id, { altText: editItem.altText, folder: editItem.folder });
      alert('Saved');
      setEditItem(null);
      fetchMedia(meta.page);
    } catch (e) { alert(e.message || 'Save failed'); }
  };

  const doDelete = async (id) => {
    if (!confirm('Delete this media item?')) return;
    try {
      await adminApi.deleteMedia(id);
      fetchMedia(meta.page);
    } catch (e) { alert(e.message || 'Delete failed'); }
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Media Library</h3>
          <div className="flex items-center gap-2">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="px-3 py-2 border rounded-lg text-sm" />
            <button onClick={() => fetchMedia(1)} className="px-3 py-2 bg-slate-100 rounded"> <Search className="h-4 w-4" /> </button>
            <select value={folderFilter} onChange={e => { setFolderFilter(e.target.value); fetchMedia(1); }} className="px-3 py-2 border rounded-md text-sm">
              <option value="">All folders</option>
              {uniqueFolders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <button onClick={refresh} className="px-3 py-2 bg-slate-100 rounded"> <RefreshCw className="h-4 w-4" /> </button>
            <button onClick={openUpload} className="flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition-colors"> <Plus className="h-4 w-4" /> Upload</button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {media.map(m => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={m.url || m.path} alt={m.altText || m.originalName} className="h-16 w-24 object-cover rounded" onClick={() => setPreviewItem(m)} />
                  <div>
                    <div className="font-medium text-slate-900">{m.originalName || m.filename}</div>
                    <div className="text-sm text-slate-500">{m.folder || '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div>{m.storageProvider}</div>
                  <div>{bytesToSize(m.size)}</div>
                  <div>{new Date(m.createdAt).toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => doDelete(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-600">Total: {meta.total || 0}</div>
          <div className="flex items-center gap-2">
            <button disabled={meta.page <= 1} onClick={() => handlePage(meta.page - 1)} className="px-3 py-1 border rounded">Prev</button>
            <div className="px-3">{meta.page}</div>
            <button disabled={meta.page * meta.limit >= (meta.total || 0)} onClick={() => handlePage(meta.page + 1)} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>

      {/* Editor / Modals */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <h3 className="font-semibold text-slate-800 mb-4">Preview / Edit</h3>
        {previewItem ? (
          <div>
            <img src={previewItem.url || previewItem.path} alt={previewItem.altText || previewItem.originalName} className="w-full h-48 object-contain rounded mb-4" />
            <div className="text-sm text-slate-700">Filename: {previewItem.filename}</div>
            <div className="text-sm text-slate-700">Provider: {previewItem.storageProvider}</div>
            <div className="text-sm text-slate-700">URL: <a href={previewItem.url || previewItem.path} target="_blank" rel="noreferrer" className="text-blue-600">Open</a></div>
            <div className="text-sm text-slate-700">Dimensions: {previewItem.width || '—'} x {previewItem.height || '—'}</div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Select an item to preview</div>
        )}

        {editItem && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Edit</h4>
            <label className="block text-sm text-slate-700">Alt Text</label>
            <input value={editItem.altText || ''} onChange={e => setEditItem({ ...editItem, altText: e.target.value })} className="w-full px-3 py-2 border rounded mb-2" />
            <label className="block text-sm text-slate-700">Folder</label>
            <input value={editItem.folder || ''} onChange={e => setEditItem({ ...editItem, folder: e.target.value })} className="w-full px-3 py-2 border rounded mb-4" />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="flex-1 bg-brand-primary text-white py-2 rounded">Save</button>
              <button onClick={() => setEditItem(null)} className="px-4 bg-slate-100 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="font-semibold mb-4">Upload Image</h4>
            <input ref={fileRef} type="file" accept="image/png,image/jpg,image/jpeg,image/webp" className="mb-2" />
            <label className="block text-sm text-slate-700">Alt Text</label>
            <input id="uploadAlt" className="w-full px-3 py-2 border rounded mb-2" />
            <label className="block text-sm text-slate-700">Folder</label>
            <input id="uploadFolder" className="w-full px-3 py-2 border rounded mb-4" />
            {uploading && <div className="mb-2 text-sm">Progress: {uploadProgress}%</div>}
            <div className="flex gap-2">
              <button onClick={doUpload} className="flex-1 bg-brand-primary text-white py-2 rounded">Upload</button>
              <button onClick={() => setShowUpload(false)} className="px-4 bg-slate-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
