import React, { useState, useMemo, useRef } from "react";
import {
  ShoppingBag, Plus, Minus, X, ChevronRight, ChevronLeft, Check,
  MapPin, Calendar, Truck, Store, Phone, Clock,
  ArrowRight, Utensils, Soup, Beef, Fish, Salad, Cookie, Wheat, Carrot, Landmark,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* STORE INFO (from the CTown Supermarkets East Hartford listing)     */
/* ------------------------------------------------------------------ */

const STORE = {
  name: "CTown Supermarkets",
  address: "442 Main St, East Hartford, CT 06118",
  phone: "(860) 568-2221",
  phoneHref: "tel:8605682221",
};

/* ------------------------------------------------------------------ */
/* SIZE TIERS                                                          */
/* ------------------------------------------------------------------ */

const SIZE_INFO = {
  small: { label: "Small", note: "Serves 10–15" },
  medium: { label: "Medium", note: "Serves 30" },
  large: { label: "Large", note: "Serves 40" },
  single: { label: "Whole tray", note: "Serves ~12" },
  each: { label: "Each", note: "" },
};

/* ------------------------------------------------------------------ */
/* MENU — transcribed from the uploaded catering price list            */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: "arroz", label: "Rice Dishes", labelEs: "Platos de Arroz", icon: Wheat },
  { id: "carnes", label: "Meats & Poultry", labelEs: "Carnes y Aves", icon: Beef },
  { id: "pescados", label: "Seafood", labelEs: "Pescados y Mariscos", icon: Fish },
  { id: "pastas", label: "Pasta", labelEs: "Pastas", icon: Soup },
  { id: "ensaladas", label: "Salads", labelEs: "Ensaladas", icon: Salad },
  { id: "acompanamientos", label: "Sides", labelEs: "Acompañamientos", icon: Carrot },
  { id: "especiales", label: "Specials & Desserts", labelEs: "Especiales y Postres", icon: Cookie },
];

const tiered = (small, medium, large) => ({ small, medium, large });

