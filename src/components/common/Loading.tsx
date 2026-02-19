import { useEffect, useState } from "react";

const Loading = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-6">
                    <div className="w-full h-full border-4 border-gray-200 border-t-main-600 rounded-full animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        Ebuildfy
                    </span>
                </div>
                <div className="text-white text-sm font-semibold">
                    Loading{dots}
                </div>
            </div>
        </div>
    );
};

export default Loading;
