import Image from "next/image";
import Link from "next/link";
import styles from "./uva-shell.module.css";

export default function HunterBrand() {
  return (
    <Link href="/" className={styles.brand} aria-label="Hunter home">
      <Image src="/mascot/robin-icon.svg" alt="" width={42} height={46} className={styles.brandRobin} />
      <span><strong>Hunter<span className={styles.brandDot}>.</span></strong><small>UvA AI Chat</small></span>
    </Link>
  );
}
