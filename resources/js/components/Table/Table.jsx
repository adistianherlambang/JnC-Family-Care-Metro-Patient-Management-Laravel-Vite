import React from 'react';
import styles from './Table.module.css';

export function TableBadge({ status, children }) {
  const badgeText = children || status;
  let statusClass = styles.badgeMenunggu;

  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('selesai') || normalized.includes('disetujui') || normalized.includes('hadir')) {
    statusClass = styles.badgeSelesai;
  } else if (normalized.includes('proses') || normalized.includes('dilayani') || normalized.includes('konfirmasi')) {
    statusClass = styles.badgeProses;
  } else if (normalized.includes('batal') || normalized.includes('ditolak')) {
    statusClass = styles.badgeBatal;
  } else if (normalized.includes('aktif')) {
    statusClass = styles.badgeActive;
  }

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {badgeText}
    </span>
  );
}

export function Table({
  title,
  headerAction,
  columns,
  data,
  keyExtractor = (item, idx) => item.id || idx,
  emptyMessage = "Belum ada data tersedia.",
  className = '',
  children,
  ...props
}) {
  const hasDeclarativeData = Array.isArray(columns) && Array.isArray(data);

  return (
    <div className={`${styles.tableContainer} ${className}`} {...props}>
      {(title || headerAction) && (
        <div className={styles.tableHeaderBar}>
          {title && <h3 className={styles.tableTitle}>{title}</h3>}
          {headerAction && <div className={styles.tableHeaderAction}>{headerAction}</div>}
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          {hasDeclarativeData ? (
            <>
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={col.key || idx} style={col.headerStyle}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIdx) => (
                    <tr key={keyExtractor(row, rowIdx)} className={styles.tableTr}>
                      {columns.map((col, colIdx) => (
                        <td key={col.key || colIdx} style={col.cellStyle}>
                          {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className={styles.emptyState}>
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          ) : (
            children
          )}
        </table>
      </div>
    </div>
  );
}

Table.Badge = TableBadge;
Table.ActionCell = ({ children, className = '' }) => (
  <div className={`${styles.actionCell} ${className}`}>{children}</div>
);

export default Table;
