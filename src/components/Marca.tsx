import { useId } from "react";

/** Isotipo: un tomate con código (</>) y un cursor en el tallo → "Tu marca en cada click". */
export function Isotipo({ className, titulo }: { className?: string; titulo?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
    >
      <defs>
        <linearGradient id={`tb${id}`} x1="0.15" y1="0.1" x2="0.85" y2="1">
          <stop offset="0" stopColor="#E07A5A" />
          <stop offset="0.45" stopColor="#C2482F" />
          <stop offset="1" stopColor="#8E2A1E" />
        </linearGradient>
        <linearGradient id={`lf${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B5C08E" />
          <stop offset="1" stopColor="#6F7F4A" />
        </linearGradient>
      </defs>
      <path
        d="M60 34 C 70 27, 104 32, 107 66 C 110 96, 86 112, 60 112 C 34 112, 10 96, 13 66 C 16 32, 50 27, 60 34 Z"
        fill={`url(#tb${id})`}
      />
      <ellipse cx="38" cy="54" rx="13" ry="7.5" transform="rotate(-32 38 54)" fill="#fff" opacity=".28" />
      <g fill="none" stroke="#F3EADC" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M42 63 L30 75 L42 87" />
        <path d="M78 63 L90 75 L78 87" />
        <path d="M66 59 L54 91" />
      </g>
      <path
        d="M60 38 C 50 39, 38 41, 29 35 C 38 30, 48 29, 55 31 C 49 26, 46 19, 48 13 C 55 18, 59 23, 61 29 C 65 24, 72 20, 81 20 C 77 26, 72 30, 67 32 C 75 31, 84 33, 91 38 C 80 41, 69 40, 60 38 Z"
        fill={`url(#lf${id})`}
      />
      <path
        transform="translate(4 9)"
        d="M62 4 L62 26 L67.5 20.5 L71.5 29 L75.5 27.2 L71.6 18.8 L79 18.8 Z"
        fill="#F3EADC"
        stroke="#291C0E"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logotipo() {
  return (
    <>
      <Isotipo />
      <span className="marca-texto">
        <b>tomate</b>
        <span>desarrollo web</span>
      </span>
    </>
  );
}

export function IconoWhatsApp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function IconoInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
