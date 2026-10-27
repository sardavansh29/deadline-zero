export function LoadingState({ label = 'Opening the ledger…' }) { return <div className="state loading"><span className="spinner"/> {label}</div>; }
export function ErrorMessage({ children }) { return <div className="notice error" role="alert">{children}</div>; }
export function EmptyState({ title, children, action }) { return <div className="state empty"><p className="eyebrow">Your ledger</p><h2>{title}</h2><p>{children}</p>{action}</div>; }
