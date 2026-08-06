-- Run this in the Supabase SQL Editor when you are ready to connect the cloud database.
create table if not exists vocabulary_items (
  id integer primary key,
  word text not null,
  phonetic text,
  part_of_speech text,
  meaning_zh text not null,
  notes text,
  audio_english_url text,
  audio_chinese_url text,
  created_at timestamptz not null default now()
);

create table if not exists study_progress (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  last_vocabulary_id integer references vocabulary_items(id),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table vocabulary_items enable row level security;
alter table study_progress enable row level security;

create policy "Vocabulary is readable by everyone" on vocabulary_items
  for select using (true);
create policy "A learner can read their own progress" on study_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "A learner can add their own progress" on study_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "A learner can update their own progress" on study_progress
  for update to authenticated using ((select auth.uid()) = user_id);
