interface ConfidenceBadgeProps {
  value: number;
}

export default function ConfidenceBadge({ value }: ConfidenceBadgeProps) {
  const level = value >= 0.9 ? "high" : value >= 0.75 ? "medium" : "low";

  return <span className={`confidence confidence-${level}`}>{Math.round(value * 100)}%</span>;
}
