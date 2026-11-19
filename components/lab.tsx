"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Apple, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp, CupSoda, FileText,
  GlassWater, Leaf, Milk, RotateCcw, Scale, ShoppingBag, Trophy, X,
} from "lucide-react";
import { formatNumber, quiz, sources } from "./content";

const materials = [
  { name: "Газет", icon: FileText, time: "≈ 6 апта", days: 42, description: "Қағаз талшықтары ылғал ортада ыдырайды. Құрғақ әрі таза газетті макулатураға өткіз." },
  { name: "Алма өзегі", icon: Apple, time: "≈ 2 ай", days: 61, description: "Алма өзегі — органикалық қалдық. Компостта оның ыдырауы ылғалға, температураға және ауа алмасуына байланысты." },
  { name: "Пакет", icon: ShoppingBag, time: "≈ 10–20 жыл", days: 15 * 365, description: "Пластик пакет ұсақ бөлшектерге бөлінеді. Көп рет қолданылатын сөмке бір реттік пакеттердің санын азайтады." },
  { name: "Алюминий", icon: CupSoda, time: "≈ 200 жыл", days: 200 * 365, description: "Алюминий құты теңізде ұзақ сақталады. Бос құтыны металл қабылдайтын жерге өткізсең, оны қайта өңдеуге болады." },
  { name: "Пластик бөтелке", icon: Milk, time: "≈ 450 жыл", days: 450 * 365, description: "Бұл — пластиктің теңізде ұсақ бөлшектерге бөлінуіне берілген жуық баға. Микропластик ортада қала береді." },
  { name: "Шыны", icon: GlassWater, time: "Мерзімі белгісіз", days: null, description: "NOAA теңіздегі шыны бөтелкенің ыдырау мерзімін нақты көрсетпейді. Қаптама шынысын қабылдау орнына өткізуге болады." },
] as const;

const ticks = [
  { label: "1 ай", days: 30 },
  { label: "1 жыл", days: 365 },
  { label: "10 жыл", days: 3650 },
  { label: "100 жыл", days: 36500 },
  { label: "600 жыл", days: 219000 },
];

function scalePosition(days: number) {
  return ((Math.log10(days) - Math.log10(30)) / (Math.log10(219000) - Math.log10(30))) * 100;
}

export function Timeline() {
  const [selected, setSelected] = useState(0);
  const material = materials[selected];
  const MaterialIcon = material.icon;

  return (
    <div className="timeline-widget">
      <div className="material-list" aria-label="Қалдық материалдары">
        {materials.map(({ name, icon: Icon }, index) => (
          <button type="button" key={name} className={selected === index ? "active" : ""} aria-pressed={selected === index} onClick={() => setSelected(index)}><Icon size={17} /> {name}</button>
        ))}
      </div>
      <div className="timeline-detail" aria-live="polite">
        <div className="timeline-pictogram"><MaterialIcon size={37} strokeWidth={1.4} /></div>
        <div><h3>{material.name}</h3><strong>{material.time}</strong></div>
        <p>{material.description}</p>
      </div>
      <div className="timeline-scale" aria-label="Логарифмдік уақыт шкаласы">
        <div className="timeline-track">
          {material.days !== null && <motion.span className="timeline-marker" initial={false} animate={{ left: `${scalePosition(material.days)}%` }} transition={{ type: "spring", stiffness: 210, damping: 25 }} />}
          {ticks.map(({ label, days }) => <span className="timeline-tick" style={{ left: `${scalePosition(days)}%` }} key={label}><span>{label}</span></span>)}
        </div>
      </div>
      <p className="small-note">Теңіз ортасына арналған жуық бағалар. Температура, жарық пен материал өлшемі нәтижеге әсер етеді. Шкала логарифмдік. <a href={sources.noaa.url} target="_blank" rel="noreferrer">NOAA, 2017</a> · <a href={sources.glass.url} target="_blank" rel="noreferrer">NOAA, 2024</a></p>
    </div>
  );
}

