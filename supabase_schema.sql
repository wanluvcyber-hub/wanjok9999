-- 1. ลบนโยบายเดิมออกก่อนเพื่อป้องกันการซ้ำซ้อน
drop policy if exists "Allow public read categories" on categories;
drop policy if exists "Allow public insert categories" on categories;
drop policy if exists "Allow public update categories" on categories;
drop policy if exists "Allow public delete categories" on categories;

drop policy if exists "Allow public read transactions" on transactions;
drop policy if exists "Allow public insert transactions" on transactions;
drop policy if exists "Allow public update transactions" on transactions;
drop policy if exists "Allow public delete transactions" on transactions;

drop policy if exists "Allow public read profile" on profile;
drop policy if exists "Allow public update profile" on profile;

-- 2. เปิดใช้งาน RLS
alter table categories enable row level security;
alter table transactions enable row level security;
alter table profile enable row level security;

-- 3. สร้างนโยบายใหม่ที่อนุญาตให้ทั้ง anon (ไม่ล็อกอิน) และ authenticated (ล็อกอิน) เข้าถึงได้
create policy "Allow public read categories" on categories for select to anon, authenticated using (true);
create policy "Allow public insert categories" on categories for insert to anon, authenticated with check (true);
create policy "Allow public update categories" on categories for update to anon, authenticated using (true);
create policy "Allow public delete categories" on categories for delete to anon, authenticated using (true);

create policy "Allow public read transactions" on transactions for select to anon, authenticated using (true);
create policy "Allow public insert transactions" on transactions for insert to anon, authenticated with check (true);
create policy "Allow public update transactions" on transactions for update to anon, authenticated using (true);
create policy "Allow public delete transactions" on transactions for delete to anon, authenticated using (true);

create policy "Allow public read profile" on profile for select to anon, authenticated using (true);
create policy "Allow public update profile" on profile for update to anon, authenticated using (true);

-- 4. ให้สิทธิ์การใช้งาน (Grant) ระดับตารางให้กับบทบาท anon และ authenticated
grant all on table categories to anon, authenticated;
grant all on table transactions to anon, authenticated;
grant all on table profile to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
