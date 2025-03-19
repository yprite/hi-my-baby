import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import {
    ChakraProvider,
    Container,
    Heading,
    Box,
} from '@chakra-ui/react';

import {
    READY_STATUS,
    READY_TIMING,
    getColumnDefinitions
} from '../constants';
import { TableComponent } from '../components/TableComponent';
import { useTableHandlers } from '../hooks/useTableHandlers';

function TablePage() {
    // 샘플 데이터 수정
    const data = React.useMemo(
        () => [
            {
                item: '젖병',
                productBrand: 'Dr.Browns 내추럴플로우 젖병 (닥터브라운)',
                category: '수유용품',
                timing: READY_TIMING.EARLY,
                requiredQty: 3,
                purchasedQty: 2,
                unitPrice: 15000,
                totalCost: 30000,
                readyStatus: READY_STATUS.READY,
                notes: '신생아용 160ml',
                source: '쿠팡',
                image: ''
            },
            {
                item: '속싸개',
                productBrand: '마더스베이비 신생아 속싸개 (마더스베이비)',
                category: '아기 의류',
                timing: READY_TIMING.EARLY,
                requiredQty: 5,
                purchasedQty: 3,
                unitPrice: 12000,
                totalCost: 36000,
                readyStatus: READY_STATUS.READY,
                notes: '신생아용 3개세트',
                source: '마켓컬리',
                image: ''
            },
        ],
        []
    );

    const {
        tableData,
        setTableData,
        handleReadyStatusChange,
        handleReadyTimingChange,
        handleCategoryChange,
        addNewRow
    } = useTableHandlers(data);

    const [filters, setFilters] = React.useState({
        category: [],
        timing: [],
        readyStatus: []
    });

    const filteredData = React.useMemo(() => {
        return tableData.filter(row => {
            const categoryMatch = filters.category.length === 0 || filters.category.includes(row.category);
            const timingMatch = filters.timing.length === 0 || filters.timing.includes(row.timing);
            const readyStatusMatch = filters.readyStatus.length === 0 || filters.readyStatus.includes(row.readyStatus);
            return categoryMatch && timingMatch && readyStatusMatch;
        });
    }, [tableData, filters]);

    const toggleFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value]
        }));
    };

    const columns = React.useMemo(
        () => getColumnDefinitions({
            handleCategoryChange,
            handleReadyTimingChange,
            handleReadyStatusChange,
            setTableData
        }),
        [handleCategoryChange, handleReadyTimingChange, handleReadyStatusChange, setTableData]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <ChakraProvider>
            <Container maxW="100%" py={8}>
                <Heading textAlign="center" mb={8}>출산 준비물 리스트</Heading>
                <Box overflowX="auto" mx={-4}>
                    <TableComponent
                        table={table}
                        filters={filters}
                        toggleFilter={toggleFilter}
                        addNewRow={addNewRow}
                    />
                </Box>
            </Container>
        </ChakraProvider>
    );
}

export default TablePage; 