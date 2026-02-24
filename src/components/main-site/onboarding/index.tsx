// app/onboarding/page.tsx
"use client";

import Link from "next/link";

import { Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

export default function Onboarding() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const stepParam = searchParams.get("step");
    const step = stepParam ? parseInt(stepParam) : 0;

    const steps: Record<number, React.ReactNode> = {
        1: <Step1 router={router} />,
        2: <Step2 router={router} />,
        3: <Step3 router={router} />,
        4: <Step4 router={router} />,
        5: <Step5 router={router} />,
        6: <Step6 router={router} />,
    };

    return (
        <div>
            <Link
                href="/"
                className="text-main-500 mb-8 flex items-center gap-1"
            >
                <Home className="w-6 h-6 text-main-500" />
                Home
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg md:text-xl font-semibold">
                    Etape {step}/{Object.keys(steps).length}
                </h1>
                <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                    <div
                        className="h-full bg-main-500 rounded-full transition-all"
                        style={{
                            width: `${(step / Object.keys(steps).length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            <div>{steps[step]}</div>
        </div>
    );
}