const MENU = {
  arroz: [
    { id: "r1", en: "White Rice", es: "Arroz Blanco", sizes: tiered(25, 40, 50) },
    { id: "r2", en: "Rice with Pigeon Peas", es: "Arroz con Gandules", sizes: tiered(30, 50, 65) },
    { id: "r3", en: "Rice with Chicken or Meat", es: "Arroz con Pollo o Carne", sizes: tiered(40, 60, 75) },
    { id: "r4", en: "Rice with Beans", es: "Arroz con Habichuelas", sizes: tiered(30, 50, 65) },
    { id: "r5", en: "Yellow Rice", es: "Arroz Amarillo", sizes: tiered(30, 50, 65) },
    { id: "r6", en: "Rice with Vegetables", es: "Arroz con Vegetales", sizes: tiered(30, 50, 65) },
    { id: "r7", en: "Fried Rice Style", es: "Chao Fan", sizes: tiered(40, 80, 110) },
  ],
  carnes: [
    { id: "m1", en: "Stewed Chicken", es: "Pollo Guisado", sizes: tiered(50, 70, 90) },
    { id: "m2", en: "Stewed Beef", es: "Carne de Res Guisada", sizes: tiered(100, 200, 300) },
    { id: "m3", en: "Baked Leg Quarters", es: "Muslos y Cadera Asada", sizes: tiered(35, 65, 90) },
    { id: "m4", en: "Fried Wings", es: "Alitas Fritas", sizes: tiered(65, 95, 150) },
    { id: "m5", en: "Pork Spare Ribs", es: "Costilla de Cerdo Guisada/Asada", sizes: tiered(80, 120, 180) },
    { id: "m6", en: "Beef Ribs", es: "Costilla de Res", sizes: tiered(100, 200, 300) },
    { id: "m7", en: "Steak and Onions", es: "Bistec Encebollado", sizes: tiered(100, 200, 300) },
    { id: "m8", en: "Pepper Steak with Onion", es: "Bistec con Pimienta y Cebolla", sizes: tiered(100, 200, 300) },
    { id: "m9", en: "Pork Trotters", es: "Patitas de Cerdo", sizes: tiered(70, 120, 160) },
    { id: "m10", en: "Cubed Steak in Onion", es: "Bistec en Cubos con Cebolla", sizes: tiered(90, 130, 180) },
    { id: "m11", en: "Fried Chicken", es: "Pollo Frito", sizes: tiered(40, 60, 90) },
    { id: "m12", en: "Fried Chicken Tenders", es: "Lomitos de Pollo Fritos", sizes: tiered(50, 90, 150) },
    { id: "m13", en: "Beef Oxtail", es: "Rabo de Res", sizes: tiered(100, 150, 300) },
    { id: "m14", en: "Stewed Goat", es: "Chivo Guisado", sizes: tiered(80, 140, 200) },
    { id: "m15", en: "Stewed Pork", es: "Cerdo Guisado", sizes: tiered(40, 85, 110) },
    { id: "m16", en: "Roasted Pork Shoulder", es: "Pernil Asado", sizes: { single: 40 } },
    { id: "m17", en: "Rotisserie Chicken", es: "Pollo Asado", sizes: { each: 9.99 } },
  ],
  pescados: [
    { id: "p1", en: "Fried Fish", es: "Pescado Frito", sizes: tiered(60, 120, 180) },
    { id: "p2", en: "Baked Fish", es: "Pescado Horneado", sizes: tiered(70, 140, 200) },
    { id: "p3", en: "Salted Fish", es: "Bacalao", sizes: tiered(75, 120, 180) },
    { id: "p4", en: "Seafood Salad", es: "Ensalada de Marisco", sizes: tiered(80, 150, 200) },
    { id: "p5", en: "Octopus Salad", es: "Ensalada de Pulpo", sizes: tiered(80, 120, 180) },
  ],
  pastas: [
    { id: "pa1", en: "Pasta with Beef", es: "Pasta con Carne", sizes: tiered(60, 80, 120) },
    { id: "pa2", en: "Mac and Cheese", es: "Macarrones con Queso", sizes: tiered(45, 80, 100) },
    { id: "pa3", en: "Spaghetti in Sauce", es: "Espaguetis en Salsa", sizes: tiered(35, 65, 75) },
    { id: "pa4", en: "Spaghetti with Ground Beef", es: "Espaguetis con Carne Molida", sizes: tiered(55, 85, 95) },
    { id: "pa5", en: "Spaghetti with Shrimp", es: "Espaguetis con Camarones", sizes: tiered(65, 95, 105) },
    { id: "pa6", en: "Spaghetti with Meatballs", es: "Espaguetis con Albóndigas", sizes: tiered(55, 85, 95) },
    { id: "pa7", en: "Baked Ziti (no meat)", es: "Baked Ziti Sin Carne", sizes: tiered(40, 60, 80) },
    { id: "pa8", en: "Chicken Alfredo", es: "Pollo Alfredo", sizes: tiered(65, 90, 120) },
    { id: "pa9", en: "Lasagna", es: "Lasagna", sizes: tiered(75, 120, 180), note: "Large pan only" },
  ],
  ensaladas: [
    { id: "s1", en: "Potato Salad", es: "Ensalada de Papa", sizes: tiered(40, 60, 75) },
    { id: "s5", en: "Green Salad", es: "Ensalada Verde", sizes: tiered(30, 45, 55) },
    { id: "s6", en: "Pasta Salad with Tuna", es: "Ensalada de Codito con Tuna", sizes: tiered(35, 55, 70) },
    { id: "s7", en: "Pasta Salad with Ham", es: "Ensalada de Codito con Jamón", sizes: tiered(25, 55, 70) },
  ],
  acompanamientos: [
    { id: "s2", en: "Fried Sweet Plantains", es: "Plátanos Maduros", sizes: tiered(45, 80, 120) },
    { id: "s3", en: "Fried Green Plantains", es: "Tostones", sizes: tiered(25, 40, 65) },
    { id: "s4", en: "Gizzard with Green Bananas", es: "Mollejas en Escabeche", sizes: tiered(45, 60, 90) },
    { id: "s8", en: "Green Bananas", es: "Guineos Verdes", sizes: tiered(30, 45, 60) },
    { id: "s9", en: "Cassava", es: "Yuca", sizes: tiered(35, 55, 75) },
    { id: "s10", en: "Mashed Potatoes", es: "Puré de Papa", sizes: tiered(35, 65, 95) },
    { id: "s11", en: "Mashed Green Plantains", es: "Mangú", sizes: tiered(35, 60, 85) },
    { id: "s12", en: "Garlic Bread", es: "Pan de Ajo", sizes: tiered(25, 35, 50) },
    { id: "s13", en: "Beans (Container)", es: "Cubo de Habichuelas", sizes: tiered(25, 35, 50) },
    { id: "s14", en: "Steamed Vegetables", es: "Vegetales al Vapor", sizes: tiered(35, 90, 140) },
  ],
  especiales: [
    { id: "d1", en: "Sweet Plantain Lasagna", es: "Pastelón", sizes: tiered(65, 110, 170) },
    { id: "d2", en: "Traditional Caramel Custard", es: "Flan", sizes: tiered(40, 80, 120) },
  ],
};

