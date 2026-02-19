"use client";

import { login } from "@/services";

import { useAuthStore, useShopStore } from "@/store";
import { useToast } from "@/providers/ToastProvider";
import { useTranslation } from "react-i18next";

import { emailPattern } from "@/libs/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import GoogleLink from "@/components/common/GoogleLink";

type LoginFormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const { t } = useTranslation("login");
    const { toast } = useToast();
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);
    const activeShopId = useShopStore((s) => s.activeShopId);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>();

    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setServerError(null);

        try {
            const res = await login(data.email, data.password);
            setUser(res.user); //Set user in global store
            router.push("/dashboard"); //Redirect to dashboard
            toast.success("Logged in successfully. Welcome back!"); //Success toast
        } catch (error: any) {
            toast.error(
                "An error occurred while logging in. Please try again."
            );
            if (error.message === "This account uses Google Sign-In") {
                setServerError(
                    "This account uses Google Sign-In. Please use the Google login button."
                );
            } else {
                setServerError("Invalid email or password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100vh] flex items-center justify-center px-4  my-2">
            <div className="w-full max-w-xl bg-gray-50 border border-main-500 rounded-lg p-4 md:p-8 space-y-6 shadow-xl">
                {/* TITLE */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-semibold">
                        {t("login.login")}
                    </h1>
                    <p className="text-sm ">{t("login.title")}</p>
                </div>

                {/* GOOGLE LOGIN */}
                <GoogleLink
                    href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/start`}
                    t={t}
                />

                <div className="relative mt-4 mb-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">
                            {t("login.or")}
                        </span>
                    </div>
                </div>

                <p className="text-sm  text-center">{t("login.message")}</p>
                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    {serverError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                            {serverError}
                        </p>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("login.email")}
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: t("login.required"),
                                pattern: {
                                    value: emailPattern.value,
                                    message: t("login.invalidEmail"),
                                },
                            })}
                            placeholder="you@example.com"
                            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("login.password")}
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: t("login.required"),
                                minLength: {
                                    value: 8,
                                    message: t("login.minLength"),
                                },
                            })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded bg-white border focus:outline-none shadow-sm"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-main-500 hover:bg-main-600 text-white py-3 rounded-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? t("login.signingIn") : t("login.signIn")}
                    </button>
                </form>

                {/* REGISTER */}
                <p className="text-sm text-center ">
                    {t("login.question")}{" "}
                    <Link
                        href="/register"
                        className="text-black font-medium underline underline-offset-2"
                    >
                        {t("login.signUp")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
