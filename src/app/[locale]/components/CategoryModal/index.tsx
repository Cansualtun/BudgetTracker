import { useState } from 'react';
import { Category } from '@/types/generalType';
import { useTranslations } from 'next-intl';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCategory: (category: string) => void;
}

const CategoryModal = ({ isOpen, onClose, onAddCategory }: CategoryModalProps) => {
    const [newCategory, setNewCategory] = useState('');
    const t = useTranslations();
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            const newCategoryId = newCategory.toLowerCase().replace(/\s+/g, '-') as Category;
            onAddCategory(newCategoryId);
            setNewCategory('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t("budget.categoryModal.addNewCategory")}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("budget.categoryModal.categoryName")}
                        </label>
                        <input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 
                            text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500
                            border-gray-300 dark:border-gray-700"
                            placeholder={t("budget.categoryModal.placeholder")}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                        rounded-md hover:bg-gray-200"
                        >
                            {t("budget.categoryModal.cancel")}
                        </button>
                        <button
                            onClick={handleAddCategory}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                        rounded-md hover:bg-blue-600"
                        >
                            {t("budget.categoryModal.add")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;