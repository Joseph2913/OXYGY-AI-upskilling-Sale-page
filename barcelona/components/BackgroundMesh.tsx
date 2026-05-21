export function BackgroundMesh() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(56, 178, 172, 0.06) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 80% 70%, rgba(195, 208, 245, 0.04) 0%, transparent 55%)',
      }}
      aria-hidden
    />
  );
}
