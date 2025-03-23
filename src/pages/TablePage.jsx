import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import {
    Container,
    Heading,
    Box,
    useBreakpointValue,
    Show,
    Hide,
    Card,
    CardBody,
    Stack,
    Text,
    Badge,
    VStack,
    HStack,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    Select,
    FormControl,
    FormLabel,
    Button,
    DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import {
    READY_STATUS,
    READY_TIMING,
    getColumnDefinitions
} from '../constants';
import { TableComponent } from '../components/TableComponent';
import { useTableHandlers } from '../hooks/useTableHandlers';

// FilterDrawer를 별도의 메모이제이션된 컴포넌트로 분리
const FilterDrawer = React.memo(({ 
    isOpen, 
    onClose, 
    filters, 
    handleFilterChange 
}) => {
    const categoryOptions = ['수유용품', '아기 의류', '위생용품', '침구류'];
    const timingOptions = Object.values(READY_TIMING);
    const statusOptions = Object.values(READY_STATUS);

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton 
                    size="lg"
                    color="gray.500"
                    _hover={{
                        color: "gray.800"
                    }}
                />
                <DrawerHeader 
                    borderBottomWidth="1px" 
                    pb={4}
                    pt={6}
                >
                    필터 설정
                </DrawerHeader>
                <DrawerBody>
                    <VStack spacing={4} mt={4}>
                        <FormControl>
                            <FormLabel>분류</FormLabel>
                            <Select 
                                placeholder="분류 선택"
                                value={filters.category[0] || ''}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>준비시기</FormLabel>
                            <Select 
                                placeholder="준비시기 선택"
                                value={filters.timing[0] || ''}
                                onChange={(e) => handleFilterChange('timing', e.target.value)}
                            >
                                {timingOptions.map((timing) => (
                                    <option key={timing} value={timing}>
                                        {timing}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>준비상태</FormLabel>
                            <Select 
                                placeholder="준비상태 선택"
                                value={filters.readyStatus[0] || ''}
                                onChange={(e) => handleFilterChange('readyStatus', e.target.value)}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <Button 
                            w="100%" 
                            colorScheme="blue" 
                            onClick={() => {
                                handleFilterChange('reset');
                            }}
                        >
                            필터 초기화
                        </Button>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
});

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

    const handleFilterChange = React.useCallback((type, value) => {
        if (type === 'reset') {
            setFilters({
                category: [],
                timing: [],
                readyStatus: []
            });
        } else {
            setFilters(prev => ({
                ...prev,
                [type]: value ? [value] : []
            }));
        }
    }, []);

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

    // 필터 드로어 상태 관리
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 모바일 카드 뷰를 위한 컴포넌트
    const MobileCardView = ({ data }) => {
        return (
            <VStack spacing={4} w="100%">
                {data.map((row, idx) => (
                    <Card key={idx} w="100%">
                        <CardBody>
                            <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between">
                                    <Heading size="md">{row.item}</Heading>
                                    <Badge colorScheme={row.readyStatus === READY_STATUS.READY ? 'green' : 'red'}>
                                        {row.readyStatus}
                                    </Badge>
                                </HStack>
                                <Text color="gray.600">{row.productBrand}</Text>
                                <HStack justify="space-between">
                                    <Text>수량: {row.purchasedQty}/{row.requiredQty}</Text>
                                    <Badge colorScheme="blue">{row.timing}</Badge>
                                </HStack>
                                <Text>카테고리: {row.category}</Text>
                                <Text>구매처: {row.source}</Text>
                                <Text>가격: {row.unitPrice.toLocaleString()}원</Text>
                                {row.notes && <Text color="gray.500">메모: {row.notes}</Text>}
                            </VStack>
                        </CardBody>
                    </Card>
                ))}
            </VStack>
        );
    };

    return (
        <Container maxW="100%" py={8}>
            <HStack justify="space-between" mb={8}>
                <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>
                    출산 준비물 리스트
                </Heading>
                <Show below="md">
                    <IconButton
                        icon={<HamburgerIcon />}
                        onClick={onOpen}
                        aria-label="필터"
                    />
                </Show>
            </HStack>

            {/* 데스크톱 뷰 */}
            <Hide below="md">
                <Box overflowX="auto" mx={-4}>
                    <TableComponent
                        table={table}
                        filters={filters}
                        toggleFilter={handleFilterChange}
                        addNewRow={addNewRow}
                    />
                </Box>
            </Hide>

            {/* 모바일 뷰 */}
            <Show below="md">
                <MobileCardView data={filteredData} />
            </Show>

            {/* 모바일 필터 드로어 */}
            <FilterDrawer 
                isOpen={isOpen}
                onClose={onClose}
                filters={filters}
                handleFilterChange={handleFilterChange}
            />
        </Container>
    );
}

export default TablePage; 