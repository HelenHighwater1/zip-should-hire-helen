import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { DEPARTMENTS, DEPARTMENT_ORDER, type DepartmentId } from '../data/DEPARTMENTS';
import { ROGUE_SPEND_CAP } from '../data/CARDS';
import {
  colors,
  deptColors,
  deptColorsLight,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  radii,
  shadows,
  animation,
  zIndex,
} from '../theme';

// ─── Props ───────────────────────────────────────────────────────────────────

interface EndScreenProps {
  rogueSpend: number;
  accuracy: number;
  spendByDepartment: Record<DepartmentId, number>;
  rogueSpendOverTime: { cardNumber: number; rogueSpend: number }[];
  didWin: boolean;
  onRestart: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDollars(n: number): string {
  return `$${n.toLocaleString()}`;
}

// ─── Animation variants ─────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: animation.easing },
  },
};

// ─── Custom Recharts tooltip ─────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  labelPrefix,
  valueLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
  labelPrefix?: string;
  valueLabel?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div
      style={{
        background: colors.surface,
        fontFamily: fonts.body,
        fontSize: fontSizes.sm,
        borderRadius: radii.md,
        border: `1px solid ${colors.borderLight}`,
        boxShadow: shadows.md,
        padding: `${spacing.xs} ${spacing.sm}`,
      }}
    >
      {labelPrefix && (
        <div style={{ color: colors.textMuted, marginBottom: spacing['2xs'] }}>
          {labelPrefix}
        </div>
      )}
      <div style={{ fontWeight: fontWeights.semibold, color: colors.text }}>
        {valueLabel ? `${valueLabel}: ` : ''}
        {formatDollars(val)}
      </div>
    </div>
  );
}

// ─── EndScreen ───────────────────────────────────────────────────────────────

