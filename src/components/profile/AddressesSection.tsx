"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Address = { _id: string; name: string; details: string; phone: string; city: string };
type AddressForm = Omit<Address, "_id">;
const emptyForm: AddressForm = { name: "", details: "", phone: "", city: "" };
const phonePattern = /^01[0125]\d{8}$/;

async function readError(response: Response) {
  try {
    const data = await response.json();
    return data?.message || data?.errors?.msg || "Something went wrong. Please try again.";
  } catch { return "Something went wrong. Please try again."; }
}

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/addresses", { cache: "no-store" });
      if (!response.ok) throw new Error(await readError(response));
      const payload = await response.json();
      setAddresses(Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load your addresses.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadAddresses(); }, [loadAddresses]);

  async function addAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhoneTouched(true);
    if (!phonePattern.test(form.phone)) return;
    setSaving(true);
    try {
      const response = await fetch("/api/addresses", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(await readError(response));
      setForm(emptyForm);
      setPhoneTouched(false);
      toast.success("Address added.");
      await loadAddresses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add this address.");
    } finally { setSaving(false); }
  }

  async function removeAddress(id: string) {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/addresses/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readError(response));
      setAddresses((current) => current.filter((address) => address._id !== id));
      toast.success("Address removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove this address.");
    } finally { setDeletingId(null); }
  }

  const update = (field: keyof AddressForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "phone" ? event.target.value.replace(/\D/g, "").slice(0, 11) : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="mt-8 rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-950/5 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"><MapPin size={21} /></span>
        <div><h2 className="text-xl font-bold text-slate-900 dark:text-white">My addresses</h2><p className="text-sm text-slate-500 dark:text-slate-400">Manage delivery addresses for your orders.</p></div>
      </div>

      {loading ? <div className="flex items-center gap-2 py-5 text-sm text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading addresses…</div> : addresses.length ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => <article key={address._id} className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="min-w-0"><p className="font-bold text-slate-900 dark:text-white">{address.name}</p><p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{address.details}, {address.city}</p><p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">{address.phone}</p></div>
            <Button type="button" variant="ghost" aria-label={`Remove ${address.name} address`} disabled={deletingId === address._id} onClick={() => void removeAddress(address._id)} className="shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40">
              {deletingId === address._id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            </Button>
          </article>)}
        </div>
      ) : <p className="mb-6 rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No saved addresses yet. Add one below.</p>}

      <form onSubmit={addAddress} className="grid gap-3 sm:grid-cols-2">
        <Input aria-label="Address name" required maxLength={40} placeholder="Name (e.g. Home)" value={form.name} onChange={update("name")} />
        <Input aria-label="City" required maxLength={80} placeholder="City" value={form.city} onChange={update("city")} />
        <Input aria-label="Address details" required maxLength={240} placeholder="Street and address details" value={form.details} onChange={update("details")} />
        <div>
          <Input aria-label="Phone" aria-invalid={phoneTouched && !phonePattern.test(form.phone)} aria-describedby="address-phone-error" required type="tel" inputMode="numeric" maxLength={11} placeholder="01012345678" value={form.phone} onBlur={() => setPhoneTouched(true)} onChange={update("phone")} />
          {phoneTouched && !phonePattern.test(form.phone) && <p id="address-phone-error" className="mt-1.5 text-xs font-medium text-rose-600">Enter a valid Egyptian mobile number, e.g. 01012345678.</p>}
        </div>
        <div className="sm:col-span-2"><Button type="submit" disabled={saving || Object.values(form).some((value) => !value.trim()) || !phonePattern.test(form.phone)} className="gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">{saving ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />} Add address</Button></div>
      </form>
    </section>
  );
}