// flatten every item+size into an addressable variant for cart lookups
const VARIANTS = {};
Object.values(MENU).flat().forEach((item) => {
  Object.entries(item.sizes).forEach(([sizeKey, price]) => {
    VARIANTS[`${item.id}__${sizeKey}`] = { item, sizeKey, price };
  });
});

const fmt = (n) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

function TearEdge({ flip }) {
  return (
    <div
      style={{
        height: 14, width: "100%",
        transform: flip ? "rotate(180deg)" : "none",
        background:
          "linear-gradient(-45deg, var(--card) 8px, transparent 0), linear-gradient(45deg, var(--card) 8px, transparent 0)",
        backgroundPosition: "left top",
        backgroundSize: "14px 14px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

function Stepper({ qty, onDec, onInc }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onDec} className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, border: "1px solid var(--line)", color: "var(--ink)" }} aria-label="Decrease quantity">
        <Minus size={12} />
      </button>
      <span className="font-mono text-sm w-4 text-center" style={{ color: "var(--ink)" }}>{qty}</span>
      <button onClick={onInc} className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: "var(--red)", color: "#fff" }} aria-label="Increase quantity">
        <Plus size={12} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ORDER TICKET (signature element — deli-counter order slip)          */
/* ------------------------------------------------------------------ */

