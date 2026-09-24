 "use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ products, onDelete, deletingId }) {
  const router = useRouter();

  return (
    <div className="space-y-3 md:hidden">
      {products.map((product) => (
        <article key={product.id} className="rounded-xl border bg-white p-4">
          <div className="flex gap-4">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.title}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <button
                className="text-left font-semibold hover:text-blue-600"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {product.title}
              </button>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              <p className="mt-2 font-semibold">${product.price}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-50 p-2">⭐ {product.rating}</div>
            <div className="rounded-lg bg-slate-50 p-2">Stock: {product.stock}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="btn-secondary flex-1" onClick={() => router.push(`/products/${product.id}/edit`)}>
              Edit
            </button>
            <button className="btn-danger flex-1" disabled={deletingId === product.id} onClick={() => onDelete(product.id)}>
              {deletingId === product.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
