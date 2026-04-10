"use client";

import { useState } from "react";
import { 
  Edit2, 
  X, 
  Save, 
  Upload, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { updateQuestion, uploadImage } from "@/app/actions/admin";

interface QuestionEditFormProps {
  question: any;
}

export function QuestionEditForm({ question }: QuestionEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState(question.text);
  const [explanation, setExplanation] = useState(question.explanation || "");
  const [imageUrl, setImageUrl] = useState(question.imageUrl || "");

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateQuestion(question.id, {
        text,
        explanation,
        imageUrl
      });
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const newUrl = await uploadImage(formData);
      setImageUrl(newUrl);
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
        Редактировать
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Edit2 className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Редактирование</h2>
              <p className="text-xs text-zinc-500 font-medium tracking-tight">ID: {question.id}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Текст вопроса</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[100px] p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium placeholder:text-zinc-300"
              placeholder="Введите текст вопроса..."
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Объяснение</label>
             <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full min-h-[80px] p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium placeholder:text-zinc-300"
              placeholder="Добавьте пояснение к вопросу..."
            />
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Изображение</label>
             <div className="flex flex-col sm:flex-row gap-4">
                {imageUrl && (
                  <div className="w-32 h-32 bg-zinc-100 rounded-2xl border border-zinc-200 flex items-center justify-center overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 p-6 rounded-2xl group-hover:bg-zinc-50 group-hover:border-yellow-500/30 transition-all">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-yellow-600" />
                      )}
                      <span className="text-sm font-bold text-zinc-500 group-hover:text-zinc-700">Загрузить с ПК</span>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Или вставьте URL..."
                    className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-medium placeholder:text-zinc-300"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-zinc-100 bg-zinc-50 flex flex-col sm:flex-row gap-3">
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-200 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Сохранить изменения
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="px-8 bg-white border border-zinc-200 text-zinc-600 font-bold py-4 rounded-2xl hover:bg-zinc-50 transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