function OrderTicket({ cart, subtotal, date, onDateChange, time, onTimeChange, onDec, onInc, onCheckout }) {
  const lines = Object.entries(cart).filter(([, q]) => q > 0);
  const minDate = minOrderDate();
  return (
    <div style={{ background: "var(--paper)" }}>
      <TearEdge />
      <div style={{ background: "var(--card)" }} className="px-5 pt-4 pb-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="uppercase tracking-widest text-xs font-semibold" style={{ color: "var(--red)", fontFamily: "'IBM Plex Mono', monospace" }}>
            Order Ticket
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--ink)", opacity: 0.5 }}>
            {lines.length} {lines.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 pb-3" style={{ borderBottom: "1px dashed var(--line)" }}>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ink)", opacity: 0.6, fontFamily: "'Public Sans', sans-serif" }}>
              Date
            </span>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)", opacity: 0.5 }} />
              <input
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded-md text-sm"
                style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}
              />
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ink)", opacity: 0.6, fontFamily: "'Public Sans', sans-serif" }}>
              Time
            </span>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)", opacity: 0.5 }} />
              <input
                type="time"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded-md text-sm"
                style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}
              />
            </div>
          </label>
        </div>

        {lines.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: "var(--ink)", opacity: 0.55, fontFamily: "'Public Sans', sans-serif" }}>
            Your tray list is empty.<br />Add dishes from the menu.
          </p>
        ) : (
          <div className="flex flex-col gap-3 py-2" style={{ maxHeight: 280, overflowY: "auto" }}>
            {lines.map(([key, qty]) => {
              const v = VARIANTS[key];
              if (!v) return null;
              const sizeInfo = SIZE_INFO[v.sizeKey];
              return (
                <div key={key} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate" style={{ color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>
                      {v.item.en}
                    </span>
                    <span className="text-xs font-mono" style={{ color: "var(--ink)", opacity: 0.5 }}>
                      {sizeInfo.label} · {fmt(v.price)}
                    </span>
                  </div>
                  <Stepper qty={qty} onDec={() => onDec(key)} onInc={() => onInc(key)} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 pt-3" style={{ borderTop: "1px dashed var(--line)" }}>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--ink)", fontFamily: "'IBM Plex Mono', monospace" }}>Subtotal</span>
            <span className="text-lg font-semibold" style={{ color: "var(--red)", fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(subtotal)}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--ink)", opacity: 0.5, fontFamily: "'Public Sans', sans-serif" }}>
            CT charges a 7.35% meals tax on prepared catering orders, added to every order at checkout — pickup or delivery.
          </p>
        </div>

        <button
          disabled={lines.length === 0}
          onClick={onCheckout}
          className="w-full mt-4 py-3 rounded-md flex items-center justify-center gap-2 font-medium uppercase text-sm tracking-wide"
          style={{
            background: lines.length === 0 ? "var(--line)" : "var(--red)",
            color: lines.length === 0 ? "var(--ink)" : "#fff",
            opacity: lines.length === 0 ? 0.6 : 1,
            cursor: lines.length === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Public Sans', sans-serif",
          }}
        >
          Send to the kitchen <ArrowRight size={15} />
        </button>
      </div>
      <TearEdge flip />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm py-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink)", opacity: 0.75 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MENU CARD — size-tiered                                             */
/* ------------------------------------------------------------------ */

function MenuCard({ item, cart, onInc, onDec }) {
  const sizeKeys = Object.keys(item.sizes);
  return (
    <div className="p-5 rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <div className="mb-3">
        <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17, color: "var(--ink)" }}>{item.en}</h3>
        <p className="text-xs italic" style={{ color: "var(--ink)", opacity: 0.55, fontFamily: "'Public Sans', sans-serif" }}>{item.es}{item.note ? ` · ${item.note}` : ""}</p>
      </div>
      <div className="flex flex-col gap-2">
        {sizeKeys.map((sizeKey) => {
          const key = `${item.id}__${sizeKey}`;
          const qty = cart[key] || 0;
          const price = item.sizes[sizeKey];
          const info = SIZE_INFO[sizeKey];
          return (
            <div key={key} className="flex items-center justify-between text-sm" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              <div>
                <span className="font-medium" style={{ color: "var(--ink)" }}>{info.label}</span>
                {info.note && <span className="ml-1 text-xs" style={{ color: "var(--ink)", opacity: 0.5 }}>· {info.note}</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm" style={{ color: "var(--red)" }}>{fmt(price)}</span>
                {qty > 0 ? (
                  <Stepper qty={qty} onDec={() => onDec(key)} onInc={() => onInc(key)} />
                ) : (
                  <button
                    onClick={() => onInc(key)}
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 24, height: 24, border: "1px solid var(--ink)", color: "var(--ink)" }}
                    aria-label={`Add ${item.en} ${info.label}`}
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CHECKOUT FLOW                                                       */
/* ------------------------------------------------------------------ */

const STEPS = ["Schedule", "Contact", "Pay"];
const LEAD_TIME_DAYS = 1;

function minOrderDate() {
  const d = new Date();
  d.setDate(d.getDate() + LEAD_TIME_DAYS);
  return d.toISOString().split("T")[0];
}

function CheckoutFlow({ cart, subtotal, initialDate, initialTime, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fulfillment: "pickup", date: initialDate || "", time: initialTime || "", address: "",
    name: "", email: "", phone: "",
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const minDate = minOrderDate();
  const CT_MEALS_TAX_RATE = 0.0735; // CT DRS: prepared meals & catering, incl. pickup and delivery
  const tax = subtotal * CT_MEALS_TAX_RATE;
  const total = subtotal + tax;

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.date) e.date = "Pick a date";
      else if (form.date < minDate) e.date = `Needs ${LEAD_TIME_DAYS} days notice`;
      if (!form.time) e.time = "Pick a time";
      if (form.fulfillment === "delivery" && !form.address) e.address = "Enter a delivery address";
    }
    if (step === 1) {
      if (!form.name) e.name = "Enter your name";
      if (!form.email) e.email = "Enter an email";
      if (!form.phone) e.phone = "Enter a phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    setPayError("");
    setPaying(true);
    const orderNo = String(1000 + Math.floor(Math.random() * 9000));
    try {
      // Stash the order so we can show a proper confirmation once Stripe
      // redirects back — a fresh page load otherwise loses this state.
      sessionStorage.setItem(
        "ctownPendingOrder",
        JSON.stringify({ form, total, orderNo, lines: Object.entries(cart).filter(([, q]) => q > 0) })
      );
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderNo,
          customerEmail: form.email,
          customerName: form.name,
          customerPhone: form.phone,
          fulfillment: form.fulfillment,
          date: form.date,
          time: form.time,
          address: form.fulfillment === "delivery" ? form.address : STORE.address,
          itemsSummary: Object.entries(cart)
            .filter(([, q]) => q > 0)
            .map(([key, qty]) => {
              const v = VARIANTS[key];
              return v ? `${qty}x ${v.item.en} (${SIZE_INFO[v.sizeKey].label})` : "";
            })
            .filter(Boolean)
            .join("; "),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start payment");
      window.location.href = data.url;
    } catch (err) {
      setPayError("Something went wrong starting payment. Please try again.");
      setPaying(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => s + 1);
  };

  const lines = Object.entries(cart).filter(([, q]) => q > 0);
  const inputStyle = { background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" };
  const Field = ({ label, error, children }) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium" style={{ color: "var(--ink)" }}>{label}</span>
      {children}
      {error && <span className="text-xs" style={{ color: "var(--red)" }}>{error}</span>}
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 w-full">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6" style={{ color: "var(--ink)", opacity: 0.65, fontFamily: "'Public Sans', sans-serif" }}>
        <ChevronLeft size={16} /> Back to menu
      </button>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full text-xs font-mono" style={{ width: 24, height: 24, background: i <= step ? "var(--red)" : "transparent", color: i <= step ? "#fff" : "var(--ink)", border: i <= step ? "none" : "1px solid var(--line)" }}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span className="text-xs uppercase tracking-wide hidden sm:inline" style={{ color: "var(--ink)", opacity: i <= step ? 1 : 0.4, fontFamily: "'Public Sans', sans-serif" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px" style={{ background: "var(--line)" }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-lg p-6 sm:p-8" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--ink)" }}>Schedule your order</h2>
            <p className="text-xs -mt-3" style={{ color: "var(--ink)", opacity: 0.55, fontFamily: "'Public Sans', sans-serif" }}>
              Catering orders need at least {LEAD_TIME_DAYS} days notice — earliest date is {minDate}.
            </p>
            <div className="flex gap-3">
              {[{ id: "pickup", label: "Pickup", icon: Store }, { id: "delivery", label: "Delivery", icon: Truck }].map((opt) => (
                <button key={opt.id} onClick={() => set("fulfillment", opt.id)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium" style={{ border: `1px solid ${form.fulfillment === opt.id ? "var(--red)" : "var(--line)"}`, background: form.fulfillment === opt.id ? "var(--red)" : "transparent", color: form.fulfillment === opt.id ? "#fff" : "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>
                  <opt.icon size={16} /> {opt.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date" error={errors.date}>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)", opacity: 0.5 }} />
                  <input type="date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md text-sm" style={inputStyle} />
                </div>
              </Field>
              <Field label="Time" error={errors.time}>
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)", opacity: 0.5 }} />
                  <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md text-sm" style={inputStyle} />
                </div>
              </Field>
            </div>
            {form.fulfillment === "delivery" && (
              <Field label="Delivery address" error={errors.address}>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink)", opacity: 0.5 }} />
                  <input type="text" placeholder="Street, city, zip" value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md text-sm" style={inputStyle} />
                </div>
              </Field>
            )}
            {form.fulfillment === "pickup" && (
              <p className="text-xs" style={{ color: "var(--ink)", opacity: 0.55, fontFamily: "'Public Sans', sans-serif" }}>
                Pickup at {STORE.name} — {STORE.address}
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--ink)" }}>Who should we contact?</h2>
            <Field label="Full name" error={errors.name}><input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 rounded-md text-sm" style={inputStyle} /></Field>
            <Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-3 py-2 rounded-md text-sm" style={inputStyle} /></Field>
            <Field label="Phone" error={errors.phone}><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-3 py-2 rounded-md text-sm" style={inputStyle} /></Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--ink)" }}>Review & pay</h2>
            <div className="flex flex-col gap-2 text-sm" style={{ fontFamily: "'Public Sans', sans-serif", color: "var(--ink)" }}>
              <div><b>{form.fulfillment === "delivery" ? "Delivery" : "Pickup"}</b> — {form.date} at {form.time}</div>
              {form.fulfillment === "delivery" ? <div>{form.address}</div> : <div>{STORE.address}</div>}
              <div className="pt-2" style={{ opacity: 0.7 }}>{form.name} · {form.email} · {form.phone}</div>
            </div>
            <div className="pt-3" style={{ borderTop: "1px dashed var(--line)" }}>
              {lines.map(([key, qty]) => {
                const v = VARIANTS[key];
                return (
                  <div key={key} className="flex justify-between text-sm py-1 font-mono" style={{ color: "var(--ink)", opacity: 0.75 }}>
                    <span>{qty} × {v.item.en} ({SIZE_INFO[v.sizeKey].label})</span>
                    <span>{fmt(v.price * qty)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-sm py-1 font-mono pt-2 mt-1" style={{ borderTop: "1px dashed var(--line)", color: "var(--ink)", opacity: 0.75 }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 font-mono" style={{ color: "var(--ink)", opacity: 0.75 }}>
                <span>CT Meals Tax (7.35%)</span>
                <span>{fmt(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 mt-2" style={{ borderTop: "1px solid var(--line)", color: "var(--red)", fontFamily: "'IBM Plex Mono', monospace" }}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs pt-1" style={{ color: "var(--ink)", opacity: 0.55, fontFamily: "'Public Sans', sans-serif" }}>
              <Landmark size={14} /> You'll enter your card or bank details on Stripe's secure payment page — CTown never sees or stores that information.
            </div>
            {payError && <p className="text-xs" style={{ color: "var(--red)" }}>{payError}</p>}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))} className="text-sm px-4 py-2 rounded-md" style={{ color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step === STEPS.length - 1 ? (
            <button
              onClick={handlePay}
              disabled={paying}
              className="text-sm font-medium uppercase tracking-wide px-6 py-3 rounded-md flex items-center gap-2"
              style={{ background: "var(--red)", color: "#fff", fontFamily: "'Public Sans', sans-serif", opacity: paying ? 0.7 : 1 }}
            >
              {paying ? "Starting payment…" : `Pay ${fmt(total)} securely`} <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={next} className="text-sm font-medium uppercase tracking-wide px-6 py-3 rounded-md flex items-center gap-2" style={{ background: "var(--red)", color: "#fff", fontFamily: "'Public Sans', sans-serif" }}>
              Continue <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CONFIRMATION                                                        */
/* ------------------------------------------------------------------ */

function Confirmation({ orderNo, form, total, onNewOrder }) {
  return (
    <div className="max-w-md mx-auto px-5 py-16 text-center flex flex-col items-center">
      <div className="w-full">
        <TearEdge />
        <div className="px-6 py-8" style={{ background: "var(--card)" }}>
          <div className="flex items-center justify-center rounded-full mx-auto mb-4" style={{ width: 48, height: 48, background: "var(--gold)" }}>
            <Check color="var(--ink)" size={24} />
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "var(--ink)" }}>Order received</h2>
          <p className="font-mono text-sm mt-2" style={{ color: "var(--red)" }}>Ticket No. {orderNo}</p>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--ink)", opacity: 0.7, fontFamily: "'Public Sans', sans-serif" }}>
            We'll have your order ready for {form.fulfillment} on <b>{form.date}</b> at <b>{form.time}</b>.
            A confirmation is on its way to {form.email}. Questions? Call the store at {STORE.phone}.
          </p>
          <div className="mt-6 pt-4 flex justify-between text-sm font-mono" style={{ borderTop: "1px dashed var(--line)", color: "var(--ink)" }}>
            <span>Total charged</span><span style={{ color: "var(--red)" }}>{fmt(total)}</span>
          </div>
        </div>
        <TearEdge flip />
      </div>
      <button onClick={onNewOrder} className="mt-8 text-sm font-medium uppercase tracking-wide px-6 py-3 rounded-md" style={{ border: "1px solid var(--ink)", color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>
        Start a new order
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN APP                                                             */
/* ------------------------------------------------------------------ */

export default function CTownCateringSite() {
  const [cart, setCart] = useState({});
  const [view, setView] = useState("menu");
  const [activeCat, setActiveCat] = useState("arroz");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderNo, setOrderNo] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const sectionRefs = useRef({});

  const inc = (key) => setCart((c) => ({ ...c, [key]: (c[key] || 0) + 1 }));
  const dec = (key) => setCart((c) => {
    const q = (c[key] || 0) - 1;
    const next = { ...c };
    if (q <= 0) delete next[key]; else next[key] = q;
    return next;
  });

  const subtotal = useMemo(
    () => Object.entries(cart).reduce((sum, [key, q]) => sum + (VARIANTS[key] ? VARIANTS[key].price * q : 0), 0),
    [cart]
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const scrollTo = (id) => {
    setActiveCat(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const newOrder = () => { setCart({}); setView("menu"); setOrderNo(null); setOrderDate(""); setOrderTime(""); };

  // After Stripe redirects back from its hosted payment page, restore the
  // order we stashed in sessionStorage right before sending the customer
  // over, and show the real confirmation.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      const saved = sessionStorage.getItem("ctownPendingOrder");
      if (saved) {
        const { form, total, orderNo } = JSON.parse(saved);
        setLastForm(form);
        setOrderTotal(total);
        setOrderNo(orderNo);
        setView("confirmation");
        setCart({});
        sessionStorage.removeItem("ctownPendingOrder");
      }
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div style={{
      "--paper": "#FAF6F0", "--card": "#FFFFFF", "--ink": "#221E1B",
      "--red": "#C8102E", "--gold": "#E8A93B", "--line": "#E4DED2",
      background: "var(--paper)", minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
      `}</style>

      {/* TOP INFO BAR */}
      {view === "menu" && (
        <div className="hidden sm:flex items-center justify-center gap-6 py-2 text-xs" style={{ background: "var(--ink)", color: "#fff", fontFamily: "'Public Sans', sans-serif" }}>
          <span className="flex items-center gap-1"><MapPin size={12} /> {STORE.address}</span>
          <a href={STORE.phoneHref} className="flex items-center gap-1"><Phone size={12} /> {STORE.phone}</a>
          <span className="opacity-60 italic">Pickup or delivery · Recogida o entrega</span>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-4" style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => view !== "menu" && newOrder()}>
          <div className="flex items-center justify-center rounded" style={{ width: 34, height: 34, background: "var(--red)" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: "var(--gold)", fontSize: 20 }}>C</span>
          </div>
          <div className="leading-tight">
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 17, color: "var(--ink)" }}>CTown Catering</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "var(--ink)", opacity: 0.5, fontFamily: "'Public Sans', sans-serif" }}>
              East Hartford · Order Online / Pida en Línea
            </div>
          </div>
        </div>
        {view === "menu" && (
          <>
            <nav className="hidden lg:flex items-center gap-5">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => scrollTo(c.id)} className="flex flex-col items-start leading-tight" style={{ opacity: activeCat === c.id ? 1 : 0.5 }}>
                  <span className="text-sm font-medium" style={{ color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>{c.label}</span>
                  <span className="text-[10px] italic" style={{ color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>{c.labelEs}</span>
                </button>
              ))}
            </nav>
            <button onClick={() => setSheetOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full lg:hidden" style={{ background: "var(--red)", color: "#fff" }}>
              <ShoppingBag size={16} />
              <span className="text-sm font-mono">{cartCount}</span>
            </button>
          </>
        )}
      </header>

      {view === "confirmation" ? (
        <Confirmation orderNo={orderNo} form={lastForm} total={orderTotal} onNewOrder={newOrder} />
      ) : view === "checkout" ? (
        <CheckoutFlow cart={cart} subtotal={subtotal} initialDate={orderDate} initialTime={orderTime} onBack={() => setView("menu")} />
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-0">
          <main className="px-5 sm:px-8 pb-24">
            <section className="py-12 sm:py-16 max-w-2xl">
              <span className="uppercase text-xs tracking-widest font-semibold" style={{ color: "var(--red)", fontFamily: "'IBM Plex Mono', monospace" }}>
                Order Catering Online · Pida en Línea
              </span>
              <h1 className="mt-3 leading-[1.05]" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "clamp(30px, 4.5vw, 46px)", color: "var(--ink)" }}>
                Fresh trays, cooked to order.
              </h1>
              <p className="mt-2 italic" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: "clamp(17px, 2.2vw, 22px)", color: "var(--ink)", opacity: 0.7 }}>
                Bandejas frescas, cocinadas al momento — recogida o entrega en tu CTown.
              </p>
              <p className="mt-4 text-base" style={{ color: "var(--ink)", opacity: 0.7, fontFamily: "'Public Sans', sans-serif" }}>
                Rice, meats, seafood, pasta, sides, and desserts by the tray. Choose small, medium, or large to match your crowd, and we'll have it ready at the counter.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => scrollTo(c.id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ border: "1px solid var(--ink)", color: "var(--ink)", fontFamily: "'Public Sans', sans-serif" }}>
                    <c.icon size={14} /> {c.label}
                  </button>
                ))}
              </div>
            </section>

            {CATEGORIES.map((cat) => (
              <section key={cat.id} ref={(el) => (sectionRefs.current[cat.id] = el)} className="py-10 scroll-mt-20">
                <div className="flex items-baseline justify-between mb-1 border-t pt-8" style={{ borderColor: "var(--line)" }}>
                  <div>
                    <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--ink)" }}>{cat.label}</h2>
                    <p className="text-xs italic" style={{ color: "var(--ink)", opacity: 0.5, fontFamily: "'Public Sans', sans-serif" }}>{cat.labelEs}</p>
                  </div>
                  <cat.icon size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {MENU[cat.id].map((item) => (
                    <MenuCard key={item.id} item={item} cart={cart} onInc={inc} onDec={dec} />
                  ))}
                </div>
              </section>
            ))}

            <footer className="pt-10 mt-6 border-t text-sm" style={{ borderColor: "var(--line)", color: "var(--ink)", opacity: 0.6, fontFamily: "'Public Sans', sans-serif" }}>
              <p>{STORE.name} · {STORE.address} · <a href={STORE.phoneHref}>{STORE.phone}</a></p>
              <p className="mt-1">Prices reflect the current catering price list and may change without notice.</p>
            </footer>
          </main>

          <aside className="hidden lg:block sticky top-[65px] self-start h-fit py-8 pr-8 pl-4">
            <OrderTicket cart={cart} subtotal={subtotal} date={orderDate} onDateChange={setOrderDate} time={orderTime} onTimeChange={setOrderTime} onDec={dec} onInc={inc} onCheckout={() => setView("checkout")} />
          </aside>
        </div>
      )}

      {view === "menu" && cartCount > 0 && !sheetOpen && (
        <button onClick={() => setSheetOpen(true)} className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between px-5 py-4 rounded-lg" style={{ background: "var(--red)", color: "#fff" }}>
          <span className="flex items-center gap-2 text-sm font-medium" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            <ShoppingBag size={16} /> {cartCount} item{cartCount > 1 ? "s" : ""}
          </span>
          <span className="font-mono text-sm">{fmt(subtotal)}</span>
        </button>
      )}

      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(34,30,27,0.5)" }} onClick={() => setSheetOpen(false)}>
          <div className="max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end px-5 pt-3" style={{ background: "var(--paper)" }}>
              <button onClick={() => setSheetOpen(false)} style={{ color: "var(--ink)" }}><X size={20} /></button>
            </div>
            <OrderTicket cart={cart} subtotal={subtotal} date={orderDate} onDateChange={setOrderDate} time={orderTime} onTimeChange={setOrderTime} onDec={dec} onInc={inc} onCheckout={() => { setSheetOpen(false); setView("checkout"); }} />
          </div>
        </div>
      )}
    </div>
  );
}
