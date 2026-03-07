import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  return (
    <AuthCard
      title="建立帳號"
      desc="這頁是依照借款媒合型平台需求，做成可直接延伸的註冊頁骨架。"
      primaryText="註冊會員"
      extraFields={[
        ["營業名稱 / 店家名稱", "請輸入名稱"],
        ["LINE ID", "請輸入 LINE ID"],
      ]}
    />
  );
}
