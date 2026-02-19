import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLink({
    href,
    t,
}: {
    href?: string;
    t?: (key: string) => string;
}) {
    return (
        <Link
            href={href || "/"}
            className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition
             hover:bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            <FcGoogle className="text-xl" />
            <span className="text-sm font-medium text-gray-700">
                {t ? t("login.google") : "Continue with Google"}{" "}
                <span className="font-semibold">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#DB4437]">o</span>
                    <span className="text-[#F4B400]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#0F9D58]">l</span>
                    <span className="text-[#DB4437]">e</span>
                </span>
            </span>
        </Link>
    );
}