export function Footprint() {
  const [daily, setDaily] = useState("0.7");
  const value = daily.trim() === "" ? NaN : Number(daily.trim().replace(",", "."));
  const valid = Number.isFinite(value) && value >= 0 && value <= 20;

  return (
    <div className="tool-box footprint-widget">
      <div className="footprint-controls">
        <label htmlFor="daily-waste">Бір күнде қанша қалдық шығарасың?</label>
        <div className="number-field"><input id="daily-waste" type="text" inputMode="decimal" value={daily} onChange={(event) => setDaily(event.target.value)} aria-invalid={!valid} aria-describedby="footprint-hint" autoComplete="off" /><span>кг / күн</span></div>
        <input type="range" aria-label="Тәуліктік қалдық салмағы" min={0} max={20} step={0.05} value={valid ? value : 0} onChange={(event) => setDaily(event.target.value)} />
        <div className="range-caption"><span>0 кг</span><span>20 кг</span></div>
        <p id="footprint-hint" className="small-note">{valid ? "Бастапқы 0,7 кг — мысал. Дәлірек есептеу үшін бір аптадағы қалдығыңды өлшеп, салмағын жетіге бөл." : "0 мен 20 аралығындағы санды енгіз. Бөлшек санға үтір немесе нүкте қолдануға болады."}</p>
      </div>
      <div className="footprint-results" aria-live="polite">
        <div><CalendarDays size={21} /><span>Бір айда · 30 күн</span><strong>{valid ? formatNumber(value * 30) : "—"} <small>кг</small></strong></div>
        <div><Scale size={21} /><span>Бір жылда · 365 күн</span><strong>{valid ? formatNumber(value * 365) : "—"} <small>кг</small></strong></div>
      </div>
    </div>
  );
}

const scenarios = [
  { title: "Қазіргі бағыт", year: "2050 · өзгеріссіз сценарий", value: "3,86", width: 289, color: "#dfab76", summary: "Елеулі өзгеріс болмаса, 2050 жылы әлемдегі жылдық коммуналдық қалдық көлемі 3,86 млрд тоннаға дейін өсуі мүмкін." },
  { title: "Ауқымды шаралар", year: "2050 · ауқымды шаралар сценарийі", value: "2,60", width: 195, color: "#699951", summary: "Қалдықтың алдын алу және жинау мен өңдеу жүйесін жетілдіру 2050 жылғы көлемді 2,60 млрд тонна шамасында ұстай алады." },
  { title: "2022 жылғы баға", year: "2022 · бағаланған көлем", value: "2,56", width: 192, color: "#99ad9c", summary: "Дүниежүзілік банк 2022 жылы әлемде 2,56 млрд тонна коммуналдық қатты қалдық түзілгенін бағалады." },
] as const;

export function WasteChart() {
  const [selected, setSelected] = useState(0);
  const rows = [2, 0, 1];
  return (
    <div className="chart-panel">
      <div className="chart-title"><span>ДҮНИЕЖҮЗІЛІК БАНК · 2026</span><h3>Әлемдегі қалдық көлемі</h3><p>Коммуналдық қатты қалдық · млрд тонна / жыл</p></div>
      <div className="chart-controls" aria-label="Диаграмма дерегін таңдау">
        {rows.map((index) => (
          <button key={index} type="button" aria-pressed={selected === index} className={selected === index ? "active" : ""} aria-label={`${scenarios[index].year}, ${scenarios[index].value} млрд тонна`} onClick={() => setSelected(index)}>
            <span className="chart-row-label"><span>{scenarios[index].title}</span><strong>{scenarios[index].value}</strong></span>
            <svg aria-hidden="true" viewBox="0 0 300 11" preserveAspectRatio="none" width="100%" height="11">
              <rect width="300" height="11" rx="5.5" fill="#e2e9df" />
              <rect width={scenarios[index].width} height="11" rx="5.5" fill={scenarios[index].color} />
            </svg>
          </button>
        ))}
      </div>
      <p className="chart-caption" aria-live="polite">{scenarios[selected].summary}</p>
      <a className="text-link" href={sources.bank.url} target="_blank" rel="noreferrer">Есепті ашу</a>
    </div>
  );
}

