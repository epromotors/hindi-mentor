export const metadata = {
  title: "Hindi Mentor",
  description: "B.A. & M.A. Students के लिए AI Hindi Teacher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}
