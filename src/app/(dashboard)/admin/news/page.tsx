"use client";

import { useState } from "react";
import { Megaphone, Send, AlertCircle, Camera, Video, Image as ImageIcon, X } from "lucide-react";
import { createNews } from "@/app/actions/news";
import { useRouter } from "next/navigation";

export default function CreateNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [department, setDepartment] = useState("Руководство");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const departments = ["Бухгалтерия", "Учебная часть", "Отдел продаж", "Архив", "Руководство"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("isImportant", isImportant.toString());
    formData.append("department", department);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    const res = await createNews(formData);
    if (res.success) {
      router.push("/tasks");
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        
        <div className="p-8 sm:p-12 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-brand-blue dark:text-brand-yellow" />
              Создать новость
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">Опубликуйте важное обновление для всей компании</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Заголовок новости</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок..."
                className="w-full text-lg font-bold bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-yellow focus:bg-white dark:focus:bg-zinc-900 rounded-2xl p-4 transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Отдел (от кого)</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-lg font-bold bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-yellow focus:bg-white dark:focus:bg-zinc-900 rounded-2xl p-4 transition-all outline-none appearance-none"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Фото новости</label>
              <div className="relative group/photo">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`p-6 border-2 border-dashed rounded-3xl flex items-center gap-4 transition-all ${
                  image ? 'border-brand-blue bg-brand-blue/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-brand-blue/50'
                }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${image ? 'bg-brand-blue text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{image ? image.name : 'Нажмите для выбора фото'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{image ? `${(image.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG до 10MB'}</p>
                  </div>
                  {image && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setImage(null); }} className="relative z-20 p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                       <X className="w-4 h-4 text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Видео новости</label>
              <div className="relative group/video">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className={`p-6 border-2 border-dashed rounded-3xl flex items-center gap-4 transition-all ${
                  video ? 'border-brand-yellow bg-brand-yellow/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-brand-yellow/50'
                }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${video ? 'bg-brand-yellow text-brand-blue' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{video ? video.name : 'Нажмите для выбора видео'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{video ? `${(video.size / 1024 / 1024).toFixed(2)} MB` : 'MP4, WEBM до 100MB'}</p>
                  </div>
                  {video && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setVideo(null); }} className="relative z-20 p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                       <X className="w-4 h-4 text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 px-1">Содержание (Markdown)</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Опишите подробности изменений..."
              rows={6}
              className="w-full text-lg bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue dark:focus:border-brand-yellow focus:bg-white dark:focus:bg-zinc-900 rounded-3xl p-6 transition-all outline-none resize-none leading-relaxed"
            />
          </div>


          <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700">
             <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${isImportant ? 'bg-red-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} onClick={() => setIsImportant(!isImportant)}>
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${isImportant ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
             </div>
             <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  {isImportant && <AlertCircle className="w-4 h-4 text-red-500" />}
                  Пометить как ВАЖНОЕ
                </h4>
                <p className="text-xs text-zinc-500 font-medium">Это потребует обязательного подтверждения от менеджеров</p>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-blue dark:bg-brand-yellow text-brand-yellow dark:text-brand-blue rounded-[1.5rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-brand-blue/20 dark:shadow-brand-yellow/10 hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? "Публикация..." : <><Send className="w-6 h-6" /> Опубликовать новость</>}
          </button>
        </form>
      </div>
    </div>
  );
}
