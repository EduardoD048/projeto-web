import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "carrinho",
  description: "carrinho de compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full flex items-center justify-center pt-28">
      <div></div>
      {children}
    </div>
  );
}
