export const useTableHandlers = (tableData, setTableData) => {
    const handleReadyStatusChange = (rowIndex, currentStatus) => {
        // ...
    };

    const handleReadyTimingChange = (rowIndex, currentTiming) => {
        // ...
    };

    // ...

    return {
        handleReadyStatusChange,
        handleReadyTimingChange,
        handleCategoryChange,
        // ...
    };
};