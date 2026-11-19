"use client";

import { useState } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import {
  BookOpen, ChevronDown, CircleHelp, Factory, FlaskConical, Gamepad2, Globe2, Hourglass,
  Leaf, MapPin, Maximize2, Menu, Play, Recycle, Scale, ShieldAlert, X,
} from "lucide-react";
import { sources, topics, type SourceKey } from "../components/content";
import { Footprint, Future, Quiz, Timeline, WasteChart } from "../components/lab";
import { Presentation } from "../components/presentation";
import { SortGame } from "../components/sort-game";

const navigation = [
  ["Қалдықтар", "#knowledge"],
  ["Сұрыптау ойыны", "#sort"],
  ["Эко-зертхана", "#lab"],
  ["Тест", "#quiz"],
] as const;

const stats = [
  { value: "2,56", unit: "млрд т", label: "Әлемдегі коммуналдық қалдық", year: "2022 жылғы бағалау", icon: Globe2, source: "bank" },
  { value: "1,05", unit: "млрд т", label: "Әлемдегі тағам қалдығы", year: "2022 жылғы бағалау", icon: Leaf, source: "food" },
  { value: "4,1", unit: "млн т", label: "Қазақстанда жиналған қалдық", year: "2025 жылғы дерек", icon: MapPin, source: "kaz" },
  { value: "≈15", unit: "%", label: "Медициналық қалдықтағы қауіпті үлес", year: "ДДҰ бағалауы", icon: ShieldAlert, source: "who" },
] satisfies { value: string; unit: string; label: string; year: string; icon: typeof Leaf; source: SourceKey }[];

const topicIcons = [Globe2, Recycle, Factory, ShieldAlert, MapPin];

