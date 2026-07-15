export function Header() {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="font-medium text-sm text-slate-500">
        Tenant: <span className="text-slate-900 font-semibold">Demo Confecção</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm">admin@demo.com</div>
        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
          A
        </div>
      </div>
    </header>
  );
}
