import Link from "next/link";

const regions = [
  { label: "台北基隆", slug: "taipei-keelung" },
  { label: "桃竹苗", slug: "taoyuan-hsinchu-miaoli" },
  { label: "中彰投", slug: "taichung-changhua-nantou" },
  { label: "雲嘉南", slug: "yunlin-chiayi-tainan" },
  { label: "高屏", slug: "kaohsiung-pingtung" },
  { label: "宜花東", slug: "yilan-hualien-taitung" },
  { label: "澎金馬", slug: "penghu-kinmen-matsu" },
];

export default function LendersPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
            各區金主
          </h1>
          <p className="mt-3 text-base text-[#6b6258] md:text-lg">
            依照地區快速查看放款資訊，協助借款方更快找到適合的放款方。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((item) => (
            <Link
              key={item.slug}
              href={`/lenders/${item.slug}`}
              className="rounded-3xl border border-[#e8dfd3] bg-white px-6 py-6 text-lg font-bold text-[#2f2a25] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}