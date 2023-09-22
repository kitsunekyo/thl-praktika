import Link from "next/link";

export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="spacing text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-500">
      <Link href="/" className="py-2" onClick={onNavigate}>
        THL Praktika
      </Link>
    </div>
  );
}
