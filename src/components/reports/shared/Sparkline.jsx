export default function Sparkline({ values }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[2px] h-[22px]">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-[5px] rounded-[2px]"
          style={{
            height: `${Math.max(4, (v / max) * 22)}px`,
            background: `rgba(15,110,86,${0.25 + (v / max) * 0.75})`,
          }}
        />
      ))}
    </div>
  );
}
