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
    Image as ChakraImage,
    HStack,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    VStack,
    useDisclosure,
    Text,
    Input,
    Table,
    Thead,
    Tr,
    Tbody,
    Td
} from '@chakra-ui/react';

import {
    READY_STATUS,
    READY_TIMING,
    getColumnDefinitions
} from './constants';
import { READY_STATUS_COLORS } from './constants/readyStatusConstants';
import { READY_TIMING_COLORS } from './constants/readyTimingConstants';
import { TableComponent } from './components/TableComponent';

import { useTableHandlers } from './hooks/useTableHandlers';


function App() {

    // 샘플 데이터 수정
    const data = React.useMemo(
        () => [
            {
                item: '젖병',                    // 항목 (품목)
                productBrand: 'Dr.Browns 내추럴플로우 젖병 (닥터브라운)',  // 제품명(브랜드)
                category: '수유용품',
                timing: READY_TIMING.EARLY,
                requiredQty: 3,
                purchasedQty: 2,
                unitPrice: 15000,
                totalCost: 30000,
                readyStatus: READY_STATUS.READY,  // 초기값을 '준비 전'으로 설정
                notes: '신생아용 160ml',
                source: '쿠팡',
                image: ''  // 빈 문자열로 수정
            },
            {
                item: '속싸개',                  // 항목 (품목)
                productBrand: '마더스베이비 신생아 속싸개 (마더스베이비)',  // 제품명(브랜드)
                category: '아기 의류',
                timing: READY_TIMING.EARLY,
                requiredQty: 5,
                purchasedQty: 3,
                unitPrice: 12000,
                totalCost: 36000,
                readyStatus: READY_STATUS.READY,  // 초기값을 '준비 전'으로 설정
                notes: '신생아용 3개세트',
                source: '마켓컬리',
                image: ''  // 빈 문자열로 수정
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

    // 필터 상태 추가
    const [filters, setFilters] = React.useState({
        category: [],
        timing: [],
        readyStatus: []
    });

    // 필터링된 데이터 계산
    const filteredData = React.useMemo(() => {
        return tableData.filter(row => {
            const categoryMatch = filters.category.length === 0 || filters.category.includes(row.category);
            const timingMatch = filters.timing.length === 0 || filters.timing.includes(row.timing);
            const readyStatusMatch = filters.readyStatus.length === 0 || filters.readyStatus.includes(row.readyStatus);
            return categoryMatch && timingMatch && readyStatusMatch;
        });
    }, [tableData, filters]);

    // 필터 토글 함수
    const toggleFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value]
        }));
    };

    // 헤더 렌더링 함수
    const renderHeader = (text, icon) => (
        <HStack spacing={2}>
            {icon}
            <Text>{text}</Text>
        </HStack>
    );

    // 컬럼 정의 수정
    const columns = React.useMemo(
        () => getColumnDefinitions({
            handleCategoryChange,
            handleReadyTimingChange,
            handleReadyStatusChange,
            setTableData
        }),
        [handleCategoryChange, handleReadyTimingChange, handleReadyStatusChange, setTableData]
    );

    // table 설정 수정
    const table = useReactTable({
        data: filteredData,  // 필터링된 데이터 사용
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

export default App;