import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 text-xl font-bold border-b">
          LoanConnect 後台
        </div>

        <nav className="flex flex-col gap-2 p-4 text-sm">

          <Link
            href="/admin/dashboard"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            📊 儀表板
          </Link>

          <Link
            href="/admin/leads"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            📋 名單管理
          </Link>

          <Link
            href="/admin/analytics"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            📈 首頁數據
          </Link>

          <Link
            href="/admin/articles"
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            📝 網站文章
          </Link>

        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}