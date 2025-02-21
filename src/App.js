import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
} from '@tanstack/react-table';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    ChakraProvider,
    Container,
    Heading,
    Box,
    Image,
    Tag,
    HStack,
    Icon,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    useEditableControls,
    IconButton,
    ButtonGroup,
    Flex,
    Select,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

// 준비 상태 정의
const READY_STATUS = {
    READY: '준비 전',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료'
};

// 준비 상태별 색상 정의
const READY_STATUS_COLORS = {
    [READY_STATUS.READY]: 'gray',
    [READY_STATUS.IN_PROGRESS]: 'blue',
    [READY_STATUS.COMPLETED]: 'green'
};

// 준비 시기 정의
const READY_TIMING = {
    EARLY: '산전',
    LATE: '산후'
};

// 준비 시기별 색상 정의
const READY_TIMING_COLORS = {
    [READY_TIMING.EARLY]: '#ce694c',
    [READY_TIMING.LATE]: '#4cb1ce'
};

// 다음 상태로 변경하는 함수
const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
        case READY_STATUS.READY:
            return READY_STATUS.IN_PROGRESS;
        case READY_STATUS.IN_PROGRESS:
            return READY_STATUS.COMPLETED;
        case READY_STATUS.COMPLETED:
            return READY_STATUS.READY;
        default:
            return READY_STATUS.READY;
    }
};

// 다음 시기로 변경하는 함수
const getNextTiming = (currentTiming) => {
    switch (currentTiming) {
        case READY_TIMING.EARLY:
            return READY_TIMING.LATE;
        case READY_TIMING.LATE:
            return READY_TIMING.EARLY;
        default:
            return READY_TIMING.EARLY;
    }
};

