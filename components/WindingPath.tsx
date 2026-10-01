import Image from "next/image";
import PathNode from "./PathNode";

export type WindingPathNode = {
  id: string;
  href: string;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
  variant?: "default" | "final";
  tooltip?: string;
};

const ROW_HEIGHT = 148;
const NODE_SIZE = 110;
const X_POSITIONS = [27, 67, 37];

/** Static, deterministic forest paths. Existing level links remain selectable. */
export default function WindingPath({ nodes }: { nodes: WindingPathNode[] }) {
  const single = nodes.length === 1;
  const height = (nodes.length - 1) * ROW_HEIGHT + NODE_SIZE + 74;
  const points = nodes.map((node, i) => ({
    node,
    xPercent: single ? 50 : X_POSITIONS[i % X_POSITIONS.length],
    y: i * ROW_HEIGHT + NODE_SIZE / 2 + 28,
  }));

  let pathD = "";
  points.forEach((p, i) => {
    if (i === 0) {
      pathD += `M ${p.xPercent} ${p.y + 20}`;
      return;
    }
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2 + 20;
    pathD += ` C ${prev.xPercent} ${midY}, ${p.xPercent} ${midY}, ${p.xPercent} ${p.y + 20}`;
  });

  return (
    <div className="forest-winding-path" style={{ height }}>
      {points.length > 1 && (
        <svg aria-hidden="true" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="forest-dirt-path">
          <path d={pathD} fill="none" stroke="#d4bd91" strokeWidth={34} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={pathD} fill="none" stroke="#e6d4ad" strokeWidth={27} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={pathD} fill="none" stroke="#b9a37c" strokeWidth={2} strokeDasharray="1 17 2 29" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {!single && <>
        <Image src="/forest/woodland.svg" alt="" width={110} height={83} className="forest-decoration forest-decoration-right" aria-hidden="true" />
        <Image src="/forest/woodland.svg" alt="" width={88} height={66} className="forest-decoration forest-decoration-left" aria-hidden="true" />
        <span className="forest-sprig forest-sprig-one" aria-hidden="true" />
        <span className="forest-sprig forest-sprig-two" aria-hidden="true" />
      </>}
      {points.map(({ node, xPercent, y }) => (
        <div key={node.id} className="forest-node-position" style={{ left: `${xPercent}%`, top: y - NODE_SIZE / 2 }}>
          <PathNode href={node.href} label={node.label} isCompleted={node.isCompleted} isActive={node.isActive} variant={node.variant} tooltip={node.tooltip} />
        </div>
      ))}
    </div>
  );
}
