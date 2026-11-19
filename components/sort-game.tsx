"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple, BatteryCharging, Check, CircleAlert, CupSoda, FileText, FlaskConical, GlassWater,
  Leaf, Milk, Newspaper, Package, Recycle, RotateCcw, TriangleAlert, Trophy, X,
} from "lucide-react";

const bins = [
  { id: "plastic", label: "Пластик", icon: Milk, color: "#4b7130", pale: "#e8f3d5" },
  { id: "paper", label: "Қағаз", icon: FileText, color: "#315e95", pale: "#e4effb" },
  { id: "glass", label: "Шыны", icon: GlassWater, color: "#126b5a", pale: "#dcf4eb" },
  { id: "metal", label: "Металл", icon: CupSoda, color: "#846026", pale: "#fbefd1" },
  { id: "organic", label: "Органика", icon: Leaf, color: "#8a5038", pale: "#f8e7da" },
  { id: "hazard", label: "Қауіпті", icon: TriangleAlert, color: "#9d433d", pale: "#fae5e3" },
] as const;

type BinId = (typeof bins)[number]["id"];

const deck = [
  { name: "Пластик бөтелке", icon: Milk, bin: "plastic", why: "Бос бөтелкенің пластик түрін тексеріп, оны қабылдайтын орынға өткіз." },
  { name: "Пайдаланылған батарейка", icon: BatteryCharging, bin: "hazard", why: "Батарейканы жалпы контейнерге салмай, арнайы қабылдау орнына өткіз." },
  { name: "Құрғақ газет", icon: Newspaper, bin: "paper", why: "Құрғақ әрі таза газетті макулатураға өткізуге болады." },
  { name: "Алма өзегі", icon: Apple, bin: "organic", why: "Алма өзегін органика бөлек жиналатын жерге немесе компостқа салуға болады." },
  { name: "Бос шыны банка", icon: GlassWater, bin: "glass", why: "Таза, бос банканы қаптама шынысын қабылдайтын жерге өткіз." },
  { name: "Алюминий сусын құтысы", icon: CupSoda, bin: "metal", why: "Бос алюминий құты металл ретінде қайта өңдеуге жарайды." },
  { name: "Таза картон қорап", icon: Package, bin: "paper", why: "Картон құрғақ әрі таза болса, оны жазып, макулатураға салуға болады." },
  { name: "Еріткіш қалдығы", icon: FlaskConical, bin: "hazard", why: "Еріткішті таңбаланған өз ыдысында сақтап, қауіпті қалдық қабылдайтын орынға өткіз." },
  { name: "Көкөніс қабығы", icon: Leaf, bin: "organic", why: "Көкөніс қабығын органика қабылдайтын жерге өткізуге немесе компостқа салуға болады." },
  { name: "Бос шыны бөтелке", icon: GlassWater, bin: "glass", why: "Қаптама шынысын бөлек жинап, жергілікті қабылдау ережесін тексер." },
] satisfies { name: string; icon: typeof Milk; bin: BinId; why: string }[];

