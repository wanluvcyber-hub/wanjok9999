import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { fmtBahtShort, thaiDate } from "@/lib/mockData";
import { Calendar, Download, ListChecks, RefreshCcw, Plus, ChevronRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsQueryOptions, categoriesQueryOptions } from "@/lib/api/queries";
import { addTransaction, deleteTransaction } from "@/lib/api/db.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/list")({
  head: () => ({ meta: [{ title: "รายการ – Wanjot" }, { name: "description", content: "รายการรายรับรายจ่ายทั้งหมด" }] }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(transactionsQueryOptions),
      context.queryClient.ensureQueryData(categoriesQueryOptions),
    ]);
  },
  component: ListPage,
});

function ListPage() {
  const queryClient = useQueryClient();
  const { data: transactions = [] } = useSuspenseQuery(transactionsQueryOptions);
  const { data: categories = [] } = useSuspenseQuery(categoriesQueryOptions);

  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [type, setType] = useState<"expense" | "income">("expense");

  const addMut = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("เพิ่มรายการสำเร็จ");
      setIsAddOpen(false);
      // Reset form
      setTitle("");
      setAmount("");
      setCategoryName("");
    },
    onError: (err) => {
      toast.error("เกิดข้อผิดพลาด: " + err.message);
    },
  });

  const delMut = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("ลบรายการสำเร็จ");
    },
    onError: (err) => {
      toast.error("เกิดข้อผิดพลาดในการลบ: " + err.message);
    },
  });

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t: any) => (filter === "expense" ? Number(t.amount) < 0 : Number(t.amount) > 0));
  }, [filter, transactions]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const k = t.date;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(t);
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  const tabs: { id: typeof filter; label: string }[] = [
    { id: "all", label: "ทั้งหมด" },
    { id: "expense", label: "รายจ่าย" },
    { id: "income", label: "รายรับ" },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !categoryName) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const numericAmount = Number(amount);
    const finalAmount = type === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    addMut.mutate({
      data: {
        title,
        amount: finalAmount,
        category_name: categoryName,
        date,
        time,
      }
    });
  };

  const filteredCategories = categories.filter((c: any) => c.type === type);

  return (
    <PageShell title="รายการ">
      <section className="paper-card flex items-center justify-center gap-2 p-4 text-cocoa">
        <Calendar className="h-5 w-5" />
        <span className="font-display text-base font-semibold">รายการล่าสุด</span>
      </section>

      <section className="paper-card flex items-center gap-3 p-4">
        <div className="flex-1">
          <div className="mb-2 font-display text-base font-bold text-cocoa">คัดกรองประเภทรายการ</div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  filter === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card text-cocoa">
          <div className="flex flex-col items-center text-[10px]">
            <Download className="h-4 w-4" /> ส่งออก
          </div>
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-cocoa">
          <ListChecks className="h-4 w-4" /> เลือกหลายรายการ
        </button>
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-cocoa">
          <RefreshCcw className="h-4 w-4" /> ตั้งรายการจดประจำ
        </button>
      </div>

      {grouped.map(([date, items]) => {
        const sum = items.reduce((s: number, t: any) => s + Number(t.amount), 0);
        return (
          <section key={date} className="space-y-2">
            <div className="flex items-center justify-between border-b border-border px-1 pb-1.5 text-sm">
              <span className="text-muted-foreground">{thaiDate(date)}</span>
              <span className={`font-semibold ${sum < 0 ? "text-primary" : "text-mint-foreground"}`}>
                รวม: {fmtBahtShort(sum)}
              </span>
            </div>
            <ul className="space-y-2">
              {items.map((t: any) => (
                <li key={t.id} className="paper-card flex items-center gap-3 p-3.5 group relative">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-cocoa">{t.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t.time} น.</span>
                      <span className="rounded-md bg-muted px-1.5 py-0.5">{t.category_name}</span>
                    </div>
                  </div>
                  <div className={`font-display text-base font-bold ${Number(t.amount) < 0 ? "text-primary" : "text-mint-foreground"}`}>
                    {fmtBahtShort(Number(t.amount))}
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (confirm("ต้องการลบรายการนี้ใช่หรือไม่?")) {
                        delMut.mutate({ data: t.id });
                      }
                    }}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <button
            aria-label="เพิ่มรายการ"
            className="fixed bottom-24 right-5 z-30 rounded-full bg-primary p-4 text-primary-foreground shadow-pop"
          >
            <Plus className="h-6 w-6" strokeWidth={2.6} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>เพิ่มรายการใหม่</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            
            <div className="flex gap-2 mb-4">
              <Button 
                type="button" 
                variant={type === "expense" ? "default" : "outline"} 
                className="flex-1"
                onClick={() => setType("expense")}
              >
                รายจ่าย
              </Button>
              <Button 
                type="button" 
                variant={type === "income" ? "default" : "outline"} 
                className="flex-1"
                style={type === "income" ? { backgroundColor: 'var(--color-mint-foreground)', color: 'white' } : {}}
                onClick={() => setType("income")}
              >
                รายรับ
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">ชื่อรายการ</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น กินข้าว, เงินเดือน" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">จำนวนเงิน (บาท)</Label>
              <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่</Label>
              <Select value={categoryName} onValueChange={setCategoryName} required>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c: any) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.emoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">วันที่</Label>
                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">เวลา</Label>
                <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={addMut.isPending}>
              {addMut.isPending ? "กำลังบันทึก..." : "บันทึกรายการ"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
