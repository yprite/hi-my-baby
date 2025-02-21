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

import { CATEGORY_COLORS, CATEGORIES } from './context/CategoryConstants';
import { READY_STATUS, READY_STATUS_COLORS } from './context/ReadyStatusConstants';
import { READY_TIMING, READY_TIMING_COLORS } from './context/ReadyTimingConstants';
import { getNextReadyStatus } from './utils/ReadystatusUtils';
import { getNextTimingStatus } from './utils/TimingStatusUtils';
import { TableComponent } from './components/TableComponent';
import FilterComponent from './components/FilterComponent';

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
                image: 'url_to_image'
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
                image: 'url_to_image'
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

    // 이미지 업로드 핸들러
    const handleImageUpload = (rowIndex, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTableData(prev => prev.map((row, index) =>
                    index === rowIndex ? { ...row, image: reader.result } : row
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    // 컬럼 정의 수정
    const columns = React.useMemo(
        () => [
            {
                header: ({ column }) => renderHeader('항목', <LucideIcon icon={ShoppingBasket} />),
                accessorKey: 'item',
                cell: info => (
                    <EditableCell
                        type="item"
                        value={info.getValue()}
                        options={[
                            '젖병', '속싸개', '손수건', '기저귀', '물티슈',
                            '수유등', '아기침대', '카시트', '유모차', '젖병소독기',
                            '젖병건조대', '아기욕조', '체온계', '마사지오일'
                        ]}
                        onSubmit={(newValue) => {
                            // 여기에 데이터 업데이트 로직 추가
                            setTableData(prev => prev.map((row, index) =>
                                index === info.row.index ? { ...row, item: newValue } : row
                            ));
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('제품명/브랜드', <LucideIcon icon={Star} />),
                accessorKey: 'productBrand',
                cell: info => (
                    <EditableCell
                        type="productBrand"
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('분류', <LucideIcon icon={Settings} />),
                accessorKey: 'category',
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
                header: ({ column }) => renderHeader('준비시기', <LucideIcon icon={Calendar} />),
                accessorKey: 'timing',
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
                header: ({ column }) => renderHeader('필요개수', <LucideIcon icon={PlusSquare} />),
                accessorKey: 'requiredQty',
                cell: info => (
                    <EditableCell
                        type="requiredQty"
                        value={info.getValue().toString()}
                        onSubmit={(newValue) => {
                            // 숫자만 허용
                            if (!/^\d+$/.test(newValue)) {
                                return;
                            }
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('구매개수', <LucideIcon icon={Repeat} />),
                accessorKey: 'purchasedQty',
                cell: info => (
                    <EditableCell
                        type="purchasedQty"
                        value={info.getValue().toString()}
                        onSubmit={(newValue) => {
                            // 숫자만 허용
                            const numericValue = parseInt(newValue);
                            if (!isNaN(numericValue)) {
                                // 구매개수가 변경되면 비용도 자동으로 업데이트
                                setTableData(prev => prev.map((row, index) =>
                                    index === info.row.index
                                        ? {
                                            ...row,
                                            purchasedQty: numericValue,
                                            totalCost: row.unitPrice * numericValue
                                        }
                                        : row
                                ));
                            }
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('단가', <LucideIcon icon={Calculator} />),
                accessorKey: 'unitPrice',
                cell: info => (
                    <EditableCell
                        type="unitPrice"
                        value={new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(info.getValue())}
                        onSubmit={(newValue) => {
                            // 숫자만 허용하고 쉼표 제거
                            const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''));
                            if (!isNaN(numericValue)) {
                                // 단가가 변경되면 비용도 자동으로 업데이트
                                setTableData(prev => prev.map((row, index) =>
                                    index === info.row.index
                                        ? {
                                            ...row,
                                            unitPrice: numericValue,
                                            totalCost: numericValue * row.purchasedQty
                                        }
                                        : row
                                ));
                            }
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('비용', <LucideIcon icon={DollarSign} />),
                accessorKey: 'totalCost',
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
                header: ({ column }) => renderHeader('준비완료', <LucideIcon icon={CheckCircle} />),
                accessorKey: 'readyStatus',
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
                header: ({ column }) => renderHeader('내용', <LucideIcon icon={HelpCircle} />),
                accessorKey: 'notes',
                cell: info => (
                    <EditableCell
                        type="notes"
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('준비/구입경로', <LucideIcon icon={Store} />),
                accessorKey: 'source',
                cell: info => (
                    <EditableCell
                        type="source"
                        value={info.getValue()}
                        onSubmit={(newValue) => {
                        }}
                    />
                )
            },
            {
                header: ({ column }) => renderHeader('참고사진', <LucideIcon icon={LucideImage} />),
                accessorKey: 'image',
                cell: info => (
                    <Box position="relative" w="50px" h="50px">
                        <Input
                            type="file"
                            accept="image/*"
                            position="absolute"
                            top="0"
                            left="0"
                            opacity="0"
                            w="100%"
                            h="100%"
                            cursor="pointer"
                            onChange={(e) => handleImageUpload(info.row.index, e.target.files[0])}
                        />
                        {info.getValue() ? (
                            <ChakraImage
                                src={info.getValue()}
                                alt="제품 이미지"
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                        ) : (
                            <Button
                                w="100%"
                                h="100%"
                                variant="outline"
                                colorScheme="gray"
                                fontSize="sm"
                                p={0}
                            >
                                <LucideIcon icon={LucideImage} size={16} />
                            </Button>
                        )}
                    </Box>
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