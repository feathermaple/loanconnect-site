import { Suspense } from "react";
import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <AuthCard
        mode="register"
        title="會員註冊"
        desc="註冊後即可開始使用平台功能，查看借款需求並管理會員資料。"
        primaryText="立即註冊"
      />
    </Suspense>
  );
}