import ProductDetailsClient from "../../../components/products/ProductDetailsClient";

export default function ProductDetailsPage({ params }) {
  return <ProductDetailsClient id={params.id} />;
}