export function Future() {
  const [position, setPosition] = useState(50);
  const cleanText = position === 100 ? "Таза сценарий" : position === 0 ? "Ластанған сценарий" : `Таза көрініс: ${position}%`;
  return (
    <div className="future-widget">
      <div className="future-display">
        <div className="future-art polluted">
          <Image src="/images/future-earth.webp" alt="" fill sizes="(max-width: 640px) 84vw, 500px" />
        </div>
        <div className="future-art clean" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src="/images/future-earth.webp" alt="" fill sizes="(max-width: 640px) 84vw, 500px" />
        </div>
        <div className="future-line" style={{ left: `${position}%` }}><span><ChevronLeft size={15} /><ChevronRight size={15} /></span></div>
        {position >= 27 && <span className="future-label future-label-clean"><Leaf size={15} /> Таза Жер</span>}
        {position <= 65 && <span className="future-label future-label-polluted">Ластанған Жер</span>}
        <input type="range" className="future-slider" aria-label="Таза және ластанған Жер көріністерін салыстыру" aria-valuetext={cleanText} min={0} max={100} value={position} onChange={(event) => setPosition(Number(event.target.value))} />
      </div>
      <div className="scenario-choices" aria-label="Көрініс режимі">
        {[{ value: 0, label: "Ластанған Жер" }, { value: 50, label: "Салыстыру" }, { value: 100, label: "Таза Жер" }].map(({ value, label }) => <button type="button" key={value} aria-pressed={position === value} onClick={() => setPosition(value)}>{label}</button>)}
      </div>
      <p className="future-note">Көрініс — шартты иллюстрация. Сандық болжам Дүниежүзілік банк есебіне негізделген.</p>
    </div>
  );
}

export function Quiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const finished = index === quiz.length;
  const active = quiz[index];
  const answer = answers[index];
  const answered = answer !== undefined;
  const score = answers.reduce((total, option, question) => total + Number(option === quiz[question].answer), 0);

  useEffect(() => {
    if (moveFocus.current) {
      heading.current?.focus({ preventScroll: true });
      moveFocus.current = false;
    }
  }, [index]);

  return (
    <div className="tool-box quiz-widget">
      <div className="quiz-meta">
        <span><CircleHelp size={19} /> {finished ? "Тест аяқталды" : `${index + 1} / ${quiz.length} сұрақ`}</span>
        <div className="quiz-steps" aria-hidden="true">{quiz.map(({ question }, step) => <span key={question} className={step < answers.length ? "complete" : step === index ? "current" : ""} />)}</div>
      </div>
      {finished ? <div className="quiz-result" role="status">
        <span className="result-icon"><Trophy size={32} /></span>
        <h3 ref={heading} tabIndex={-1}>{score} / {quiz.length} дұрыс жауап</h3>
        <p>{score === quiz.length ? "Барлық сұраққа дұрыс жауап бердің!" : "Тақырыптарды қайта оқып, біліміңді тағы тексере аласың."}</p>
        <button type="button" className="button button-accent" onClick={() => { moveFocus.current = true; setIndex(0); setAnswers([]); }}><RotateCcw size={17} /> Қайта бастау</button>
      </div> : <>
        <h3 className="quiz-question" ref={heading} tabIndex={-1}>{active.question}</h3>
        <div className="quiz-options">
          {active.options.map((option, optionIndex) => {
            const marking = answered && active.answer === optionIndex ? "right" : answer === optionIndex ? "wrong" : "";
            return <button type="button" key={option} aria-disabled={answered} onClick={() => { if (!answered) setAnswers((current) => current.length === index ? [...current, optionIndex] : current); }} className={marking}>
              <span className="quiz-letter">{["А", "Ә", "Б"][optionIndex]}</span><span>{option}</span>{marking === "right" ? <Check size={20} /> : marking === "wrong" ? <X size={20} /> : null}
            </button>;
          })}
        </div>
        {answered && <div className="quiz-feedback">
          <p role="status"><strong>{answer === active.answer ? "Дұрыс!" : "Дұрыс жауап — «" + active.options[active.answer] + "»."}</strong> {active.why}</p>
          <button type="button" className="button button-dark" onClick={() => { moveFocus.current = true; setIndex((current) => current + 1); }}>{index + 1 === quiz.length ? "Нәтижені көру" : "Келесі сұрақ"}</button>
        </div>}
      </>}
    </div>
  );
}
