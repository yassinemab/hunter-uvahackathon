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

const ROW_HEIGHT = 136;
const NODE_SIZE = 64;
const FINAL_NODE_SIZE = 80;
const X_POSITIONS = [18, 50, 82];

function nodeSize(node: WindingPathNode): number {
  return node.variant === "final" ? FINAL_NODE_SIZE : NODE_SIZE;
}

/**
 * Lays out a sequence of nodes as a winding "roadmap" path: alternating
 * left/center/right positions connected by a smooth dashed S-curve. Position
 * is computed purely from index/count, so it's deterministic and safe to
 * render on the server (no DOM measurement required).
 */
export default function WindingPath({ nodes }: { nodes: WindingPathNode[] }) {
  const single = nodes.length === 1;
  const maxSize = Math.max(...nodes.map(nodeSize), NODE_SIZE);
  const height = (nodes.length - 1) * ROW_HEIGHT + maxSize + 28;

  const points = nodes.map((node, i) => ({
    node,
    xPercent: single ? 50 : X_POSITIONS[i % X_POSITIONS.length],
    y: i * ROW_HEIGHT + maxSize / 2,
  }));

  let pathD = "";
  points.forEach((p, i) => {
    if (i === 0) {
      pathD += `M ${p.xPercent} ${p.y}`;
      return;
    }
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    pathD += ` C ${prev.xPercent} ${midY}, ${p.xPercent} ${midY}, ${p.xPercent} ${p.y}`;
  });

  return (
    <div className="relative mx-auto w-full max-w-xs" style={{ height }}>
      {points.length > 1 && (
        <svg
          aria-hidden
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-zinc-300 dark:text-zinc-700"
        >
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeDasharray="2 9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {points.map(({ node, xPercent, y }) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2"
          style={{ left: `${xPercent}%`, top: y - nodeSize(node) / 2 }}
        >
          <PathNode
            href={node.href}
            label={node.label}
            isCompleted={node.isCompleted}
            isActive={node.isActive}
            variant={node.variant}
            tooltip={node.tooltip}
          />
        </div>
      ))}
    </div>
  );
}
