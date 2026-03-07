import Link from "next/link"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">

        <Link href="/" className="text-lg font-black">
          LoanConnect
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/">首頁</Link>
          <Link href="/borrow">貸款申請</Link>
          <Link href="/articles">貸款知識</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

      </div>
    </header>
  )
}