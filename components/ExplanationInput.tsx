import { useId } from "react";
import styles from "./lesson-ui.module.css";

export default function ExplanationInput({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputId = useId();
  return (
    <div className={styles.explanationCard}>
      <div className={styles.explanationHeading}>
        <label htmlFor={inputId}>{label}</label>
        <span>YOUR REASONING</span>
      </div>
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Explain what you know, and why the claim misses the mark..."
        disabled={disabled}
        rows={3}
        className={styles.explanationInput}
      />
    </div>
  );
}
