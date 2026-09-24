import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "DummyJSON Product Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
