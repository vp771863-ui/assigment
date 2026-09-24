import ProductForm from "../../../../components/products/ProductForm";

export default function EditProductPage({ params }) {
  return <ProductForm mode="edit" id={params.id} />;
}
