import { useState } from 'react';
import { getNextReadyStatus } from '../utils/readyStatusUtils';
import { getNextTimingStatus } from '../utils/timingStatusUtils';
import { READY_STATUS } from '../constants';

export const useTableHandlers = (initialData) => {
    const [tableData, setTableData] = useState(initialData);

    // 준비 상태 변경 함수
    const handleReadyStatusChange = (rowIndex, currentStatus) => {
        const nextStatus = getNextReadyStatus(currentStatus);
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, readyStatus: nextStatus } : row
        ));
    };

    // 준비시기 변경 함수
    const handleReadyTimingChange = (rowIndex, currentTiming) => {
        const nextTiming = getNextTimingStatus(currentTiming);
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, timing: nextTiming } : row
        ));
    };

    // 카테고리 선택 핸들러
    const handleCategoryChange = (rowIndex, newCategory) => {
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, category: newCategory } : row
        ));
    };

    // 새 행 추가 함수
    const addNewRow = () => {
        const newRow = {
            item: '',
            productBrand: '',
            category: '',
            timing: '',
            requiredQty: 0,
            purchasedQty: 0,
            unitPrice: 0,
            totalCost: 0,
            readyStatus: READY_STATUS.READY,
            notes: '',
            source: '',
            image: ''
        };
        setTableData(prev => [...prev, newRow]);
    };

    return {
        tableData,
        setTableData,
        handleReadyStatusChange,
        handleReadyTimingChange,
        handleCategoryChange,
        addNewRow
    };
};