export function SortGame({ compact = false }: { compact?: boolean }) {
  const [cards, setCards] = useState(deck);
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<BinId | null>(null);
  const [score, setScore] = useState(0);
  const [dragOver, setDragOver] = useState<BinId | null>(null);
  const roundHeading = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const finished = round === cards.length;
  const item = cards[round];
  const ItemIcon = item?.icon;
  const correct = choice === item?.bin;
  const rightBin = bins.find((bin) => bin.id === item?.bin);

  useEffect(() => {
    if (moveFocus.current) {
      roundHeading.current?.focus({ preventScroll: true });
      moveFocus.current = false;
    }
  }, [round, cards]);

  function choose(bin: BinId) {
    if (finished || choice) return;
    setChoice(bin);
    setDragOver(null);
    if (bin === item.bin) setScore((points) => points + 10);
  }

  function restart() {
    moveFocus.current = true;
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setRound(0);
    setChoice(null);
    setScore(0);
    setDragOver(null);
  }

  return (
    <div className={`game-board ${compact ? "game-compact" : ""}`}>
      <div className="game-status">
        <div className="game-status-left"><span className="status-icon"><Recycle size={18} /></span><div><strong>Сұрыптау алаңы</strong><small>{finished ? "Ойын аяқталды" : `${round + 1} / ${cards.length} зат`}</small></div></div>
        <div className="game-points" aria-live="polite"><Trophy size={17} /><strong>{score}</strong> ұпай</div>
      </div>
      <div className="game-progress" role="progressbar" aria-label="Сұрыптау барысы" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={round + (choice ? 1 : 0)}>
        <span style={{ width: `${((round + (choice ? 1 : 0)) / cards.length) * 100}%` }} />
      </div>
      {finished ? (
        <div className="game-result" ref={roundHeading} tabIndex={-1} role="group" aria-label={`Ойын аяқталды, ${score} ұпай`}>
          <span className="result-icon"><Trophy size={38} /></span>
          <h3>Ойын аяқталды!</h3>
          <p>Дұрыс сұрыпталған заттар — {score / 10} / {cards.length}. Нәтижең — <strong>{score} / 100 ұпай.</strong></p>
          <button className="button button-accent" onClick={restart}><RotateCcw size={17} /> Қайта ойнау</button>
        </div>
      ) : (
        <>
          <div className="sort-stage" ref={roundHeading} tabIndex={-1} role="group" aria-label={`Сұрыпталатын зат — ${item.name}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={item.name} className="waste-card" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                <div className={`waste-object ${choice ? "" : "can-drag"}`} draggable={!choice} onDragStart={(event) => { event.dataTransfer.setData("text/plain", item.name); event.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDragOver(null)}>
                  {ItemIcon && <ItemIcon size={48} strokeWidth={1.45} aria-hidden="true" />}
                </div>
                <strong>{item.name}</strong>
                <small>Қай жәшікке саласың?</small>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="bin-grid" aria-label="Сұрыптау жәшіктері">
            {bins.map(({ id, label, icon: Icon, color, pale }) => (
              <button
                key={id}
                type="button"
                className={`bin-button ${choice && id === item.bin ? "bin-correct" : ""} ${choice === id && !correct ? "bin-error" : ""} ${dragOver === id ? "bin-over" : ""}`}
                style={{ "--bin-color": color, "--bin-pale": pale } as React.CSSProperties}
                aria-disabled={!!choice}
                onClick={() => choose(id)}
                onDragOver={(event) => { if (choice) return; event.preventDefault(); event.dataTransfer.dropEffect = "move"; setDragOver(id); }}
                onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOver(null); }}
                onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === item.name) choose(id); }}
              >
                <span className="bin-symbol"><Icon size={24} strokeWidth={1.65} /></span>
                <span>{label}</span>
                {choice && id === item.bin && <Check className="bin-mark" size={15} aria-label="Дұрыс жәшік" />}
                {choice === id && !correct && <X className="bin-mark" size={15} aria-label="Қате таңдау" />}
              </button>
            ))}
          </div>
          <div className="game-footer">
            <div className="game-feedback" role="status">
              {choice ? (
                <><span className={correct ? "feedback-good" : "feedback-bad"}>{correct ? <Check size={19} /> : <CircleAlert size={19} />}</span><p><strong>{correct ? "Дұрыс! +10 ұпай" : `Дұрыс жәшік — «${rightBin?.label}».`}</strong> {item.why}</p></>
              ) : (
                <><CircleAlert size={17} /><p>Жәшікті бас немесе затты жәшікке сүйреп апар.</p></>
              )}
            </div>
            {choice && <button type="button" className="button button-dark game-next" onClick={() => { moveFocus.current = true; setRound((value) => value + 1); setChoice(null); }}>{round + 1 === cards.length ? "Нәтижені көру" : "Келесі зат"}</button>}
          </div>
        </>
      )}
    </div>
  );
}
