'use client';

import { useEffect, useState } from 'react';

type UserAvatarProps = {
  src?: string | null;
  label: string;
};

export default function UserAvatar({ src, label }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initial = label.trim().slice(0, 1).toUpperCase() || 'A';

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        className="h-14 w-14 rounded-md object-cover"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="grid h-14 w-14 place-items-center rounded-md bg-[oklch(72%_0.18_270)] text-xl font-semibold text-[oklch(16%_0.03_270)]">
      {initial}
    </div>
  );
}
