import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  colors,
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

interface LandingScreenProps {
  onStart: () => void;
}

// ─── Toast data ──────────────────────────────────────────────────────────────

type ToastLevel = 'info' | 'warning' | 'danger';

interface ToastData {
  icon: string;
  text: string;
  level: ToastLevel;
}

const TOASTS: ToastData[] = [
  { icon: '📋', text: 'New request: Office supplies - $45.00', level: 'info' },
  { icon: '📋', text: '3 purchase requests pending approval', level: 'info' },
  { icon: '⚠️', text: 'Unreviewed: AWS server upgrade - $12,400', level: 'warning' },
  { icon: '⚠️', text: 'Finance Slack channel has been... quiet today', level: 'warning' },
  { icon: '🚨', text: 'URGENT: 8 requests now in queue - no reviewer assigned', level: 'danger' },
  { icon: '💀', text: 'Your entire finance team just updated LinkedIn to "Open to Work"', level: 'danger' },
];

const TOAST_BORDER: Record<ToastLevel, string> = {
  info: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

// ─── Fake dashboard stats ────────────────────────────────────────────────────

const STATS = [
  { label: 'Budget Utilization', value: '67%', icon: '📊' },
  { label: 'Open Requests', value: '0', icon: '📋' },
  { label: 'Team Headcount', value: '12', icon: '👥' },
  { label: 'Approval Rate', value: '100%', icon: '✅' },
];

// ─── Animation timeline (ms) - 7s total ─────────────────────────────────────

const TOAST_START = 1000;
const TOAST_INTERVAL = 600;
const SIREN_DELAY = 1000;
const CTA_DELAY = 2000;

// ─── Indicator dot colors on the console chin ────────────────────────────────

const CHIN_DOTS = [colors.danger, colors.warning, colors.success];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [phase, setPhase] = useState<'intro' | 'chaos'>('intro');
  const [visibleToasts, setVisibleToasts] = useState(0);
  const [showSiren, setShowSiren] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (phase !== 'chaos') return;

    setVisibleToasts(0);
    setShowSiren(false);
    setShowCta(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    TOASTS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleToasts(i + 1), TOAST_START + i * TOAST_INTERVAL),
      );
    });

    const sirenTime = TOAST_START + TOASTS.length * TOAST_INTERVAL + SIREN_DELAY;
    timers.push(setTimeout(() => setShowSiren(true), sirenTime));
    timers.push(setTimeout(() => setShowCta(true), sirenTime + CTA_DELAY));

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ── Intro Splash ────────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          padding: spacing['2xl'],
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={animation.springBouncy}
          style={{
            fontFamily: fonts.heading,
            fontSize: '4.5rem',
            fontWeight: fontWeights.bold,
            color: colors.primary,
            textAlign: 'center',
            lineHeight: lineHeights.tight,
            textShadow: `
              3px 3px 0 ${colors.text},
              -1px -1px 0 ${colors.text},
              1px -1px 0 ${colors.text},
              -1px 1px 0 ${colors.text},
              0 6px 0 ${colors.text}
            `,
            margin: 0,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
          }}
        >
          Procurement<br />Panic
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: animation.duration.slow, ease: animation.easing }}
          style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.xl,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '420px',
            lineHeight: lineHeights.normal,
            margin: 0,
          }}
        >
          a game about why Zip seems like a cool company.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, ...animation.springGentle }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPhase('chaos')}
          style={{
            marginTop: spacing.md,
            padding: `${spacing.md} ${spacing['2xl']}`,
            background: colors.secondary,
            color: colors.textOnColor,
            fontFamily: fonts.heading,
            fontSize: fontSizes['2xl'],
            fontWeight: fontWeights.bold,
            borderRadius: radii.pill,
            border: 'none',
            cursor: 'pointer',
            boxShadow: shadows.lg,
          }}
        >
          Start Game →
        </motion.button>
      </div>
    );
  }

  // ── Chaos Phase (console-framed dashboard + toast/siren sequence) ───────────

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      {/* Game title above the console */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={animation.spring}
        style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes['4xl'],
          fontWeight: fontWeights.bold,
          color: colors.primary,
          textAlign: 'center',
          textShadow: `2px 2px 0 ${colors.text}, 0 4px 0 ${colors.text}`,
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
        }}
      >
        Procurement Panic
      </motion.div>

      {/* ── Arcade Console Frame ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animation.duration.slow, ease: animation.easing }}
        style={{
          background: colors.text,
          borderRadius: radii.xl,
          padding: `${spacing.md} ${spacing.lg} ${spacing.xl}`,
          boxShadow: shadows.xl,
          maxWidth: '780px',
          width: '100%',
        }}
      >
        {/* Console screen area */}
        <div
          style={{
            position: 'relative',
            background: colors.bg,
            borderRadius: radii.lg,
            boxShadow: shadows.inner,
            overflow: 'hidden',
            padding: spacing.lg,
            minHeight: '400px',
          }}
        >
          {/* ── Dashboard content (dims when siren shows) ── */}
          <motion.div
            animate={{
              opacity: showSiren ? 0.15 : 1,
              filter: showSiren ? 'blur(3px)' : 'blur(0px)',
            }}
            transition={{ duration: animation.duration.slow, ease: animation.easing }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* System label + badge */}
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <p
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSizes.xs,
                  color: colors.textMuted,
                  marginBottom: spacing.sm,
                }}
              >
                Procurement Management System v4.2.1
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.xs} ${spacing.md}`,
                  background: colors.secondaryLight,
                  color: colors.secondary,
                  fontFamily: fonts.body,
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  borderRadius: radii.pill,
                }}
              >
                ✅ All Systems Normal
              </span>
            </div>

            {/* Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: spacing.sm,
                width: '100%',
                marginBottom: spacing.lg,
              }}
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: colors.surface,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    textAlign: 'center',
                    boxShadow: shadows.sm,
                    borderBottom: `${spacing['2xs']} solid ${colors.success}`,
                  }}
                >
                  <div style={{ fontSize: fontSizes.xl, marginBottom: spacing['2xs'] }}>
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fontSizes['2xl'],
                      fontWeight: fontWeights.bold,
                      color: colors.text,
                      lineHeight: lineHeights.snug,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.body,
                      fontSize: fontSizes.xs,
                      color: colors.textSecondary,
                      marginTop: spacing['2xs'],
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: colors.surface,
                borderRadius: radii.md,
                padding: spacing.md,
                boxShadow: shadows.sm,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.xs,
                  fontWeight: fontWeights.semibold,
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  marginBottom: spacing.xs,
                }}
              >
                Recent Activity
              </div>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: fontSizes.sm,
                  color: colors.textSecondary,
                  margin: 0,
                }}
              >
                Nothing to report. Have a great day! 😊
              </p>
            </div>
          </motion.div>

          {/* ── Toast Stack (inside the console screen) ── */}
          <motion.div
            animate={{ opacity: showSiren ? 0 : 1 }}
            transition={{ duration: animation.duration.fast }}
            style={{
              position: 'absolute',
              top: spacing.sm,
              right: spacing.sm,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              zIndex: zIndex.toast,
              maxWidth: '280px',
              width: '100%',
            }}
          >
            <AnimatePresence>
              {TOASTS.slice(0, visibleToasts).map((toast, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={animation.spring}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing.xs,
                    padding: spacing.sm,
                    background: colors.surface,
                    borderRadius: radii.sm,
                    boxShadow: shadows.md,
                    borderLeft: `${spacing['2xs']} solid ${TOAST_BORDER[toast.level]}`,
                  }}
                >
                  <span style={{ fontSize: fontSizes.md, flexShrink: 0 }}>
                    {toast.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.body,
                      fontSize: fontSizes.xs,
                      color: colors.text,
                      lineHeight: lineHeights.normal,
                    }}
                  >
                    {toast.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── Siren Banner + CTA (overlays inside the screen area) ── */}
          <AnimatePresence>
            {showSiren && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: animation.duration.normal }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.lg,
                  zIndex: zIndex.overlay,
                  background: colors.overlay,
                  borderRadius: radii.lg,
                }}
              >
                {/* Banner entrance */}
                <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={animation.springBouncy}
                  style={{ width: '100%' }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.82, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      width: '100%',
                      padding: `${spacing.lg} ${spacing.md}`,
                      background: colors.danger,
                      textAlign: 'center',
                      boxShadow: shadows.glow(colors.danger),
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSizes['2xl'],
                        fontWeight: fontWeights.bold,
                        color: colors.textOnColor,
                        lineHeight: lineHeights.snug,
                      }}
                    >
                      🚨 YOUR FINANCE TEAM HAS LEFT THE BUILDING.
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.heading,
                        fontSize: fontSizes.xl,
                        fontWeight: fontWeights.semibold,
                        color: colors.textOnColor,
                        marginTop: spacing.xs,
                        opacity: 0.9,
                      }}
                    >
                      YOU'RE IN CHARGE NOW.
                    </div>
                  </motion.div>
                </motion.div>

                {/* CTA Button */}
                <AnimatePresence>
                  {showCta && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={animation.springGentle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onStart}
                      style={{
                        padding: `${spacing.md} ${spacing['2xl']}`,
                        background: colors.primary,
                        color: colors.textOnColor,
                        fontFamily: fonts.heading,
                        fontSize: fontSizes['2xl'],
                        fontWeight: fontWeights.bold,
                        borderRadius: radii.pill,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: shadows.lg,
                      }}
                    >
                      Save the Budget →
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Console chin - decorative dots + label */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: spacing.md,
          }}
        >
          <div style={{ display: 'flex', gap: spacing.xs }}>
            {CHIN_DOTS.map((dotColor, i) => (
              <div
                key={i}
                style={{
                  width: spacing.xs,
                  height: spacing.xs,
                  borderRadius: radii.circle,
                  background: dotColor,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: fontSizes.xs,
              color: colors.textMuted,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Uncontrolled Chaos Corp
          </span>
        </div>
      </motion.div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: spacing.sm,
          zIndex: zIndex.overlay,
        }}
      >
        <a
          href="https://heyimhelen.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.xs,
            color: colors.textMuted,
            textDecoration: 'none',
            opacity: 0.7,
          }}
        >
          Made with care by Helen Highwater
        </a>
      </div>
    </div>
  );
}
