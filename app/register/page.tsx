import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <AuthCard
      mode="register"
      title="建立帳號"
      desc="建立會員帳號後，可使用登入、會員中心與後續媒合服務功能。"
      primaryText="註冊會員"
    />
  );
}