"use client";
import { toast } from "@/components/ui/toast";
import { verifySchema } from "@/src/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Field } from "@/components/ui/field";
import { Input } from "@base-ui/react/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.add({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verification of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";
      toast.add({
        title: "Verification failed",
        description: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            F
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Field>
            <div className="relative mt-2">
              <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="code"
                type="text"
                placeholder="Enter your verification code"
                className="h-11 w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                {...form.register("code")}
              />
            </div>
          </Field>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
          >
            Verify Account
          </Button>
        </form>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Your account is protected with secure verification
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
