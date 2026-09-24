 "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedLayout from "../layout/ProtectedLayout";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { getCategories, getProducts, deleteProduct } from "../../api/products";

const DEFAULT_PAGE_SIZE = 10;
const ALLOWED_SIZES = [10, 20, 50];
const ALLOWED_SORTS = ["", "price", "rating", "title"];

function validInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function validSize(value) {
  const n = Number.parseInt(value, 10);
  return ALLOWED_SIZES.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

function normalizePage(page, total, size) {
  const max = Math.max(1, Math.ceil(total / size));
  return Math.min(Math.max(1, page), max);
}

export default function ProductsClient() {
  return (
    <ProtectedLayout>
      <ProductsContent />
    </ProtectedLayout>
  );
}

function ProductsContent() {
  const router = useRouter();
  const params = useSearchParams();

  const rawPage = validInt(params.get("page"), 1);
  const pageSize = validSize(params.get("size"));
  const urlSearch = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = ALLOWED_SORTS.includes(params.get("sort")) ? params.get("sort") : "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (searchInput.trim() === urlSearch.trim()) return;

      if (searchInput.trim()) next.set("search", searchInput.trim());
      else next.delete("search");

      next.set("page", "1");
      router.replace(`/products?${next.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, params, router]);

  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError("");
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setCategoryError(err.message);
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const data = await getProducts({
        limit: pageSize,
        skip: (rawPage - 1) * pageSize,
        search: urlSearch,
        signal: controller.signal,
      });

      if (requestId !== requestIdRef.current) return;

      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError(err.message || "Could not load products.");
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [pageSize, rawPage, urlSearch]);

  useEffect(() => {
    fetchProducts();
    return () => controllerRef.current?.abort();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const displayedProducts = useMemo(() => {
    let list = [...products];

    if (category) {
      list = list.filter((product) => product.category === category);
    }

    if (sort === "price") list.sort((a, b) => a.price - b.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [products, category, sort]);

  const page = normalizePage(rawPage, total, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  useEffect(() => {
    if (rawPage !== page) {
      updateParams({ page: String(page) }, true);
    }
  }, [rawPage, page]);

  function updateParams(changes, replace = false) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, value);
    });

    const query = next.toString();
    const url = query ? `/products?${query}` : "/products";
    replace ? router.replace(url) : router.push(url);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  function setCategory(value) {
    updateParams({ category: value, page: "1" });
  }

  function setSort(value) {
    updateParams({ sort: value, page: "1" });
  }

  function setSize(value) {
    updateParams({ size: value, page: "1" });
  }

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your product catalog.
          </p>
        </div>
        <button className="btn-primary" onClick={() => router.push("/products/new")}>
          + Add Product
        </button>
      </div>

      <div className="mb-5 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-500">Search</label>
          <input
            className="input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={categoryLoading}
          >
            <option value="">All categories</option>
            {categories.map((item) => {
              const value = typeof item === "string" ? item : item.slug;
              const label = typeof item === "string" ? item : item.name;
              return <option key={value} value={value}>{label}</option>;
            })}
          </select>
          {categoryError && <p className="mt-1 text-xs text-red-600">{categoryError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Sort</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchProducts} />}

      {!error && loading ? (
        <Loader />
      ) : !error && displayedProducts.length === 0 ? (
        <EmptyState message={urlSearch || category ? "No products match your filters." : "No products found."} />
      ) : (
        <>
          <ProductTable products={displayedProducts} onDelete={handleDelete} deletingId={deletingId} />
          <ProductCard products={displayedProducts} onDelete={handleDelete} deletingId={deletingId} />
        </>
      )}

      <div className="mt-5 flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {start}–{end} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border px-3 py-2 text-sm"
            value={pageSize}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={(nextPage) => updateParams({ page: String(nextPage) })}
          />
        </div>
      </div>

      {category && (
        <p className="mt-3 text-xs text-slate-400">
          Category filtering is applied to the current API page because DummyJSON does not
          combine its search and category endpoints. Search uses /products/search?q= and
          category filtering is applied client-side to the returned page.
        </p>
      )}
    </section>
  );
}
