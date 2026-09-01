interface MatchButtonsProps {
  onLike: () => void;
  onPass: () => void;
}

export default function MatchButtons({ onLike, onPass }: MatchButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onPass}
        className="w-16 h-16 bg-bone-soft rounded-full flex items-center justify-center border-2 border-ink transition-transform duration-150 hover:-translate-y-0.5 hover:bg-flame hover:border-flame"
        aria-label="Pass"
        style={{ boxShadow: '3px 3px 0 var(--color-ink)' }}
      >
        <svg
          className="w-8 h-8 text-ink"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <button
        onClick={onLike}
        className="w-16 h-16 bg-bone-soft rounded-full flex items-center justify-center border-2 border-ink transition-transform duration-150 hover:-translate-y-0.5 hover:bg-lime hover:border-ink"
        aria-label="Like"
        style={{ boxShadow: '3px 3px 0 var(--color-ink)' }}
      >
        <svg
          className="w-8 h-8 text-ink"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
