import "server-only";
import { getSupabaseClient } from "@/lib/supabase/server-client";

export async function selectAll<Row, T>(
  table: string,
  mapRow: (row: Row) => T,
  orderBy: string = "created_at",
  ascending = false
): Promise<T[]> {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select("*")
    .order(orderBy, { ascending });
  if (error) throw new Error(`[${table}] select: ${error.message}`);
  return ((data ?? []) as Row[]).map(mapRow);
}

export async function selectBySlug<Row, T>(
  table: string,
  slug: string,
  mapRow: (row: Row) => T
): Promise<T | null> {
  const { data, error } = await getSupabaseClient()
    .from(table)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`[${table}] selectBySlug: ${error.message}`);
  return data ? mapRow(data as Row) : null;
}

export async function selectById<Row, T>(table: string, id: string, mapRow: (row: Row) => T): Promise<T | null> {
  const { data, error } = await getSupabaseClient().from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`[${table}] selectById: ${error.message}`);
  return data ? mapRow(data as Row) : null;
}

export async function insertOne<Row, T>(
  table: string,
  row: Record<string, unknown>,
  mapRow: (row: Row) => T
): Promise<T> {
  // `table` is a runtime string, not a literal type, so with no generated
  // Database schema type, insert() can't infer this table's row shape and
  // resolves its payload param to `never`. The Row/T generics above already
  // give us real type safety; cast the builder past that gap.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getSupabaseClient().from(table) as any).insert(row).select().single();
  if (error) throw new Error(`[${table}] insert: ${error.message}`);
  return mapRow(data as Row);
}

export async function upsertMany<Row>(table: string, rows: Record<string, unknown>[], conflictKey: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseClient().from(table) as any).upsert(rows, { onConflict: conflictKey });
  if (error) throw new Error(`[${table}] upsert: ${error.message}`);
}

export async function updateByKey<Row, T>(
  table: string,
  key: "id" | "slug",
  keyValue: string,
  row: Record<string, unknown>,
  mapRow: (row: Row) => T
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (getSupabaseClient().from(table) as any).update(row).eq(key, keyValue).select().single();
  if (error) throw new Error(`[${table}] update: ${error.message}`);
  return mapRow(data as Row);
}

export async function deleteByKey(table: string, key: "id" | "slug", keyValue: string): Promise<void> {
  const { error } = await getSupabaseClient().from(table).delete().eq(key, keyValue);
  if (error) throw new Error(`[${table}] delete: ${error.message}`);
}
