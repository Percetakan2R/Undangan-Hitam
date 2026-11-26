interface QrCodeSvgProps {
  value: string;
  size?: number;
}

export function QrCodeSvg({ value, size = 144 }: QrCodeSvgProps) {
  // Deterministic 21x21 QR-style matrix seeded by guest name
  const gridSize = 21;
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const isFinderArea = (r: number, c: number) => {
    const topLeft = r < 7 && c < 7;
    const topRight = r < 7 && c >= gridSize - 7;
    const bottomLeft = r >= gridSize - 7 && c < 7;
    return topLeft || topRight || bottomLeft;
  };

  const isFinderFilled = (r: number, c: number) => {
    const lr = r >= gridSize - 7 ? r - (gridSize - 7) : r;
    const lc = c >= gridSize - 7 ? c - (gridSize - 7) : c;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < gridSize; r += 1) {
    for (let c = 0; c < gridSize; c += 1) {
      if (isFinderArea(r, c)) {
        if (isFinderFilled(r, c)) cells.push({ r, c });
      } else {
        const bitSeed = (hash ^ (r * 31 + c * 17) ^ ((r + 1) * (c + 3) * 13)) >>> 0;
        if (bitSeed % 2 === 0 || (r === 6 && c % 2 === 0) || (c === 6 && r % 2 === 0)) {
          cells.push({ r, c });
        }
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize + 2} ${gridSize + 2}`}
      role="img"
      aria-label={`Kode QR check-in untuk ${value}`}
      className="block rounded-xl bg-[#E9E1DA] p-2"
    >
      <rect width={gridSize + 2} height={gridSize + 2} fill="#E9E1DA" />
      {cells.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={c + 1}
          y={r + 1}
          width={0.92}
          height={0.92}
          rx={0.15}
          fill="#100E0A"
        />
      ))}
    </svg>
  );
}
