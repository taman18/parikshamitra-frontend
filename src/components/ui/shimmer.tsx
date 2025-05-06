import React from "react";
import classNames from "classnames";

interface TableShimmerProps {
  col: number;
  row?: number;
}

const TableShimmer: React.FC<TableShimmerProps> = ({ col, row = 5 }) => {
  return (
    <>
      {Array.from({ length: row }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: col }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div
                className={classNames(
                  "h-4 bg-gray-300 rounded",
                  colIndex === 0 ? "w-2/5" : "w-4/5"
                )}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableShimmer;
