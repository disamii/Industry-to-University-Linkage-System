type EmptyProps = {
  resourceName?: string;
  colCount?: number;
};

function EmptyState({ resourceName, colCount }: EmptyProps) {
  // When used inside a table (colCount is provided
  if (colCount) {
    return (
      <tbody>
        <tr>
          <td
            className="p-4 font-medium text-red-400 text-lg"
            colSpan={colCount}
          >
            <span className="flex justify-center items-center">
              No data could be found 🧐
            </span>
          </td>
        </tr>
      </tbody>
    );
  }

  // When not inside a table (no colCount provided)
  return (
    <div className="flex justify-center items-center bg-red-100 p-4 rounded-md font-medium text-red-500 text-xl">
      No {resourceName} could be found 🧐
    </div>
  );
}

export default EmptyState;
