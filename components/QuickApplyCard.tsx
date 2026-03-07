export default function QuickApplyCard() {
  return (
    <div className="w-full rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_rgba(62,58,52,0.08)] backdrop-blur md:p-9">
      <div className="mb-4 inline-flex rounded-full border border-[#bde7d4] bg-[#e9fbf3] px-3 py-1 text-xs font-semibold text-[#2c8b67]">
        30 秒快速填寫
      </div>

      <h2 className="text-3xl font-black tracking-tight text-[#2f2a25]">
        立即開始需求評估
      </h2>

      <p className="mt-4 text-sm leading-7 text-[#7b746c]">
        用更乾淨、更高信任感的表單設計取代傳統名單站風格，
        讓轉換率和品牌感一起提升。
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#5d564f]"
          >
            姓名 / 稱呼
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="請輸入姓名"
            className="w-full rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition placeholder:text-[#b1a79d] focus:border-[#bcae9d]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-[#5d564f]"
            >
              手機號碼
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="09xx-xxx-xxx"
              className="w-full rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition placeholder:text-[#b1a79d] focus:border-[#bcae9d]"
            />
          </div>

          <div>
            <label
              htmlFor="line"
              className="mb-2 block text-sm font-semibold text-[#5d564f]"
            >
              LINE ID
            </label>
            <input
              id="line"
              name="line"
              type="text"
              placeholder="請輸入 LINE ID"
              className="w-full rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition placeholder:text-[#b1a79d] focus:border-[#bcae9d]"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-semibold text-[#5d564f]"
            >
              所在地區
            </label>
            <select
              id="city"
              name="city"
              className="w-full rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition focus:border-[#bcae9d]"
              defaultValue=""
            >
              <option value="" disabled>
                請選擇縣市
              </option>
              <option value="taipei">台北市</option>
              <option value="new-taipei">新北市</option>
              <option value="taoyuan">桃園市</option>
              <option value="taichung">台中市</option>
              <option value="tainan">台南市</option>
              <option value="kaohsiung">高雄市</option>
              <option value="other">其他地區</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-semibold text-[#5d564f]"
            >
              需求金額
            </label>
            <select
              id="amount"
              name="amount"
              className="w-full rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition focus:border-[#bcae9d]"
              defaultValue=""
            >
              <option value="" disabled>
                請選擇金額範圍
              </option>
              <option value="1-10">10 萬內</option>
              <option value="10-30">10 萬 - 30 萬</option>
              <option value="30-50">30 萬 - 50 萬</option>
              <option value="50-100">50 萬 - 100 萬</option>
              <option value="100+">100 萬以上</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-[#5d564f]"
          >
            需求說明
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="簡述需求內容，例如用途、期望聯繫時間、其他備註"
            className="w-full resize-none rounded-[16px] border border-[#ddd3c8] bg-white px-4 py-3.5 text-sm text-[#2f2a25] outline-none transition placeholder:text-[#b1a79d] focus:border-[#bcae9d]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-[18px] bg-[#3e3a34] px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
        >
          立即送出需求
        </button>

        <p className="text-center text-xs leading-5 text-[#8a8178]">
          資料僅用於需求評估與聯繫說明，不會公開或外流，評估後再決定是否申請。
        </p>
      </form>
    </div>
  );
}