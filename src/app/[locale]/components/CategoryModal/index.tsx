"use client"
import { useTranslations } from 'next-intl';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCategory: () => void;
    newCategory: string;
    setNewCategory: (value: string) => void;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onAddCategory,
    newCategory,
    setNewCategory
}: CategoryModalProps) {
    const t = useTranslations();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                    {t('budget.categories.modal.title')}
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder={t('budget.categories.modal.placeholder')}
                        className="w-full p-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700
                            text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
                                dark:text-gray-300 dark:hover:text-gray-100"
                        >
                            {t('budget.categories.modal.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!newCategory.trim()}
                        >
                            {t('budget.categories.modal.add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}