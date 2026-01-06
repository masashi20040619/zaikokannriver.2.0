
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Prize, PrizeCategory, Manufacturer } from '../types';
// Fix: Import PlusIcon which was being used in the component but not imported.
import PlusIcon from './icons/PlusIcon';

interface PrizeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prize: Prize) => void;
  prizeToEdit?: Prize | null;
}

const prizeCategories: PrizeCategory[] = ['マスコット', 'ぬいぐるみ', 'フィギュア', 'その他'];
const prizeManufacturers: Manufacturer[] = ['指定なし', 'バンダイナムコ', 'タイトー', 'SEGA FAVE', 'FuRyu', 'Parade', 'SK', 'その他'];

const PrizeFormModal: React.FC<PrizeFormModalProps> = ({ isOpen, onClose, onSave, prizeToEdit }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<PrizeCategory>('その他');
  const [manufacturer, setManufacturer] = useState<Manufacturer>('指定なし');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(prizeToEdit?.name || '');
      setQuantity(prizeToEdit?.quantity || 1);
      setAcquisitionDate(prizeToEdit?.acquisitionDate || new Date().toISOString().split('T')[0]);
      setPhoto(prizeToEdit?.photo || '');
      setNotes(prizeToEdit?.notes || '');
      setCategory(prizeToEdit?.category || 'その他');
      setManufacturer(prizeToEdit?.manufacturer || '指定なし');
    }
  }, [isOpen, prizeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const prizeData: Prize = {
      id: prizeToEdit?.id || Date.now().toString(),
      name,
      quantity,
      acquisitionDate,
      category,
      manufacturer,
      photo,
      notes,
    };
    onSave(prizeData);
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border-t sm:border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            {prizeToEdit ? '景品情報を編集' : '新しい景品を登録'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">景品名</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              placeholder="例: たまごっち ぬいぐるみ"
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">カテゴリ</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PrizeCategory)}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {prizeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="manufacturer" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">メーカー</label>
              <select
                id="manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value as Manufacturer)}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {prizeManufacturers.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">個数</label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="px-4 py-3 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-transparent text-center focus:outline-none font-bold"
                />
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="acquisitionDate" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">獲得日</label>
              <input
                type="date"
                id="acquisitionDate"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">写真</label>
            <div className="flex gap-4 items-center">
              <label className="cursor-pointer group flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/30 group-hover:border-indigo-400 transition-all">
                  <PlusIcon className="w-8 h-8 text-slate-300 group-hover:text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">撮る・選ぶ</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photo && (
                <div className="relative group flex-shrink-0">
                  <img src={photo} alt="Preview" className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" />
                  <button 
                    type="button"
                    onClick={() => setPhoto('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5 ml-1">備考・メモ</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="獲得した店舗やコツなど..."
              className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all transform active:scale-[0.98]"
            >
              リストに追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrizeFormModal;
