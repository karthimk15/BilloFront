import MainLayout from "../layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-brand-light p-6 rounded-card shadow">
        <h1 className="text-3xl font-bold text-brand-primary mb-3">Welcome to Billo!</h1>
        <p className="text-brand-mid">This is your test UI with full layout and logo.</p>
      </div>
    </MainLayout>
  );
}
