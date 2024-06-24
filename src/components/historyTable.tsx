interface HistoryProps {
  index: number;
  gameState: any;
  children: React.ReactNode;
}

export default function HistoryTable({ gameHistory }: HistoryProps) {
  const getTableRows = () => {
    const rows = [];
    let serial = 1;
    for (let i = 0; i < gameHistory.length; i++) {
      if (i + 1 <= gameHistory.length) {
        rows.push(
          <tr key={i}>
            <td className="border border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {serial++}
            </td>
            <td className="border border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {gameHistory[i]?.movedLocation}
            </td>
            <td className="border border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400">
              {gameHistory[i + 1]?.movedLocation}
            </td>
          </tr>
        );
        i++;
      } else {
        rows.push(
          <tr>
            <td className="border border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {serial++}
            </td>
            <td className="border border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {gameHistory[i]?.movedLocation}
            </td>
          </tr>
        );
      }
    }

    return rows;
  };

  return (
    <table className="border-collapse table-auto text-sm">
      <caption className="text-slate-500 dark:text-slate-400 pb-4 text-xs caption-top">
        Moves History
      </caption>
      <thead>
        <tr>
          <th className="border dark:border-slate-600 font-medium p-4 pl-8 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left">
            Serial
          </th>
          <th className="border dark:border-slate-600 font-medium p-4 pl-8 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left">
            Wrestler
          </th>
          <th className="border dark:border-slate-600 font-medium p-4 pr-8 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left">
            Signature Move(s)
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">{getTableRows()}</tbody>
    </table>
  );
}
