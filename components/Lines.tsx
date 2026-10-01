type HeadingTag = 'h1' | 'h2' | 'h3' | 'div';

type Props = {
  lines: string[];
  as?: HeadingTag;
  className?: string;
  reveal?: boolean;
};

/** Heading split into masked lines for the global line-reveal animation. */
export default function Lines({ lines, as: Tag = 'h2', className = '', reveal = true }: Props) {
  return (
    <Tag
      className={`display ${className}`}
      data-reveal={reveal ? 'lines' : undefined}
      aria-label={lines.join(' ')}
    >
      {lines.map((l, i) => (
        <span className="line" key={i} aria-hidden="true">
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
