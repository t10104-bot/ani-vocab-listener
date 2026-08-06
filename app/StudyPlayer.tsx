"use client";

import { useEffect, useRef, useState } from "react";
import type { VocabItem } from "./vocabulary";

export function StudyPlayer({ vocabulary }: { vocabulary: VocabItem[] }) {
  const [size, setSize] = useState(5);
  const [startId, setStartId] = useState(vocabulary[0].id);
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1);
  const [pause, setPause] = useState(500);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [englishVoice, setEnglishVoice] = useState("");
  const [chineseVoice, setChineseVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const cancelled = useRef(false);
  const group = vocabulary.filter((item) => item.id >= startId).slice(0, size);
  const item = group[position];

  useEffect(() => {
    const refresh = () => setVoices(window.speechSynthesis.getVoices());
    refresh(); window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => { window.speechSynthesis.cancel(); window.speechSynthesis.removeEventListener("voiceschanged", refresh); };
  }, []);
  const say = (text: string, lang: string) => new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; utterance.rate = rate; utterance.pitch = pitch;
    const chosen = voices.find((voice) => voice.name === (lang === "en-US" ? englishVoice : chineseVoice));
    if (chosen) utterance.voice = chosen;
    utterance.onend = () => resolve(); utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
  const stop = () => { cancelled.current = true; window.speechSynthesis.cancel(); setSpeaking(false); };
  const playCurrent = async () => {
    if (!item) return; stop(); cancelled.current = false; setSpeaking(true);
    await say(item.word, "en-US"); if (!cancelled.current) await wait(); if (!cancelled.current) await say(item.meaning, "zh-TW");
    if (!cancelled.current) await say(item.note, "zh-TW"); if (!cancelled.current) setSpeaking(false);
  };
  const playGroup = async () => {
    stop(); cancelled.current = false; setSpeaking(true);
    for (let i = position; i < group.length; i += 1) {
      setPosition(i); const current = group[i];
      await say(current.word, "en-US"); if (cancelled.current) break;
      await wait(); if (cancelled.current) break;
      await say(current.meaning, "zh-TW"); if (cancelled.current) break;
      await say(current.note, "zh-TW"); if (cancelled.current) break;
    }
    if (!cancelled.current) setSpeaking(false);
  };
  const begin = () => { setPosition(0); setStarted(true); };
  const wait = () => new Promise<void>((resolve) => window.setTimeout(resolve, pause));
  const englishVoices = voices.filter((voice) => /^en/i.test(voice.lang));
  const chineseVoices = voices.filter((voice) => /^zh/i.test(voice.lang));

  if (!started) return <main className="shell"><div className="brand"><span className="brand-mark">⌁</span> Dani&apos;s English</div><p className="eyebrow">VOCABULARY LISTENING</p><h1>讓單字，跟著你的節奏說話。</h1><p className="intro">選一個起始編號與播放數量。每個單字會依序朗讀英文、中文解釋與補充資訊。</p><section className="card"><div className="setup-grid"><label>一次播放幾個單字？<select value={size} onChange={(e) => setSize(Number(e.target.value))}>{[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} 個</option>)}</select></label><label>從編號幾開始？<input type="number" min={vocabulary[0].id} max={vocabulary.at(-1)?.id} value={startId} onChange={(e) => setStartId(Math.max(vocabulary[0].id, Math.min(vocabulary.at(-1)?.id ?? 0, Number(e.target.value))))} /></label></div><button className="primary" onClick={begin}>開始這一組</button><p className="hint">本組將播放 {group.length} 個單字 · {group[0]?.id}–{group.at(-1)?.id}</p></section></main>;
  if (!item) return null;
  const done = position === group.length - 1;
  return <main className="shell"><div className="brand"><span className="brand-mark">⌁</span> Dani&apos;s English</div><div className="study-top"><button className="back" onClick={() => { stop(); setStarted(false); }}>← 重新選擇</button><span className="count">第 {position + 1} / {group.length} 個</span></div><div className="progress"><span style={{ width: `${((position + 1) / group.length) * 100}%` }} /></div><section className="card word-card"><span className="number">NO. {item.id}</span><h1 className="word">{item.word}</h1><p className="phonetic">{item.phonetic}</p><p className="pos">{item.partOfSpeech}</p><p className="meaning">{item.meaning}</p><p className="note">{item.note}</p><div className="controls"><button className="secondary play" onClick={speaking ? stop : playCurrent}>{speaking ? "停止播放" : "▶ 聽這個單字"}</button><button className="secondary" onClick={playGroup}>▶ 從這裡播到本組結束</button>{position > 0 && <button className="secondary" onClick={() => { stop(); setPosition(position - 1); }}>← 上一個</button>}<button className="secondary" onClick={() => { stop(); if (done) { setStartId((group.at(-1)?.id ?? startId) + 1); setPosition(0); } else setPosition(position + 1); }}>{done ? "下一組 →" : "下一個 →"}</button></div><details className="voice-settings"><summary>語音設定</summary><div className="voice-grid"><label>英文聲音<select value={englishVoice} onChange={(e) => setEnglishVoice(e.target.value)}><option value="">裝置預設</option>{englishVoices.map((voice) => <option key={voice.voiceURI} value={voice.name}>{voice.name}</option>)}</select></label><label>中文聲音<select value={chineseVoice} onChange={(e) => setChineseVoice(e.target.value)}><option value="">裝置預設</option>{chineseVoices.map((voice) => <option key={voice.voiceURI} value={voice.name}>{voice.name}</option>)}</select></label><label>播放速度<select value={rate} onChange={(e) => setRate(Number(e.target.value))}><option value="0.75">慢</option><option value="0.9">正常</option><option value="1.05">快</option></select></label><label>單字間隔<select value={pause} onChange={(e) => setPause(Number(e.target.value))}><option value="250">短</option><option value="500">正常</option><option value="900">長</option></select></label><label>音高<select value={pitch} onChange={(e) => setPitch(Number(e.target.value))}><option value="0.8">低</option><option value="1">正常</option><option value="1.2">高</option></select></label></div></details></section></main>;
}
