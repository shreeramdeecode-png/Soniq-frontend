import { useState } from 'react';

/**
 * Renders the real Trackpilots app icon when available, falling back to the
 * letter-abbreviation box (so existing visuals stay intact when there's no icon
 * or the image fails to load).
 */
export default function AppIcon({ iconUrl, abbr, size = 26, radius = 7, iconBg, iconColor, className = '' }) {
  const [errored, setErrored] = useState(false);
  const showImg = iconUrl && !errored;

  return (
    <div
      className={`flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size, borderRadius: radius, background: iconBg, color: iconColor }}
    >
      {showImg ? (
        <img
          src={iconUrl}
          alt={abbr || ''}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        abbr
      )}
    </div>
  );
}
