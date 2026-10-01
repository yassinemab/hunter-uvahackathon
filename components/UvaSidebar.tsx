import Link from "next/link";
import styles from "./uva-shell.module.css";

const icons = {
  collapse: <><rect x="4" y="3" width="17" height="18" rx="1" /><path d="M15 3v18M8 8l4 4-4 4" /></>,
  chat: <><path d="M3 4h18v13H10l-5 4v-4H3Z" /><path d="M7 10h.1M12 10h.1M17 10h.1" strokeWidth="2.5" /></>,
  assistants: <><path d="M6 6h12v12H6ZM12 2v4M9 2h6M3 9h3m12 0h3M8 21l4-3 4 3" /><path d="M9 10v3m6-3v3" /></>,
  files: <><path d="M2 6h8l2 3h10v12H2ZM2 6V3h8l2 3h10v3M2 13h20" /></>,
  people: <><circle cx="10" cy="7" r="4" /><path d="M2 21v-2a8 8 0 0 1 16 0v2ZM18 4a4 4 0 0 1 0 8m2 3a6 6 0 0 1 2 6" /></>,
  tools: <><path d="M2 5h14M2 11h9M2 17h6m10-9 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" /></>,
  hunter: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m12 12 9-9m-4 0h4v4" /></>,
  help: <><circle cx="12" cy="12" r="10" /><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 4h.1" /></>,
  account: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="9" r="3" /><path d="M5 20v-1a7 7 0 0 1 14 0v1" /></>,
};

function Icon({ name }: { name: keyof typeof icons }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

/** Visual host-app context for the hackathon demo. Hunter is the working route. */
export default function UvaSidebar() {
  return (
    <aside className={styles.rail} aria-label="UvA AI Chat sidebar">
      <div className={styles.railTop}>
        <span className={styles.railIcon} role="img" aria-label="Collapsed sidebar" title="UvA AI Chat sidebar"><Icon name="collapse" /></span>
        <span className={styles.uvaWordmark}>UvA</span>
      </div>
      <div className={styles.railItems}>
        {([['chat', 'Chat'], ['assistants', 'Assistants'], ['files', 'Course files'], ['people', 'Groups'], ['tools', 'Learning tools']] as const).map(([icon, label]) => (
          <span key={icon} className={styles.railIcon} role="img" aria-label={label} title={label}><Icon name={icon} /></span>
        ))}
        <Link href="/" className={`${styles.railIcon} ${styles.active}`} aria-label="Hunter learning game" title="Hunter"><Icon name="hunter" /></Link>
      </div>
      <div className={styles.railBottom}>
        <span className={styles.railIcon} role="img" aria-label="UvA Chat help" title="UvA Chat help"><Icon name="help" /></span>
        <span className={styles.railIcon} role="img" aria-label="Account" title="Account"><Icon name="account" /></span>
      </div>
    </aside>
  );
}
