import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}