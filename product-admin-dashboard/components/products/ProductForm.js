 "use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "../layout/ProtectedLayout";
import Loader from "../common/Loader";
import { addProduct, getProduct, updateProduct } from "../../api/products";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  thumbnail: "",
};

export default function ProductForm({ mode, id }) {
  return (
    <ProtectedLayout>
      <Form mode={mode} id={id} />
    </ProtectedLayout>
  );
}

function Form({ mode, id }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [pageLoading, setPageLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef(null);

  useEffect(() => {
    if (mode !== "edit") return;

    const controller = new AbortController();
    controllerRef.current = controller;

    getProduct(id, controller.signal)
      .then((product) => {
        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stock: product.stock ?? "",
          thumbnail: product.thumbnail || product.images?.[0] || "",
        });
      })
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setPageLoading(false));

    return () => controller.abort();
  }, [mode, id]);

  function change(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setErrors((current) => ({ ...current, [e.target.name]: "" }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.description.trim()) next.description = "Description is required.";

    const price = Number(form.price);
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      next.price = "Enter a valid price.";
    }

    const stock = Number(form.stock);
    if (form.stock === "" || !Number.isInteger(stock) || stock < 0) {
      next.stock = "Enter a valid stock number.";
    }

    if (!form.category.trim()) next.category = "Category is required.";
    if (form.thumbnail && !/^https?:\/\/.+/i.test(form.thumbnail)) {
      next.thumbnail = "Enter a valid image URL.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      thumbnail: form.thumbnail.trim(),
    };

    try {
      const result =
        mode === "edit"
          ? await updateProduct(id, payload)
          : await addProduct(payload);

      // DummyJSON does not persist mutations. The result is shown through the
      // redirect/query notice, while the server's original catalog remains unchanged.
      router.replace(`/products/${result.id}?mutated=${mode}`);
    } catch (err) {
      setError(err.message || "Save failed.");
      setSaving(false);
    }
  }

  if (pageLoading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl">
      <button className="mb-5 text-sm font-medium text-blue-600" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">
          {mode === "edit" ? "Edit product" : "Add product"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "edit" ? "Update the product details." : "Create a new product."}
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {[
            ["title", "Title", "text"],
            ["category", "Category", "text"],
            ["price", "Price", "number"],
            ["stock", "Stock", "number"],
            ["thumbnail", "Image URL", "url"],
          ].map(([name, label, type]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input
                className="input"
                name={name}
                type={type}
                value={form[name]}
                onChange={change}
                min={type === "number" ? "0" : undefined}
                step={name === "price" ? "0.01" : undefined}
              />
              {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              className="input min-h-32"
              name="description"
              value={form.description}
              onChange={change}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => router.back()}>
              Cancel
            </button>
            <button className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
