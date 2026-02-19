"use client";

import { login, register as registerUser } from "@/services";
import { useAuthStore } from "@/store";
import { useToast } from "@/providers/ToastProvider";
import { emailPattern } from "@/libs/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import GoogleLink from "@/components/common/GoogleLink";

type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const { t } = useTranslation("register");
    const { t: tLogin } = useTranslation("login");
    const { toast } = useToast();
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>();

    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        setServerError(null);

        try {
            // 1️⃣ Create account
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            // 2️⃣ LOGIN immediately (creates Payload session)
            const loginRes = await login(data.email, data.password);

            // 3️⃣ Hydrate frontend
            setUser(loginRes.user);

            // 4️⃣ Redirect
            router.push("/dashboard");
            toast.success("Account created successfully. Welcome aboard!");
        } catch (err: any) {
            toast.error("Unable to create account. Please try again.");
            setServerError("Unable to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100vh] flex items-center justify-center px-4 my-2">
            <div className="w-full max-w-xl bg-gray-50 border border-main-500 rounded-lg p-4 md:p-8 space-y-6 shadow-xl mt-10">
                {/* TITLE */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-semibold">
                        {t("register.title")}
                    </h1>
                </div>

                {/* GOOGLE LOGIN */}
                <GoogleLink
                    href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/start`}
                    t={tLogin}
                />

                <div className="relative mt-4 mb-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">
                            {t("register.or")}
                        </span>
                    </div>
                </div>

                <p className="text-sm  text-center">{t("register.message")}</p>

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

                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("register.name")}
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: t("register.required"),
                                minLength: {
                                    value: 2,
                                    message:
                                        t("register.tooShort") ||
                                        "Name is too short",
                                },
                            })}
                            placeholder="Jane Doe"
                            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("register.email")}
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: t("register.required"),
                                pattern: {
                                    value: emailPattern.value,
                                    message:
                                        t("register.invalidEmail") ||
                                        "Invalid email address",
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

                    {/* PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("register.password")}
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: t("register.required"),
                                minLength: {
                                    value: 8,
                                    message:
                                        t("register.minLength") ||
                                        "Minimum 8 characters",
                                },
                            })}
                            placeholder="••••••••"
                            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            {t("register.confirmPassword")}
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: t("register.required"),
                                validate: (value) =>
                                    value === watch("password") ||
                                    t("register.passwordsDoNotMatch") ||
                                    "Passwords do not match",
                            })}
                            placeholder="••••••••"
                            className="w-full border px-3 py-2 rounded bg-white shadow-sm"
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-main-500 hover:bg-main-600 text-white py-3 rounded-md cursor-pointer disabled:opacity-50"
                    >
                        {loading
                            ? t("register.creating") || "Creating account…"
                            : t("register.create") || "Create account"}
                    </button>
                </form>

                {/* LOGIN LINK */}
                <p className="text-sm text-center ">
                    {t("register.question")}{" "}
                    <Link
                        href="/login"
                        className="text-black font-medium underline underline-offset-2"
                    >
                        {t("register.login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