export default function EndScreen({
  rogueSpend,
  accuracy,
  spendByDepartment,
  rogueSpendOverTime,
  didWin,
  onRestart,
}: EndScreenProps) {
  const [hoveredDept, setHoveredDept] = useState<DepartmentId | null>(null);

  const donutData = DEPARTMENT_ORDER.map(id => ({
    id,
    name: DEPARTMENTS[id].label,
    value: spendByDepartment[id],
    color: deptColors[id],
  })).filter(d => d.value > 0);

  const hoveredDeptData = hoveredDept ? DEPARTMENTS[hoveredDept] : null;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{
        minHeight: '100dvh',
        background: colors.bg,
        padding: `${spacing['3xl']} ${spacing.lg} ${spacing['2xl']}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing['2xl'],
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      {/* ── Win / Lose Header ─────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={animation.springBouncy}
          style={{ fontSize: '4rem', marginBottom: spacing.sm }}
        >
          {didWin ? '🏆' : '💥'}
        </motion.div>
        <h1
          style={{
            fontFamily: fonts.heading,
            fontSize: fontSizes['5xl'],
            fontWeight: fontWeights.bold,
            color: didWin ? colors.success : colors.danger,
            margin: 0,
            lineHeight: lineHeights.tight,
          }}
        >
          {didWin ? 'Budget Saved!' : 'Budget Busted'}
        </h1>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.lg,
            color: colors.textSecondary,
            marginTop: spacing.sm,
            lineHeight: lineHeights.normal,
            maxWidth: '520px',
            margin: `${spacing.sm} auto 0`,
          }}
        >
          {didWin
            ? 'Against all odds, Uncontrolled Chaos Corp lives to spend another day. The CFO is weeping tears of joy.'
            : 'Uncontrolled Chaos Corp has declared bankruptcy. Todd is somehow fine.'}
        </p>
      </motion.div>

      {/* ── Hero Stats ────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        style={{
          display: 'flex',
          gap: spacing.lg,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: '280px',
            background: colors.surface,
            borderRadius: radii.lg,
            padding: spacing.lg,
            boxShadow: shadows.sm,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSizes.xs,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: fontWeights.semibold,
              marginBottom: spacing.xs,
            }}
          >
            Rogue Spend
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: fontSizes['4xl'],
              fontWeight: fontWeights.bold,
              color:
                rogueSpend >= ROGUE_SPEND_CAP ? colors.danger : colors.text,
            }}
          >
            {formatDollars(rogueSpend)}
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: fontSizes.sm,
              color: colors.textMuted,
              marginTop: spacing['2xs'],
            }}
          >
            of {formatDollars(ROGUE_SPEND_CAP)} cap
          </div>
        </div>

        <div
          style={{
            flex: 1,
            maxWidth: '280px',
            background: colors.surface,
            borderRadius: radii.lg,
            padding: spacing.lg,
            boxShadow: shadows.sm,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSizes.xs,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: fontWeights.semibold,
              marginBottom: spacing.xs,
            }}
          >
            Routing Accuracy
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: fontSizes['4xl'],
              fontWeight: fontWeights.bold,
              color:
                accuracy >= 80
                  ? colors.success
                  : accuracy >= 60
                    ? colors.warning
                    : colors.danger,
            }}
          >
            {accuracy}%
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: fontSizes.sm,
              color: colors.textMuted,
              marginTop: spacing['2xs'],
            }}
          >
            correctly routed
          </div>
        </div>
      </motion.div>

      {/* ── Charts ────────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        style={{ display: 'flex', gap: spacing.lg, width: '100%' }}
      >
        {/* Donut - Spend by Department */}
        <div
          style={{
            flex: 1,
            background: colors.surface,
            borderRadius: radii.lg,
            padding: spacing.lg,
            boxShadow: shadows.sm,
          }}
        >
          <h3
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSizes.md,
              fontWeight: fontWeights.semibold,
              color: colors.text,
              margin: 0,
              marginBottom: spacing.md,
            }}
          >
            Spend by Department
          </h3>

          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map(entry => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={<ChartTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.body,
                fontSize: fontSizes.sm,
                color: colors.textMuted,
              }}
            >
              No spend routed
            </div>
          )}

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.sm,
              marginTop: spacing.sm,
            }}
          >
            {donutData.map(d => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing['2xs'],
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: radii.circle,
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fontSizes.xs,
                    color: colors.textSecondary,
                  }}
                >
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Area - Rogue Spend Over Time */}
        <div
          style={{
            flex: 1,
            background: colors.surface,
            borderRadius: radii.lg,
            padding: spacing.lg,
            boxShadow: shadows.sm,
          }}
        >
          <h3
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSizes.md,
              fontWeight: fontWeights.semibold,
              color: colors.text,
              margin: 0,
              marginBottom: spacing.md,
            }}
          >
            Rogue Spend Over Time
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={rogueSpendOverTime}>
              <defs>
                <linearGradient id="rogueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={colors.danger}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={colors.danger}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.borderLight}
              />
              <XAxis
                dataKey="cardNumber"
                tick={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  fill: colors.textMuted,
                }}
                axisLine={{ stroke: colors.borderLight }}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  fill: colors.textMuted,
                }}
                axisLine={{ stroke: colors.borderLight }}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
              />
              <RechartsTooltip
                content={
                  <ChartTooltip
                    labelPrefix="Cards processed"
                    valueLabel="Rogue Spend"
                  />
                }
              />
              <Area
                type="stepAfter"
                dataKey="rogueSpend"
                stroke={colors.danger}
                strokeWidth={2}
                fill="url(#rogueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Department Hover Cards ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ width: '100%', position: 'relative' }}>
        <h3
          style={{
            fontFamily: fonts.heading,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.semibold,
            color: colors.text,
            margin: 0,
            marginBottom: spacing.md,
            textAlign: 'center',
          }}
        >
          Department Routing Rules
        </h3>

        <div
          style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'center',
          }}
        >
          {DEPARTMENT_ORDER.map(id => {
            const dept = DEPARTMENTS[id];
            const isHovered = hoveredDept === id;
            const spent = spendByDepartment[id];
            return (
              <div
                key={id}
                onMouseEnter={() => setHoveredDept(id)}
                onMouseLeave={() => setHoveredDept(null)}
                style={{
                  width: 160,
                  background: isHovered
                    ? deptColorsLight[id]
                    : colors.surface,
                  border: `2px solid ${deptColors[id]}`,
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: `all ${animation.duration.fast}s ease`,
                  transform: isHovered
                    ? 'translateY(-4px)'
                    : 'translateY(0)',
                  boxShadow: isHovered
                    ? shadows.glow(deptColors[id])
                    : shadows.sm,
                }}
              >
                <div style={{ fontSize: fontSizes['3xl'] }}>{dept.emoji}</div>
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: fontSizes.md,
                    fontWeight: fontWeights.semibold,
                    color: colors.text,
                    marginTop: spacing['2xs'],
                  }}
                >
                  {dept.label}
                </div>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: fontSizes.xs,
                    color: colors.textSecondary,
                    marginTop: spacing['2xs'],
                  }}
                >
                  {formatDollars(spent)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover detail panel */}
        <AnimatePresence mode="wait">
          {hoveredDeptData && (
            <motion.div
              key={hoveredDept}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '100%',
                marginTop: spacing.sm,
                background: colors.surface,
                borderRadius: radii.lg,
                padding: spacing.lg,
                boxShadow: shadows.lg,
                borderLeft: `4px solid ${deptColors[hoveredDept!]}`,
                zIndex: zIndex.overlay,
              }}
            >
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.sm,
                  color: colors.text,
                  lineHeight: lineHeights.relaxed,
                  margin: 0,
                }}
              >
                <strong>Routing rule:</strong> {hoveredDeptData.rule}
              </p>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.sm,
                  color: colors.secondary,
                  lineHeight: lineHeights.relaxed,
                  margin: 0,
                  marginTop: spacing.sm,
                }}
              >
                <strong>How Zip handles this:</strong>{' '}
                {hoveredDeptData.zipCallout}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Zip CTA + Play Again ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        style={{
          textAlign: 'center',
          paddingTop: spacing.lg,
          borderTop: `1px solid ${colors.borderLight}`,
          width: '100%',
        }}
      >
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.lg,
            color: colors.text,
            lineHeight: lineHeights.normal,
            fontWeight: fontWeights.semibold,
            margin: 0,
          }}
        >
          Zip routes all of this automatically. 
        </p>
        <p
          style={{
            display: 'inline-block',
            fontFamily: fonts.heading,
            fontSize: fontSizes.md,
            color: colors.secondary,
            fontWeight: fontWeights.semibold,
            margin: 0,
          }}
        >
          Helen wants to work with Zip. Zip hiring managers should check out her{' '}
          <a
            href="https://heyimhelen.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.secondary,
              textDecoration: 'underline',
            }}
          >
            portfolio site →
          </a>

        </p>

        <div style={{ marginTop: spacing['2xl'] }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSizes.xl,
              fontWeight: fontWeights.bold,
              color: colors.textOnColor,
              background: colors.secondary,
              border: 'none',
              borderRadius: radii.lg,
              padding: `${spacing.md} ${spacing['2xl']}`,
              cursor: 'pointer',
              boxShadow: shadows.md,
            }}
          >
            🔄 Play Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
