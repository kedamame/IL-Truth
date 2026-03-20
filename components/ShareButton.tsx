'use client';

import sdk from '@farcaster/frame-sdk';
import { t, Lang } from '@/lib/i18n';

interface Props {
  castText: string;
  lang: Lang;
}

export default function ShareButton({ castText, lang }: Props) {
  const tx = t[lang];

  const handleShare = async () => {
    const composeUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`;
    try {
      await sdk.actions.openUrl(composeUrl);
    } catch {
      window.open(composeUrl, '_blank');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-6"
    >
      <span>📣</span>
      {tx.shareBtn}
    </button>
  );
}
