import "./globals.css";

export const metadata = {
  title: "Aurastart",
  description: "A Minimalist & Efficient Personal Start Page",
  icons: {
    icon: '/logo.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}