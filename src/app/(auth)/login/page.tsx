"use client";

import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard title="로그인" description="JWT 로그인">
      <LoginForm />
    </AuthCard>
  );
}
