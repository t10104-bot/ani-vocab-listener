import { StudyPlayer } from "./StudyPlayer";
import { vocabulary, type VocabItem } from "./vocabulary";

async function getVocabulary(): Promise<VocabItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return vocabulary;

  try {
    const response = await fetch(
      `${url}/rest/v1/vocabulary_items?select=id,word,phonetic,part_of_speech,meaning_zh,notes&order=id.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } },
    );
    if (!response.ok) return vocabulary;
    const records = await response.json() as Array<{ id: number; word: string; phonetic: string | null; part_of_speech: string | null; meaning_zh: string; notes: string | null }>;
    if (!records.length) return vocabulary;
    return records.map((record) => ({ id: record.id, word: record.word, phonetic: record.phonetic ?? "", partOfSpeech: record.part_of_speech ?? "", meaning: record.meaning_zh, note: record.notes ?? "" }));
  } catch {
    return vocabulary;
  }
}

export default async function Home() {
  return <StudyPlayer vocabulary={await getVocabulary()} />;
}