export default function Home() {
  const [topic, setTopic] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [menu, setMenu] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const active = topics[topic];

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Мазмұнға өту</a>
      <header className="topbar">
        <div className="site-wrap header-inner">
          <a className="brand" href="#top" aria-label="EcoPlanet басты беті"><span className="brand-icon"><Leaf size={21} strokeWidth={2.1} /></span>Eco<span>Planet</span></a>
          <nav className={`topnav ${menu ? "nav-open" : ""}`} aria-label="Негізгі мәзір">
            {navigation.map(([label, anchor]) => <a key={anchor} href={anchor} onClick={() => setMenu(false)}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <button type="button" className="button button-outline presentation-trigger" onClick={() => { setMenu(false); setPresenting(true); }}><Maximize2 size={17} /><span>Қорғау режимі</span></button>
            <button type="button" className="menu-toggle icon-button" aria-label={menu ? "Мәзірді жабу" : "Мәзірді ашу"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="site-wrap hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow"><span /> ИНТЕРАКТИВТІ ЭКОЛОГИЯ ЖУРНАЛЫ</div>
              <h1 id="hero-title">Жер<br />планетасындағы<br /><em>қауіпті қалдықтар</em></h1>
              <p>Қалдықтар табиғатқа қалай әсер етеді? Жаһандық деректерді зертте, қоқысты сұрыптап көр және Жердің болашағына өз үлесіңді қос.</p>
              <div className="hero-actions">
                <a className="button button-accent" href="#sort"><Play size={17} fill="currentColor" /> Ойынды бастау</a>
                <a className="button button-quiet" href="#knowledge"><BookOpen size={18} /> Тақырыпты зерттеу</a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-orbit orbit-outer" /><div className="hero-orbit orbit-inner" />
              <div className="orbit-cross orbit-cross-top" /><div className="orbit-cross orbit-cross-bottom" />
              <motion.div className="hero-earth" animate={{ y: [0, -9, 0], rotate: [-3, 3, -3] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}>
                <Image src="/images/earth.webp" fill sizes="(max-width: 680px) 90vw, 620px" alt="" preload />
              </motion.div>
              <div className="hero-image-caption"><span /> ЖЕР ПЛАНЕТАСЫ</div>
            </div>
          </div>
          <div className="statistics">
            <div className="site-wrap stats-grid">
              {stats.map(({ value, unit, label, year, icon: Icon, source }) => <a className="stat" key={source} href={sources[source].url} target="_blank" rel="noreferrer">
                <div className="stat-title"><Icon size={16} /> {year}</div>
                <div className="stat-value">{value}<span>{unit}</span></div>
                <div className="stat-label">{label}</div>
              </a>)}
            </div>
          </div>
        </section>

        <section className="site-wrap section game-section" id="sort" aria-labelledby="sort-title">
          <div className="section-heading heading-split">
            <div><span className="eyebrow"><Gamepad2 size={17} /> МИНИ-ОЙЫН</span><h2 id="sort-title">Қалдықтарды сұрыпта</h2></div>
            <p>Затқа сәйкес жәшікті таңда. Әр дұрыс жауапқа 10 ұпай беріледі.</p>
          </div>
          <SortGame />
          <p className="section-note">Жәшіктердің түсі мен қабылдау тәртібі өңірге қарай өзгереді. Қауіпті қалдықты арнайы қабылдау орнына тапсыр.</p>
        </section>

        <section className="knowledge section" id="knowledge" aria-labelledby="knowledge-title">
          <div className="site-wrap">
            <div className="section-heading heading-split">
              <div><span className="eyebrow"><BookOpen size={17} /> ҚАЛДЫҚТАР ТУРАЛЫ</span><h2 id="knowledge-title">Мәселені зертте</h2></div>
              <p>Қалдық қайдан шығады, қайда кетеді және оны қалай азайта аламыз?</p>
            </div>
            <div className="topic-tabs" aria-label="Қалдық тақырыптары">
              {topics.map(({ tab }, index) => {
                const Icon = topicIcons[index];
                return <button key={tab} type="button" className={topic === index ? "active" : ""} aria-pressed={topic === index} onClick={() => { setTopic(index); setExpanded(0); }}><Icon size={18} /> {tab}</button>;
              })}
            </div>
            <div className="knowledge-grid">
              <motion.article className="topic-article" key={active.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} aria-label={active.tab}>
                <h3>{active.title}</h3>
                <p>{active.intro}</p>
                <div className="topic-details">
                  {active.details.map(([title, detail], index) => <div className="topic-detail" key={title}>
                    <button type="button" aria-expanded={expanded === index} aria-controls={`topic-detail-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>{title}<ChevronDown size={19} /></button>
                    <p id={`topic-detail-${index}`} hidden={expanded !== index}>{detail}</p>
                  </div>)}
                </div>
                <div className="article-sources">{active.refs.map((reference) => <a key={reference} href={sources[reference].url} target="_blank" rel="noreferrer">{sources[reference].organization} · {sources[reference].year}</a>)}</div>
              </motion.article>
              <WasteChart />
            </div>
            <figure className="landfill-figure">
              <div className="landfill-image"><Image src="/images/landfill.webp" alt="Ашық алаңға үйілген тұрмыстық қалдықтардың әуеден көрінісі" fill sizes="(max-width: 760px) 95vw, 620px" /></div>
              <figcaption><span className="eyebrow"><ShieldAlert size={17} /> ЭКОЖҮЙЕГЕ ӘСЕРІ</span><h3>Үйіндіден тараған ластану</h3><p>Жел жеңіл қаптаманы жан-жаққа ұшырады. Жаңбыр суы үйіндіден өтіп, ластағыштарды топырақ пен суға таратуы мүмкін.</p><small>Ашық қоқыс үйіндісінің иллюстрациясы</small></figcaption>
            </figure>
          </div>
        </section>

        <section className="site-wrap section lab-section" id="lab" aria-labelledby="lab-title">
          <div className="section-heading heading-split"><div><span className="eyebrow"><FlaskConical size={17} /> ЭКО-ЗЕРТХАНА</span><h2 id="lab-title">Қалдықтың ізі</h2></div><p>Материалдардың ыдырау уақытын салыстыр және өз қалдығыңның салмағын есепте.</p></div>
          <div className="tools-stack">
            <article className="lab-article"><h3><Hourglass size={23} /> Қалдықтардың ыдырау уақыты</h3><Timeline /></article>
            <article className="lab-article footprint-article"><div className="tool-intro"><span className="soft-icon"><Scale size={24} /></span><h3>Менің экологиялық ізім</h3><p>Бір күндегі тұрмыстық қалдық салмағын енгізіп, айлық және жылдық мөлшерін біл.</p></div><Footprint /></article>
          </div>
        </section>

        <section className="future-section section" id="future" aria-labelledby="future-title">
          <div className="site-wrap future-grid">
            <div className="future-copy">
              <span className="eyebrow"><Globe2 size={17} /> 2050 ЖЫЛҒЫ СЦЕНАРИЙЛЕР</span>
              <h2 id="future-title">Болашақтағы Жер</h2>
              <p>Екі көріністі салыстыр. Дүниежүзілік банк қалдық көлемін қабылданатын шараларға қарай болжайды.</p>
              <div className="future-data"><div><span>Қазіргі бағыт сақталса</span><strong>3,86 <small>млрд т</small></strong></div><div><span>Ауқымды шаралар қабылданса</span><strong>2,60 <small>млрд т</small></strong></div></div>
              <a className="text-link" href={sources.bank.url} target="_blank" rel="noreferrer">Болжамның дереккөзі · Дүниежүзілік банк, 2026</a>
            </div>
            <Future />
          </div>
        </section>

        <section className="site-wrap section quiz-section" id="quiz" aria-labelledby="quiz-title">
          <div className="section-heading"><span className="eyebrow"><CircleHelp size={17} /> ТЕСТ</span><h2 id="quiz-title">Біліміңді тексер</h2><p>Жеті сұраққа жауап бер. Әр сұрақтан кейін дұрыс жауаптың түсіндірмесі ашылады.</p></div>
          <Quiz />
        </section>

        <section className="sources-section section" id="sources" aria-labelledby="sources-title">
          <div className="site-wrap">
            <div className="section-heading"><span className="eyebrow"><BookOpen size={17} /> ӘДЕБИЕТТЕР</span><h2 id="sources-title">Дереккөздер</h2></div>
            <ul className="sources-list">
              {Object.values(sources).map(({ title, organization, scope, url, year }) => <li key={url}><span>{organization} · {year}</span><a href={url} target="_blank" rel="noreferrer">{title}</a><p>{scope}</p></li>)}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-wrap footer-inner"><a className="brand" href="#top"><span className="brand-icon"><Leaf size={21} /></span>Eco<span>Planet</span></a><a href="#sources">Дереккөздер</a></div>
      </footer>
      {presenting && <Presentation open={presenting} onClose={() => setPresenting(false)} />}
    </MotionConfig>
  );
}
