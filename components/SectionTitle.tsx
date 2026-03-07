type Props = {
  badge?: string;
  title: string;
  desc?: string;
  center?: boolean;
};

export default function SectionTitle({ badge, title, desc, center = false }: Props) {
  return (
    <div className={center ? "text-center" : ""}>
      {badge ? (
        <div className="mb-3 inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted shadow-sm">
          {badge}
        </div>
      ) : null}
      <h2 className="text-3xl font-black tracking-tight text-ink md:text-4xl">{title}</h2>
      {desc ? <p className="mt-3 text-sm leading-7 text-muted md:text-base">{desc}</p> : null}
    </div>
  );
}
