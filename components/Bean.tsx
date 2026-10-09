export default function Bean({ className = "w-8 h-8" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="" aria-hidden className={`object-contain ${className}`} />;
}
