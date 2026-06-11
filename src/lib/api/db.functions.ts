import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../supabase";

export const getTransactions = createServerFn({ method: "GET" })
  .handler(async () => {
    console.log('Fetching transactions from Supabase...');
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('time', { ascending: false });
      
      if (error) {
        console.error('Supabase error fetching transactions:', error.message, error.details);
        return [];
      }
      console.log(`Fetched ${data?.length || 0} transactions`);
      return data || [];
    } catch (e: any) {
      console.error('Unexpected error fetching transactions:', e.message);
      return [];
    }
  });

export const getCategories = createServerFn({ method: "GET" })
  .handler(async () => {
    console.log('Fetching categories from Supabase...');
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Supabase error fetching categories:', error.message, error.details);
        return [];
      }
      console.log(`Fetched ${data?.length || 0} categories`);
      return data || [];
    } catch (e: any) {
      console.error('Unexpected error fetching categories:', e.message);
      return [];
    }
  });

export const getProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    console.log('Fetching profile from Supabase...');
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
      
      if (error) {
        // If profile is missing, it's not always a critical error, might just be empty DB
        console.warn('Supabase warning/error fetching profile:', error.message);
        return null;
      }
      console.log('Fetched profile successfully');
      return data;
    } catch (e: any) {
      console.error('Unexpected error fetching profile:', e.message);
      return null;
    }
  });

export const addTransaction = createServerFn({ method: "POST" })
  .handler(async ({ data: transaction }) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    return data;
  });

export const deleteTransaction = createServerFn({ method: "POST" })
  .handler(async ({ data: id }) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
    return { success: true };
  });
