export default function ReportInsights({ items }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <div
          key={item.title}
          className="p-3 rounded-xl border"
          style={{ background: item.bg, borderColor: item.border }}
        >
          <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1.5" style={{ color: item.titleColor }}>
            {item.icon}
            {item.title}
          </div>
          <p className="text-[10px] text-[#888] leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