function App() {
    // 분류별 색상 매핑
    const categoryColors = {
        '침구류': 'blue',
        '아기 의류': 'green',
        '수유용품': 'purple',
        '아기 피부용품': 'pink',
        '아기 위생용품': 'teal',
        '아기 세제': 'cyan',
        '기저귀': 'orange',
        '외출용품': 'yellow',
        '놀이용품': 'red',
        '가전/가구': 'gray',
        '산모용품': 'purple',
        '상비약': 'red',
        '기타': 'gray'
    };

    // 분류 옵션
    const categories = [
        '침구류', '아기 의류', '수유용품', '기타', '아기 피부용품',
        '아기 위생용품', '아기 세제', '기저귀', '외출용품', '놀이용품',
        '가전/가구', '산모용품', '상비약'
    ];

    // 샘플 데이터 수정
    const data = React.useMemo(
        () => [
            {
                item: '젖병',                    // 항목 (품목)
                productBrand: 'Dr.Browns 내추럴플로우 젖병 (닥터브라운)',  // 제품명(브랜드)
                category: '수유용품',
                timing: '산전',
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
                timing: '산전',
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
        const nextStatus = getNextStatus(currentStatus);
        setTableData(prev => prev.map((row, index) =>
            index === rowIndex ? { ...row, readyStatus: nextStatus } : row
        ));
    };

    // 준비 상태 변경 함수
    const handleReadyTimingChange = (rowIndex, currentTiming) => {
        const nextTiming = getNextTiming(currentTiming);
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

    // 컬럼 정의 수정
    const columns = React.useMemo(
        () => [
            {
                header: '항목',
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
                header: '제품명/브랜드',
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
                header: '분류',
                accessorKey: 'category',
                cell: info => {
                    const { isOpen, onOpen, onClose } = useDisclosure();
                    return (
                        <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
                            <PopoverTrigger>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    colorScheme={info.getValue() ? categoryColors[info.getValue()] : 'gray'}
                                    w="100%"
                                    onClick={onOpen}
                                >
                                    {info.getValue() || '선택하세요'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent w="auto">
                                <PopoverBody p={2}>
                                    <VStack align="stretch" spacing={1}>
                                        {categories.map(category => (
                                            <Button
                                                key={category}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme={categoryColors[category]}
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
                header: '준비시기',
                accessorKey: 'timing',
                cell: info => (
                    <Button
                        size="sm"
                        variant="solid"
                        // colorScheme={READY_TIMING_COLORS[info.getValue()]}
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
                header: '필요개수',
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
                header: '구매개수',
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
                header: '단가',
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
                header: '비용',
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
                header: '준비완료',
                accessorKey: 'readyStatus',
                cell: info => (
                    <Button
                        size="sm"
                        variant="solid"
                        colorScheme={READY_STATUS_COLORS[info.getValue()]}
                        onClick={() => handleReadyStatusChange(info.row.index, info.getValue())}
                        w="100px"
                        h="30px"
                        fontSize="sm"
                    >
                        {info.getValue()}
                    </Button>
                ),
            },
            {
                header: '내용',
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
                header: '준비/구입경로',
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
                header: '참고사진',
                accessorKey: 'image',
                cell: info => info.getValue() ?
                    <Image
                        src={info.getValue()}
                        alt="제품 이미지"
                        boxSize="50px"
                        objectFit="cover"
                    /> :
                    '없음'
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

    return (
        <ChakraProvider>
            <Container maxW="100%" py={8}>
                <Heading textAlign="center" mb={8}>출산 준비물 리스트</Heading>
                <Box overflowX="auto" mx={-4}>
                    <Table variant="simple" size="sm" layout="fixed" w="auto" minW="100%">
                        <Thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        // 분류, 준비시기, 준비완료 컬럼에 대해서만 필터 기능 추가
                                        if (['분류', '준비시기', '준비완료'].includes(header.column.columnDef.header)) {
                                            const { isOpen, onOpen, onClose } = useDisclosure();
                                            return (
                                                <Th key={header.id} p={2}>
                                                    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
                                                        <PopoverTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={onOpen}
                                                                rightIcon={filters[header.column.id].length ? <CheckIcon /> : undefined}
                                                            >
                                                                {header.column.columnDef.header}
                                                                {filters[header.column.id].length ? ` (${filters[header.column.id].length})` : ''}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent w="auto">
                                                            <PopoverBody p={2}>
                                                                <VStack align="stretch" spacing={1}>
                                                                    {header.column.columnDef.header === '분류' && 
                                                                        categories.map(category => (
                                                                            <Button
                                                                                key={category}
                                                                                size="sm"
                                                                                variant={filters.category.includes(category) ? "solid" : "ghost"}
                                                                                colorScheme={categoryColors[category]}
                                                                                onClick={() => toggleFilter('category', category)}
                                                                                justifyContent="flex-start"
                                                                            >
                                                                                {category}
                                                                            </Button>
                                                                        ))
                                                                    }
                                                                    {header.column.columnDef.header === '준비시기' && 
                                                                        Object.values(READY_TIMING).map(timing => (
                                                                            <Button
                                                                                key={timing}
                                                                                size="sm"
                                                                                variant={filters.timing.includes(timing) ? "solid" : "ghost"}
                                                                                style={{
                                                                                    backgroundColor: filters.timing.includes(timing) 
                                                                                        ? READY_TIMING_COLORS[timing] 
                                                                                        : 'transparent'
                                                                                }}
                                                                                onClick={() => toggleFilter('timing', timing)}
                                                                                justifyContent="flex-start"
                                                                            >
                                                                                {timing}
                                                                            </Button>
                                                                        ))
                                                                    }
                                                                    {header.column.columnDef.header === '준비완료' && 
                                                                        Object.values(READY_STATUS).map(status => (
                                                                            <Button
                                                                                key={status}
                                                                                size="sm"
                                                                                variant={filters.readyStatus.includes(status) ? "solid" : "ghost"}
                                                                                colorScheme={READY_STATUS_COLORS[status]}
                                                                                onClick={() => toggleFilter('readyStatus', status)}
                                                                                justifyContent="flex-start"
                                                                            >
                                                                                {status}
                                                                            </Button>
                                                                        ))
                                                                    }
                                                                </VStack>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>
                                                </Th>
                                            );
                                        }

                                        // 다른 컬럼들은 기존 스타일 유지
                                        return (
                                            <Th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                cursor="pointer"
                                                whiteSpace="normal"
                                                p={2}
                                                minW={{
                                                    항목: "100px",
                                                    "제품명/브랜드": "250px",
                                                    분류: "100px",
                                                    준비시기: "100px",
                                                    필요개수: "80px",
                                                    구매개수: "80px",
                                                    단가: "100px",
                                                    비용: "100px",
                                                    준비완료: "80px",
                                                    내용: "200px",
                                                    "준비/구입경로": "120px",
                                                    참고사진: "80px"
                                                }[header.column.columnDef.header]}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted()] ?? null}
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody>
                            {table.getRowModel().rows.map(row => (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <Td
                                            key={cell.id}
                                            whiteSpace="normal"
                                            p={2}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Container>
        </ChakraProvider>
    );
}

// EditableCell 컴포넌트를 수정하여 Select 컴포넌트로 변경
const EditableCell = ({ value, type, onSubmit, options }) => {
    const [isEditing, setIsEditing] = React.useState(false);

    // 향후 사용할 수 있어서 남겨놓음
    // if (options) {
    //     return (
    //         <Popover
    //             isOpen={isEditing}
    //             onClose={() => setIsEditing(false)}
    //             placement="bottom-start"
    //         >
    //             <PopoverTrigger>
    //                 <Button
    //                     size="sm"
    //                     variant="ghost"
    //                     onClick={() => setIsEditing(true)}
    //                     w="100%"
    //                     justifyContent="flex-start"
    //                     _hover={{
    //                         bg: "gray.100"
    //                     }}
    //                 >
    //                     {value || '선택하세요'}
    //                 </Button>
    //             </PopoverTrigger>
    //             <PopoverContent w="auto">
    //                 <PopoverBody p={2}>
    //                     <VStack align="stretch" spacing={1}>
    //                         {options.map(option => (
    //                             <Button
    //                                 key={option}
    //                                 size="sm"
    //                                 variant="ghost"
    //                                 onClick={() => {
    //                                     onSubmit(option);
    //                                     setIsEditing(false);
    //                                 }}
    //                                 justifyContent="flex-start"
    //                                 w="100%"
    //                             >
    //                                 {option}
    //                             </Button>
    //                         ))}
    //                     </VStack>
    //                 </PopoverBody>
    //             </PopoverContent>
    //         </Popover>
    //     );
    // }

    const getColumnWidth = (type) => {
        switch(type) {
            case "category": return "100px";
            case "timing": return "100px";
            case "requiredQty": return "80px";
            case "purchasedQty": return "80px";
            case "unitPrice": return "100px";
            case "totalCost": return "100px";
            case "readyStatus": return "80px";
            case "content": return "200px";
            case "source": return "120px";
            case "photo": return "80px";
            default: return "100%";
        }
    };

    if (type == "requiredQty" || type == "purchasedQty" || type == "unitPrice" || type == "totalCost") {
        return (
            <Editable
                defaultValue={value}
                isPreviewFocusable={true}
                submitOnBlur={true}
                onSubmit={onSubmit}
            >
                <EditablePreview
                    w={getColumnWidth(type)}
                    px={2}
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer"
                    }}
                />
                <EditableInput px={2} w={getColumnWidth(type)}/>
            </Editable>
        );
    }

    return (
        <Editable
            defaultValue={value}
            isPreviewFocusable={true}
            submitOnBlur={true}
            onSubmit={onSubmit}
        >
            <EditablePreview
                w={getColumnWidth(type)}
                px={2}
                _hover={{
                    background: "gray.100",
                    cursor: "pointer"
                }}
            />
            <EditableInput px={2} w={getColumnWidth(type)} />
        </Editable>
    );
};

export default App;