
import "dotenv/config";
import { supabase } from "./src/lib/supabase";
import { transactions, categories, profile } from "./src/lib/mockData";

async function seed() {
  console.log("Seeding categories...");
  const { error: catError } = await supabase
    .from("categories")
    .upsert(
      categories.map((c) => ({
        name: c.name,
        emoji: c.emoji,
        budget: c.budget,
        type: c.type,
      })),
      { onConflict: "name" }
    );

  if (catError) {
    console.error("Error seeding categories:", catError);
  } else {
    console.log("Categories seeded successfully!");
  }

  console.log("Seeding profile...");
  const { error: profileError } = await supabase
    .from("profile")
    .upsert([
      {
        id: 1, // Assuming single profile
        name: profile.name,
        tagline: profile.tagline,
        avatar: profile.avatar,
      },
    ]);

  if (profileError) {
    console.error("Error seeding profile:", profileError);
  } else {
    console.log("Profile seeded successfully!");
  }

  console.log("Seeding transactions...");
  const { error: txnError } = await supabase
    .from("transactions")
    .upsert(
      transactions.map((t) => ({
        date: t.date,
        title: t.title,
        amount: t.amount,
        time: t.time,
        category_name: t.category,
      }))
    );

  if (txnError) {
    console.error("Error seeding transactions:", txnError);
  } else {
    console.log("Transactions seeded successfully!");
  }
}

seed();
