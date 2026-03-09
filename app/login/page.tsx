import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  return (
    <AuthCard
      mode="login"
      title="會員登入"
      desc="登入會員中心，查看資料與後續功能。"
      primaryText="登入"
    />
  );
}