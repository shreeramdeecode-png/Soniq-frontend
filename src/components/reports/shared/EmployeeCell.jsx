export default function EmployeeCell({ init, name, role, avatarStyle }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
        style={avatarStyle}
      >
        {init}
      </div>
      <div>
        <div className="font-semibold text-text-primary text-[11px]">{name}</div>
        {role && <div className="text-[9px] text-text-light">{role}</div>}
      </div>
    </div>
  );
}
