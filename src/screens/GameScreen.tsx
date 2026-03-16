import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { DEPARTMENTS, DEPARTMENT_ORDER, type DepartmentId } from '../data/DEPARTMENTS';
import { type Card, ROGUE_SPEND_CAP, buildStagedDeck, STAGES } from '../data/CARDS';
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
  game,
} from '../theme';

// ─── Game result (passed to onWin / onLose) ─────────────────────────────────

export interface GameResult {
  rogueSpend: number;
  totalCards: number;
  correctRoutes: number;
  fallenOff: number;
  accuracy: number;
  spendByDepartment: Record<DepartmentId, number>;
  rogueSpendTimeline: { cardNumber: number; rogueSpend: number }[];
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface GameScreenProps {
  onWin: (result: GameResult) => void;
  onLose: (result: GameResult) => void;
}

// ─── Belt card state ─────────────────────────────────────────────────────────

interface BeltCard {
  card: Card;
  x: number;
  isPaused: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BOUNCE_PENALTY = 15;
const FALL_OFF_X = -12;

// ─── Stage logic ─────────────────────────────────────────────────────────────

const STAGE_BOUNDARIES: number[] = [];
{
  let sum = 0;
  for (const s of STAGES) {
    sum += s.cardCount;
    STAGE_BOUNDARIES.push(sum);
  }
}

function getStageIndex(deckIndex: number): number {
  for (let i = 0; i < STAGE_BOUNDARIES.length; i++) {
    if (deckIndex < STAGE_BOUNDARIES[i]) return i;
  }
  return STAGES.length - 1;
}

function isFirstCardOfStage(deckIndex: number): boolean {
  if (deckIndex === 0) return true;
  return STAGE_BOUNDARIES.includes(deckIndex);
}

interface RoutingLog {
  correct: number;
  fallen: number;
  spendByDept: Record<DepartmentId, number>;
  timeline: { cardNumber: number; rogueSpend: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDollars(n: number): string {
  return `$${n.toLocaleString()}`;
}

// ─── CardFace (shared between belt and drag overlay) ─────────────────────────

function CardFace({ card, isDragging = false }: { card: Card; isDragging?: boolean }) {
  return (
    <div
      style={{
        width: game.cardWidth,
        height: game.cardHeight,
        background: colors.surface,
        borderRadius: radii.md,
        boxShadow: isDragging ? shadows.cardHover : shadows.md,
        padding: spacing.md,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'rotate(-2deg)' : undefined,
        userSelect: 'none',
        overflow: 'hidden',
        border: `2px solid ${colors.borderLight}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: fontSizes.md,
              fontWeight: fontWeights.semibold,
              color: colors.text,
            }}
          >
            {card.employee}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: fontSizes.xs,
              color: colors.textMuted,
            }}
          >
            {card.department}
          </div>
        </div>
        {card.urgency === 'urgent' && (
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: fontSizes.xs,
              fontWeight: fontWeights.bold,
              color: colors.textOnColor,
              background: colors.danger,
              padding: `${spacing['2xs']} ${spacing.xs}`,
              borderRadius: radii.pill,
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            Urgent
          </span>
        )}
      </div>

      <p
        style={{
          fontFamily: fonts.body,
          fontSize: fontSizes.xs,
          color: colors.textSecondary,
          lineHeight: lineHeights.normal,
          margin: 0,
          flex: 1,
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs,
        }}
      >
        {card.description}
      </p>

      <div
        style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes.xl,
          fontWeight: fontWeights.bold,
          color: colors.text,
          textAlign: 'right',
        }}
      >
        {formatDollars(card.amount)}
      </div>
    </div>
  );
}

// ─── DeptBucket (droppable) ──────────────────────────────────────────────────

function DeptBucket({ deptId }: { deptId: DepartmentId }) {
  const dept = DEPARTMENTS[deptId];
  const { setNodeRef, isOver } = useDroppable({ id: deptId });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: game.bucketWidth,
        height: game.bucketHeight,
        background: isOver ? deptColorsLight[deptId] : colors.surface,
        border: `3px solid ${deptColors[deptId]}`,
        borderRadius: radii.lg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing['2xs'],
        transition: `all ${animation.duration.fast}s ease`,
        transform: isOver ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isOver ? shadows.glow(deptColors[deptId]) : shadows.sm,
      }}
    >
      {dept.icon ? (
        <img src={dept.icon} alt={dept.label} style={{ width: 36, height: 36 }} />
      ) : (
        <span style={{ fontSize: fontSizes['3xl'] }}>{dept.emoji}</span>
      )}
      <span
        style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.semibold,
          color: colors.text,
        }}
      >
        {dept.label}
      </span>
    </div>
  );
}

// ─── DraggableBeltCard ───────────────────────────────────────────────────────

function DraggableBeltCard({ bc }: { bc: BeltCard }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: bc.card.id,
    data: { card: bc.card },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        left: `${bc.x}%`,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: isDragging ? 0.25 : 1,
        zIndex: isDragging ? zIndex.cardDragging : zIndex.card,
        transition: isDragging ? `opacity ${animation.duration.fast}s ease` : undefined,
      }}
    >
      <CardFace card={bc.card} />
    </div>
  );
}

// ─── RogueSpendMeter ─────────────────────────────────────────────────────────

function RogueSpendMeter({ current, cap }: { current: number; cap: number }) {
  const pct = Math.min(100, (current / cap) * 100);
  const isCritical = pct > 80;
  const isHigh = pct > 60;

  return (
    <div
      style={{
        width: '100%',
        padding: `${spacing.sm} ${spacing.lg}`,
        background: colors.surface,
        borderRadius: radii.lg,
        boxShadow: shadows.sm,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      <span
        style={{
          fontFamily: fonts.heading,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.semibold,
          color: isCritical ? colors.danger : colors.text,
          whiteSpace: 'nowrap',
        }}
      >
        🚨 Rogue Spend
      </span>

      <div
        style={{
          flex: 1,
          height: spacing.md,
          background: colors.borderLight,
          borderRadius: radii.pill,
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={animation.spring}
          style={{
            height: '100%',
            background: isCritical
              ? colors.danger
              : isHigh
                ? colors.warning
                : colors.primary,
            borderRadius: radii.pill,
          }}
        />
      </div>

      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.bold,
          color: isCritical ? colors.danger : colors.text,
          whiteSpace: 'nowrap',
          minWidth: '140px',
          textAlign: 'right',
        }}
      >
        {formatDollars(current)} / {formatDollars(cap)}
      </span>
    </div>
  );
}

// ─── GameScreen ──────────────────────────────────────────────────────────────

export default function GameScreen({ onWin, onLose }: GameScreenProps) {
  const deckRef = useRef(buildStagedDeck());
  const [beltCards, setBeltCards] = useState<BeltCard[]>([]);
  const [rogueSpend, setRogueSpend] = useState(0);
  const [nextCardIndex, setNextCardIndex] = useState(0);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const lastTickRef = useRef(performance.now());
  const gameOverRef = useRef(false);
  const rogueSpendRef = useRef(0);
  const beltSpeedRef = useRef(STAGES[0].beltSpeed);
  const logRef = useRef<RoutingLog>({
    correct: 0,
    fallen: 0,
    spendByDept: { finance: 0, legal: 0, it: 0, security: 0, flag: 0 },
    timeline: [{ cardNumber: 0, rogueSpend: 0 }],
  });

  function buildResult(): GameResult {
    const log = logRef.current;
    const total = log.correct + log.fallen;
    return {
      rogueSpend: rogueSpendRef.current,
      totalCards: deckRef.current.length,
      correctRoutes: log.correct,
      fallenOff: log.fallen,
      accuracy: total > 0 ? Math.round((log.correct / total) * 100) : 100,
      spendByDepartment: { ...log.spendByDept },
      rogueSpendTimeline: [...log.timeline],
    };
  }

  // ── Deal cards onto the belt on a staged timer ─────────────────────────

  useEffect(() => {
    const deck = deckRef.current;
    if (nextCardIndex >= deck.length || gameOverRef.current) return;

    const stageIdx = getStageIndex(nextCardIndex);
    const stage = STAGES[stageIdx];
    beltSpeedRef.current = stage.beltSpeed;

    let delay: number;
    if (nextCardIndex === 0) {
      delay = 0;
    } else if (isFirstCardOfStage(nextCardIndex)) {
      const prevStage = STAGES[stageIdx - 1];
      delay = prevStage.breakAfter + stage.dealInterval;
    } else {
      delay = stage.dealInterval;
    }

    const timerId = setTimeout(() => {
      const card = deck[nextCardIndex];
      setBeltCards(prev => [...prev, { card, x: 95, isPaused: false }]);
      setNextCardIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timerId);
  }, [nextCardIndex]);

  // ── Belt movement loop ───────────────────────────────────────────────────

  useEffect(() => {
    if (gameOverRef.current) return;

    let animId: number;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setBeltCards(prev =>
        prev.map(bc =>
          bc.isPaused ? bc : { ...bc, x: bc.x - beltSpeedRef.current * dt },
        ),
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ── Fall-off detection ───────────────────────────────────────────────────

  useEffect(() => {
    const fallen = beltCards.filter(bc => !bc.isPaused && bc.x < FALL_OFF_X);
    if (fallen.length === 0) return;

    const fallenIds = new Set(fallen.map(bc => bc.card.id));
    const log = logRef.current;
    let runningSpend = rogueSpendRef.current;

    for (const bc of fallen) {
      log.fallen++;
      runningSpend += bc.card.amount;
      log.timeline.push({
        cardNumber: log.correct + log.fallen,
        rogueSpend: runningSpend,
      });
    }

    const cost = fallen.reduce((sum, bc) => sum + bc.card.amount, 0);
    setBeltCards(prev => prev.filter(bc => !fallenIds.has(bc.card.id)));
    setRogueSpend(prev => {
      const next = prev + cost;
      rogueSpendRef.current = next;
      return next;
    });
  }, [beltCards]);

  // ── Win / Lose detection ─────────────────────────────────────────────────

  useEffect(() => {
    if (gameOverRef.current) return;

    if (rogueSpend >= ROGUE_SPEND_CAP) {
      gameOverRef.current = true;
      onLose(buildResult());
    } else if (
      nextCardIndex >= deckRef.current.length &&
      beltCards.length === 0
    ) {
      gameOverRef.current = true;
      onWin(buildResult());
    }
  }, [rogueSpend, beltCards.length, nextCardIndex, onWin, onLose]);

  // ── DnD handlers ─────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveDragId(id);
    setBeltCards(prev =>
      prev.map(bc =>
        bc.card.id === id ? { ...bc, isPaused: true } : bc,
      ),
    );
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    const cardId = active.id as string;
    const card = active.data.current?.card as Card | undefined;

    setActiveDragId(null);
    if (!card) return;

    if (over) {
      const targetDept = over.id as DepartmentId;
      const isCorrect = card.correctDepartment === targetDept;

      if (isCorrect) {
        const log = logRef.current;
        log.correct++;
        log.spendByDept[targetDept] += card.amount;
        log.timeline.push({
          cardNumber: log.correct + log.fallen,
          rogueSpend: rogueSpendRef.current,
        });

        setBeltCards(prev => prev.filter(bc => bc.card.id !== cardId));
        return;
      }

      // Wrong department - bounce back with penalty
      setBeltCards(prev =>
        prev.map(bc => {
          if (bc.card.id !== cardId) return bc;
          return {
            ...bc,
            x: Math.max(5, bc.x - BOUNCE_PENALTY),
            isPaused: false,
          };
        }),
      );
    } else {
      // Dropped outside - return to belt unpause
      setBeltCards(prev =>
        prev.map(bc =>
          bc.card.id === cardId ? { ...bc, isPaused: false } : bc,
        ),
      );
    }
  }, []);

  const activeCard = activeDragId
    ? beltCards.find(bc => bc.card.id === activeDragId)?.card ?? null
    : null;

  return (
    <>
      <style>{`
        @keyframes pp-belt-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-28px); }
        }
      `}</style>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            padding: spacing.lg,
            gap: spacing.lg,
          }}
        >
          {/* Rogue Spend Meter */}
          <RogueSpendMeter current={rogueSpend} cap={ROGUE_SPEND_CAP} />

          {/* Department Buckets */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing.md,
              flex: 1,
              alignItems: 'center',
            }}
          >
            {DEPARTMENT_ORDER.map(id => (
              <DeptBucket key={id} deptId={id} />
            ))}
          </div>

          {/* Conveyor Belt */}
          <div
            style={{
              position: 'relative',
              height: game.beltHeight,
              borderRadius: radii.lg,
              overflow: 'visible',
            }}
          >
            {/* Belt surface with animated stripes */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: radii.lg,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: 'calc(100% + 56px)',
                  height: '100%',
                  background: `repeating-linear-gradient(
                    -45deg,
                    ${colors.belt} 0px,
                    ${colors.belt} 10px,
                    ${colors.beltStripe} 10px,
                    ${colors.beltStripe} 20px
                  )`,
                  animation: 'pp-belt-scroll 0.6s linear infinite',
                }}
              />
            </div>

            {/* Belt rails */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: spacing.xs,
                background: colors.beltShadow,
                borderRadius: `${radii.lg} ${radii.lg} 0 0`,
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: spacing.xs,
                background: colors.beltShadow,
                borderRadius: `0 0 ${radii.lg} ${radii.lg}`,
                zIndex: 1,
              }}
            />

            {/* Direction indicator */}
            <div
              style={{
                position: 'absolute',
                left: spacing.md,
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: fonts.heading,
                fontSize: fontSizes['2xl'],
                color: colors.beltShadow,
                opacity: 0.5,
                zIndex: 1,
                pointerEvents: 'none',
                letterSpacing: spacing.xs,
              }}
            >
              ◄◄◄
            </div>

            {/* Cards on belt */}
            {beltCards.map(bc => (
              <DraggableBeltCard key={bc.card.id} bc={bc} />
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeCard && <CardFace card={activeCard} isDragging />}
        </DragOverlay>
      </DndContext>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing.xs,
          pointerEvents: 'none',
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
            opacity: 0.5,
            pointerEvents: 'auto',
          }}
        >
          Made with care by Helen Highwater
        </a>
        <a
          href="https://www.flaticon.com/free-icons/computer"
          title="computer icons"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: fonts.body,
            fontSize: fontSizes.xs,
            color: colors.textMuted,
            textDecoration: 'none',
            opacity: 0.5,
            pointerEvents: 'auto',
          }}
        >
          Computer icons created by Vectors Tank - Flaticon
        </a>
      </div>
    </>
  );
}
