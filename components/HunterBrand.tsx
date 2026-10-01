import Image from "next/image";
import Link from "next/link";
import styles from "./uva-shell.module.css";

export default function HunterBrand() {
  return (
    <Link href="/" className={styles.brand} aria-label="Hunter home">
      <Image src="/mascot/robin-icon.svg" alt="" width={42} height={46} className={styles.brandRobin} />
      <span>
        <strong>Hunter<span className={styles.brandDot}>.</span></strong>
        <Image src="/uva-logo-horizontal.png" alt="University of Amsterdam" width={1097} height={134} sizes="190px" className={styles.brandUva} />
      </span>
    </Link>
  );
}
