# Supabase Database Setup

ได้เตรียม Database สำหรับโปรเจค Wanjot ไว้ให้แล้ว โดยใช้ Supabase และไม่ต้องมีการ Login (Public Access)

## ขั้นตอนการติดตั้ง

1.  **สร้างโปรเจคใน Supabase:**
    *   ไปที่ [supabase.com](https://supabase.com) แล้วสร้างโปรเจคใหม่

2.  **รัน SQL Schema:**
    *   เปิดไฟล์ `supabase_schema.sql` ในโปรเจคนี้
    *   Copy เนื้อหาทั้งหมดไปวางใน **SQL Editor** ของ Supabase แล้วกด **Run**

3.  **ตั้งค่า Environment Variables:**
    *   สร้างไฟล์ `.env` (เลียนแบบ `.env.example`)
    *   ใส่ `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY` จาก Supabase Project Settings > API

## ข้อมูลใน Database

*   **categories**: เก็บหมวดหมู่ (อาหาร, เดินทาง, รายได้ ฯลฯ) พร้อม Emoji และงบประมาณ
*   **transactions**: เก็บรายการรับ-จ่าย เชื่อมโยงกับหมวดหมู่
*   **profile**: เก็บข้อมูลโปรไฟล์ (ชื่อ, คำโปรย, รูป)

## การใช้งานในโค้ด

ได้เตรียม Supabase Client ไว้ที่ `src/lib/supabase.ts` และ Server Functions ไว้ที่ `src/lib/api/db.functions.ts`

ตัวอย่างการเรียกใช้:

```typescript
import { getTransactions } from '@/lib/api/db.functions'

// ใน Component หรือ Loader
const transactions = await getTransactions()
```

---
*หมายเหตุ: เนื่องจากตั้งค่า RLS ให้เป็น Public (Allow public access) ทุกคนที่มี URL และ Key จะสามารถอ่าน/เขียนข้อมูลได้โดยไม่ต้อง Login ตามความต้องการของคุณ*
