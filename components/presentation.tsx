"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Globe2, Leaf, Maximize2, X } from "lucide-react";
import { Future, WasteChart } from "./lab";
import { SortGame } from "./sort-game";

const slides = [
  {
    title: "Жер планетасындағы қауіпті қалдықтар",
    points: ["Қалдықтардың неге көбейетінін және олардың табиғатқа әсерін түсіндіремін.", "Қауіпті қалдықты қалай тануға болатынын айтып, сұрыптау ойынын бірге ойнаймыз."],
  },
  {
    title: "Мәселенің ауқымы",
    points: ["2022 жылы әлемде 2,56 млрд тонна коммуналдық қатты қалдық түзілген.", "Қалдық дұрыс жиналмаса, пластик суға, ал үйіндіден шыққан ластағыштар топыраққа таралады.", "Графиктен 2050 жылға арналған екі сценарийді салыстырыңдар."],
  },
  {
    title: "Тұрмыстық және өндірістік қалдықтар",
    points: ["Үйде қағазды, пластикті, шыныны, металды және органиканы жергілікті ережеге сай бөлек жинауға болады.", "Зауыттар мен кен орындарында қож, күл және кен байыту қалдығы түзіледі.", "Кәсіпорын қалдықты шикізатты үнемдеу, суды қайта пайдалану және қалдық қоймасын бақылау арқылы азайта алады."],
  },
  {
    title: "Қауіпті қалдықты бөлек тапсыр",
    points: ["Батарейка мен химикат қалдығын арнайы қабылдау орнына өткізу керек.", "ДДҰ бағалауынша, медициналық қалдықтың шамамен 15%-ы қауіпті.", "Радиоактивті заттарды тек маманданған ұйымдар басқарады."],
  },
  {
    title: "Қазақстандағы жағдай",
    points: ["2025 жылы Қазақстанда 4,1 млн тонна коммуналдық қалдық жиналды.", "Заңсыз үйінділерді ғарыштық мониторинг арқылы анықтайды.", "Семей ядролық қауіпсіздік аймағында ауа, су, топырақ пен өсімдіктер тексеріледі."],
  },
  {
    title: "Қалдықтарды сұрыпта",
    points: ["Әр адам бір затқа жәшік таңдасын. Дұрыс жауапқа 10 ұпай беріледі.", "Жауаптан кейін түсіндірмені бірге оқыңдар."],
  },
  {
    title: "Болашақтағы Жер",
    points: ["Салыстырғышты жылжытып, екі көріністі қараңдар.", "Талқылау: колледжде қалдық көлемін азайту үшін нені өзгерте аламыз?"],
  },
  {
    title: "Қорытынды",
    points: ["Қалдықты азайтудың алғашқы қадамы — артық зат сатып алмау және жарамды бұйымды қайта пайдалану.", "Қалғанын жергілікті ережеге сай сұрыптап, қауіпті қалдықты арнайы қабылдау орнына тапсырамыз.", "Орындаған: ПО2602 тобының студенті Недилько Артем."],
  },
];

export function Presentation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const closeAfterFullscreen = useEffectEvent(onClose);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const opener = document.activeElement;
    let wasFullscreen = false;
    function trackFullscreen() {
      if (document.fullscreenElement === element) wasFullscreen = true;
      else if (wasFullscreen) closeAfterFullscreen();
    }
    element.showModal();
    document.addEventListener("fullscreenchange", trackFullscreen);
    void element.requestFullscreen?.().catch(() => {});
    return () => {
      document.removeEventListener("fullscreenchange", trackFullscreen);
      if (document.fullscreenElement === element) void document.exitFullscreen().catch(() => {});
      if (element.open) element.close();
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open) content.current?.scrollTo(0, 0);
  }, [index, open]);

  function go(offset: number) {
    setIndex((current) => Math.min(slides.length - 1, Math.max(0, current + offset)));
  }

  return (
    <dialog
      ref={dialog}
      className="presentation"
      aria-labelledby="slide-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
        if (event.target instanceof HTMLInputElement || event.altKey || event.ctrlKey || event.metaKey) return;
        switch (event.key) {
          case "ArrowRight":
          case "PageDown":
            event.preventDefault();
            go(1);
            break;
          case "ArrowLeft":
          case "PageUp":
            event.preventDefault();
            go(-1);
            break;
          case "Home":
            event.preventDefault();
            setIndex(0);
            break;
          case "End":
            event.preventDefault();
            setIndex(slides.length - 1);
            break;
        }
      }}
    >
      <div className="presentation-shell">
        <header className="presentation-header">
          <span className="brand"><span className="brand-icon"><Leaf size={20} /></span>Eco<span>Planet</span></span>
          <span className="presentation-mode"><Maximize2 size={16} /> Қорғау режимі</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Қорғау режимін жабу"><X size={23} /></button>
        </header>
        <div className="presentation-content" ref={content}>
          <div className={`slide slide-${index}`}>
            <div className="slide-copy">
              <span className="slide-kicker">БАЯНДАУҒА АРНАЛҒАН ТЕЗИСТЕР</span>
              <h2 id="slide-title" aria-live="polite">{slide.title}</h2>
              <ul>{slide.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <div className="slide-activity" hidden={index !== 1}><WasteChart /></div>
            <div className="slide-activity" hidden={index !== 5}><SortGame compact /></div>
            <div className="slide-activity" hidden={index !== 6}><Future /></div>
            {[0, 2, 3, 4, 7].includes(index) && <div className="slide-illustration" aria-hidden="true"><Globe2 size={190} strokeWidth={0.55} /></div>}
          </div>
        </div>
        <footer className="presentation-controls">
          <span className="presentation-keys"><kbd>←</kbd> <kbd>→</kbd> Слайдтарды ауыстыру</span>
          <div className="slide-pagination" aria-label="Слайдты таңдау">
            {slides.map(({ title }, step) => <button type="button" key={title} aria-label={`${step + 1}. ${title}`} aria-current={step === index ? "step" : undefined} onClick={() => setIndex(step)} />)}
          </div>
          <div className="presentation-navigation">
            <button className="icon-button" type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="Алдыңғы слайд"><ChevronLeft size={21} /></button>
            <span>{index + 1} / {slides.length}</span>
            <button className="icon-button" type="button" onClick={() => go(1)} disabled={index === slides.length - 1} aria-label="Келесі слайд"><ChevronRight size={21} /></button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
