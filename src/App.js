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
import { flexRender } from '@tanstack/react-table';

import {
    Info,
    Star,
    Settings,
    Calendar,
    PlusSquare,
    Repeat,
    Calculator,  // 단가용
    DollarSign,  // 비용용
    CheckCircle,
    HelpCircle,
    Store,       // 구입경로용
    Image as LucideImage,
    ShoppingBasket,  // Lucide의 Image 아이콘
} from 'lucide-react';

import { LucideIcon } from './components/LucideIcon';
import { EditableCell } from './components/EditableCell';
import { ImageUploader } from './components/ImageUploader';

import { CATEGORY_COLORS, CATEGORIES } from './constants/categoryConstants';
import { READY_STATUS, READY_STATUS_COLORS } from './constants/readyStatusConstants';
import { READY_TIMING, READY_TIMING_COLORS } from './constants/readyTimingConstants';
import { getNextReadyStatus } from './utils/ReadystatusUtils';
import { getNextTimingStatus } from './utils/TimingStatusUtils';
import { TableComponent } from './components/TableComponent';
import { CELL_TYPES, CELL_TYPES_KOREAN } from './constants/cellTypes';


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

    // 데이터 상태 관리 추가
    const [tableData, setTableData] = React.useState(data);

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

    // 준비 상태 변경 함수
    const handleReadyStatusChange = (rowIndex, currentStatus) => {
        const nextStatus = getNextReadyStatus(currentStatus);
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, readyStatus: nextStatus } : row
        ));
    };

    // 준비 상태 변경 함수
    const handleReadyTimingChange = (rowIndex, currentTiming) => {
        const nextTiming = getNextTimingStatus(currentTiming);
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, timing: nextTiming } : row
        ));
    };

    // 카테고리 선택 핸들러 추가
    const handleCategoryChange = (rowIndex, newCategory) => {
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, category: newCategory } : row
        ));
    };

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
        () => [
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.ITEM, <LucideIcon icon={ShoppingBasket} />),
                accessorKey: CELL_TYPES.ITEM,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.ITEM}
                        value={info.getValue()}
                        options={CATEGORIES}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, item: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.PRODUCT_BRAND, <LucideIcon icon={Star} />),
                accessorKey: CELL_TYPES.PRODUCT_BRAND,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.PRODUCT_BRAND}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, productBrand: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.CATEGORY, <LucideIcon icon={Settings} />),
                accessorKey: CELL_TYPES.CATEGORY,
                cell: info => {
                    const { isOpen, onOpen, onClose } = useDisclosure();
                    return (
                        <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
                            <PopoverTrigger>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    colorScheme={info.getValue() ? CATEGORY_COLORS[info.getValue()] : 'gray'}
                                    w="100%"
                                    onClick={onOpen}
                                >
                                    {info.getValue() || '선택하세요'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent w="auto">
                                <PopoverBody p={2}>
                                    <VStack align="stretch" spacing={1}>
                                        {CATEGORIES.map(category => (
                                            <Button
                                                key={category}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme={CATEGORY_COLORS[category]}
                                                onClick={() => {
                                                    handleCategoryChange(info.row.index, category);
                                                    onClose(); // Popover를 닫습니다
                                                }}
                                                justifyContent="flex-start"
                                                w="100%"
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    );
                }
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.TIMING, <LucideIcon icon={Calendar} />),
                accessorKey: CELL_TYPES.TIMING,
                cell: info =>
                (
                    <Button
                        size="sm"
                        variant="solid"
                        colorScheme={'red'}
                        style={{ backgroundColor: READY_TIMING_COLORS[info.getValue()] }}
                        onClick={() => handleReadyTimingChange(info.row.index, info.getValue())}
                        w="100px"
                        h="30px"
                        fontSize="sm"
                    >
                        {info.getValue()}
                    </Button>
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.REQUIRED_QTY, <LucideIcon icon={PlusSquare} />),
                accessorKey: CELL_TYPES.REQUIRED_QTY,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.REQUIRED_QTY}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, requiredQty: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.PURCHASED_QTY, <LucideIcon icon={Repeat} />),
                accessorKey: CELL_TYPES.PURCHASED_QTY,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.PURCHASED_QTY}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? {
                                    ...row,
                                    purchasedQty: newValue,
                                    totalCost: row.unitPrice * newValue
                                } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.UNIT_PRICE, <LucideIcon icon={Calculator} />),
                accessorKey: CELL_TYPES.UNIT_PRICE,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.UNIT_PRICE}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? {
                                    ...row,
                                    unitPrice: newValue,
                                    totalCost: newValue * row.purchasedQty
                                } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.TOTAL_COST, <LucideIcon icon={DollarSign} />),
                accessorKey: CELL_TYPES.TOTAL_COST,
                cell: info => (
                    <Box px={2}>
                        {new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(info.getValue())}
                    </Box>
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.READY_STATUS, <LucideIcon icon={CheckCircle} />),
                accessorKey: CELL_TYPES.READY_STATUS,
                cell: info => (
                    <Button
                        size="sm"
                        variant="solid"
                        colorScheme={READY_STATUS_COLORS[info.getValue()]}
                        style={{ backgroundColor: READY_STATUS_COLORS[info.getValue()] }}
                        onClick={() => handleReadyStatusChange(info.row.index, info.getValue())}
                        w="100px"
                        h="30px"
                        fontSize="sm"
                    >
                        {info.getValue()}
                    </Button>
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.NOTES, <LucideIcon icon={HelpCircle} />),
                accessorKey: CELL_TYPES.NOTES,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.NOTES}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, notes: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.SOURCE, <LucideIcon icon={Store} />),
                accessorKey: CELL_TYPES.SOURCE,
                cell: info => (
                    <EditableCell
                        type={CELL_TYPES.SOURCE}
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, source: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader(CELL_TYPES_KOREAN.IMAGE, <LucideIcon icon={LucideImage} />),
                accessorKey: CELL_TYPES.IMAGE,
                cell: info => (
                    <ImageUploader
                        rowIndex={info.row.index}
                        value={info.getValue()}
                        onImageUpload={(rowIndex, imageData) => {
                            setTableData(prev => prev.map((row, index) =>
                                index === rowIndex ? { ...row, image: imageData } : row
                            ));
                        }}
                    />
                )
            },
        ],
        [filters, toggleFilter]
    );

    // table 설정 수정
    const table = useReactTable({
        data: filteredData,  // 필터링된 데이터 사용
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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