"use client";

import { X } from "lucide-react";

type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void; // Save
    onCancel: () => void; // Exit without save
    onClose: () => void; // Cancel / close dialog
};

export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
    onClose,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-xs md:text-sm text-gray-900">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose} //clic sur le fond = cancel
            />

            {/* MODAL */}
            <div className="relative w-full max-w-72 sm:max-w-sm bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in">
                {/* CLOSE */}
                <button
                    onClick={onClose} //croix = cancel
                    className="absolute right-4 top-4 text-gray-400 text-red-500 cursor-pointer "
                >
                    <X size={18} />
                </button>

                {/* CONTENT */}
                <div className="space-y-2">
                    <h2 className="font-semibold text-sm md:text-base">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-gray-600">{description}</p>
                    )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onCancel} //bouton cancelText = exit without save
                        disabled={loading}
                        className="px-2 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm} //confirm = save and exit
                        disabled={loading}
                        className={`px-2 py-1 rounded-md text-white disabled:opacity-50 cursor-pointer ${
                            danger
                                ? "bg-red-600 text-xs md:text-sm hover:bg-red-700"
                                : "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {loading ? "Processing…" : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// 'use client'

// import { X } from 'lucide-react'

// type ConfirmDialogProps = {
//   open: boolean
//   title?: string
//   description?: string
//   confirmText?: string
//   cancelText?: string
//   danger?: boolean
//   loading?: boolean
//   onConfirm: () => void
//   onCancel: () => void
// }

// export default function ConfirmDialog({
//   open,
//   title = 'Are you sure?',
//   description,
//   confirmText = 'Confirm',
//   cancelText = 'Cancel',
//   danger = false,
//   loading = false,
//   onConfirm,
//   onCancel,
// }: ConfirmDialogProps) {
//   if (!open) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center text-xs md:text-sm text-gray-900">
//       {/* BACKDROP */}
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

//       {/* MODAL */}
//       <div className="relative w-full max-w-72 sm:max-w-sm bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in">
//         {/* CLOSE */}
//         <button
//           onClick={onCancel}
//           className="absolute right-4 top-4 text-gray-400 hover:text-black cursor-pointer"
//         >
//           <X size={18} />
//         </button>

//         {/* CONTENT */}
//         <div className="space-y-2">
//           <h2 className="font-semibold text-sm md:text-base">{title}</h2>
//           {description && <p className="text-gray-600">{description}</p>}
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-3 pt-4">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="px-2 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
//           >
//             {cancelText}
//           </button>

//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`px-2 py-1 rounded-md text-white disabled:opacity-50 cursor-pointer ${
//               danger
//                 ? 'bg-red-600 text-xs md:text-sm hover:bg-red-700'
//                 : 'bg-black hover:bg-gray-800'
//             }`}
//           >
//             {loading ? 'Processing…' : confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
