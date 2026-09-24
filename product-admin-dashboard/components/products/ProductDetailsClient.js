 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "../layout/ProtectedLayout";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import { getProduct } from "../../api/products";

export default function ProductDetailsClient({ id }) {
  return (
    <ProtectedLayout>
      <Details id={id} />
    </ProtectedLayout>
  );
}

function Details({ id }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setNotFound(false);

    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      if (/not found/i.test(err.message)) setNotFound(true);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (notFound) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-2 text-slate-500">The requested product does not exist.</p>
        <button className="btn-primary mt-5" onClick={() => router.push("/products")}>
          Back to products
        </button>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <button className="mb-5 text-sm font-medium text-blue-600" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            {(product.images?.length ? product.images : [product.thumbnail]).map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`${product.title} ${index + 1}`}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">{product.category}</p>
          <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Price</p>
              <p className="mt-1 text-xl font-bold">${product.price}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Rating</p>
              <p className="mt-1 text-xl font-bold">⭐ {product.rating}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Stock</p>
              <p className="mt-1 text-xl font-bold">{product.stock}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Brand</p>
              <p className="mt-1 font-semibold">{product.brand || "—"}</p>
            </div>
          </div>

          <button className="btn-primary mt-6" onClick={() => router.push(`/products/${product.id}/edit`)}>
            Edit product
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        <div className="mt-4 space-y-4">
          {(product.reviews || []).length ? (
            product.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex justify-between gap-3">
                  <strong>{review.reviewerName || "Anonymous"}</strong>
                  <span>⭐ {review.rating}</span>
                </div>
                <p className="mt-1 text-slate-600">{review.comment}</p>
                {review.date && <p className="mt-1 text-xs text-slate-400">{review.date}</p>}
              </div>
            ))
          ) : (
            <p className="text-slate-500">No reviews available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
