export const formatDate = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
export const inputDate = (value) => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
export const relativeDue = (value) => { const hours = Math.round((new Date(value) - new Date()) / 3600000); if (hours < 0) return `${Math.abs(hours)}h overdue`; if (hours < 24) return `due in ${Math.max(1, hours)}h`; const days = Math.ceil(hours / 24); return `due in ${days}d`; };
