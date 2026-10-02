// Découpe un texte en mots masqués pour une révélation mot par mot (style SplitText).
// `segments` : [{ text, className }] — permet de colorer un mot-clé.
export default function SplitWords({ segments }) {
  const words = segments.flatMap(({ text, className = '' }) =>
    text.split(' ').filter(Boolean).map((word) => ({ word, className })),
  );

  return words.map(({ word, className }, i) => (
    <span key={i}>
      <span className="inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
        <span className={`split-word inline-block ${className}`}>{word}</span>
      </span>
      {i < words.length - 1 && ' '}
    </span>
  ));
}
