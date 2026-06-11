import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FileSpreadsheet, Bell, Palette, Info, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "ตั้งค่า – Wanjot" }, { name: "description", content: "ตั้งค่าและเชื่อม Google Sheet" }] }),
  component: () => (
    <PageShell title="ตั้งค่า">
      <h1 className="px-1 pt-2 text-center font-display text-3xl font-bold text-cocoa">ตั้งค่า</h1>

      <section className="paper-card divide-y divide-border/70">
        {[
          { icon: FileSpreadsheet, label: "เชื่อม Google Sheet", desc: "ดึงข้อมูลจากชีตของคุณ" },
          { icon: Bell, label: "การแจ้งเตือน", desc: "เตือนเมื่อใกล้เกินงบ" },
          { icon: Palette, label: "ธีมและสี", desc: "ปรับแต่งหน้าตา" },
          { icon: Info, label: "เกี่ยวกับ Wanjot", desc: "เวอร์ชัน 0.1.0" },
        ].map(({ icon: Icon, label, desc }) => (
          <button key={label} className="flex w-full items-center gap-3 p-4 text-left">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream"><Icon className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-semibold text-cocoa">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </section>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        ทำด้วย ❤️ สำหรับ LINE Mini App · มินิแอป Wanjot
      </p>
    </PageShell>
  ),
});
