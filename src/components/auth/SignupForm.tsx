"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/lib/schema/auth.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setApiError(null);
    try {
      await registerUser(data.username, data.password, data.name);
      toast.success("회원가입 및 로그인에 성공했습니다.");
      router.push("/");
    } catch (error: any) {
      const status = error?.response?.status;
      const apiMessage = error?.response?.data?.message;

      let msg = "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      if (status === 409) msg = "이미 존재하는 아이디입니다. 다른 아이디를 사용해 주세요.";
      else if (status === 400) msg = "입력값을 다시 확인해 주세요.";
      else if (apiMessage) msg = apiMessage;

      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 아이디 */}
      <div className="space-y-2">
        <label htmlFor="username" className="text-foreground text-sm font-medium">
          아이디
        </label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="username"
            {...register("username")}
            placeholder="testuser"
            className="focus:ring-primary/20 pl-10 transition-all focus:ring-2"
          />
        </div>
        <div className="min-h-[18px] text-destructive text-xs">
          {errors.username?.message}
        </div>
      </div>

      {/* 이름 */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-foreground text-sm font-medium">
          이름
        </label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="name"
            {...register("name")}
            placeholder="홍길동"
            className="focus:ring-primary/20 pl-10 transition-all focus:ring-2"
          />
        </div>
        <div className="min-h-[18px] text-destructive text-xs">
          {errors.name?.message}
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-foreground text-sm font-medium">
          비밀번호
        </label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="password"
            {...register("password")}
            type="password"
            placeholder="••••••"
            className="focus:ring-primary/20 pl-10 transition-all focus:ring-2"
          />
        </div>
        <div className="min-h-[18px] text-destructive text-xs">
          {errors.password?.message}
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
          비밀번호 확인
        </label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="confirmPassword"
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••"
            className="focus:ring-primary/20 pl-10 transition-all focus:ring-2"
          />
        </div>
        <div className="min-h-[18px] text-destructive text-xs">
          {errors.confirmPassword?.message}
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white transition-all hover:shadow-lg"
      >
        {isSubmitting ? "회원가입 중..." : "회원가입"}
      </Button>

      <div className="min-h-[18px] text-destructive text-xs">{apiError}</div>

      {/* 로그인 링크 */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-primary font-medium transition-colors hover:underline">
          로그인
        </Link>
      </div>
    </form>
  );
}
