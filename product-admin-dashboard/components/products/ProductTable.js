 "use client";

import { useRouter } from "next/navigation";

export default function ProductTable({ products, onDelete, deletingId }) {
  const router = useRouter();

  return (
    <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <button
                      className="font-medium hover:text-blue-600"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      {product.title}
                    </button>
                  </div>
                </td>
                <td className="px-5 py-4">{product.category}</td>
                <td className="px-5 py-4">${product.price}</td>
                <td className="px-5 py-4">⭐ {product.rating}</td>
                <td className="px-5 py-4">{product.stock}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs" onClick={() => router.push(`/products/${product.id}/edit`)}>
                      Edit
                    </button>
                    <button className="btn-danger text-xs" disabled={deletingId === product.id} onClick={() => onDelete(product.id)}>
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
