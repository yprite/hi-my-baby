import React from 'react';
import {
    flexRender,
} from '@tanstack/react-table';
import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';

import {
    CATEGORY_COLORS,
    CATEGORIES,
} from '../context/CategoryConstants';
import {
    READY_STATUS,
    READY_STATUS_COLORS,
} from '../context/ReadyStatusConstants';
import {
    READY_TIMING,
    READY_TIMING_COLORS,
} from '../context/ReadyTimingConstants';
import { getChakraColorScheme } from '../utils/colorUtils';
import { LucideIcon } from './LucideIcon';
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

import {
    CheckIcon,
    CalendarIcon,
    InfoIcon,
    TimeIcon,
    RepeatIcon,
    StarIcon,
    AttachmentIcon,
    ViewIcon,
    EditIcon,
    PlusSquareIcon,
    SettingsIcon,
    QuestionIcon,
    PhoneIcon
} from '@chakra-ui/icons';




export const TableComponent = ({ table, filters, toggleFilter, addNewRow }) => {
    return (
        <Table variant="simple" size="sm" layout="fixed" w="auto" minW="100%">
            <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            // 분류, 준비시기, 준비완료 컬럼에 대해서만 필터 기능 추가
                            if (['category', 'timing', 'readyStatus'].includes(header.column.columnDef.accessorKey)) {
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
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {filters[header.column.columnDef.accessorKey].length ? ` (${filters[header.column.columnDef.accessorKey].length})` : ''}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent w="auto">
                                                <PopoverBody p={2}>
                                                    <VStack align="stretch" spacing={1}>
                                                        {header.column.columnDef.accessorKey === 'category' &&
                                                            CATEGORIES.map(category => (
                                                                <Button
                                                                    key={category}
                                                                    size="sm"
                                                                    variant={filters.category.includes(category) ? "solid" : "ghost"}
                                                                    colorScheme={CATEGORY_COLORS[category]}
                                                                    onClick={() => toggleFilter('category', category)}
                                                                    justifyContent="flex-start"
                                                                >
                                                                    {category}
                                                                </Button>
                                                            ))
                                                        }
                                                        {header.column.columnDef.accessorKey === 'timing' &&
                                                            Object.values(READY_TIMING).map(timing => (
                                                                <Button
                                                                    key={timing}
                                                                    size="sm"
                                                                    variant={filters.timing.includes(timing) ? "solid" : "ghost"}
                                                                    colorScheme={getChakraColorScheme(READY_TIMING_COLORS[timing])}
                                                                    onClick={() => toggleFilter('timing', timing)}
                                                                    justifyContent="flex-start"
                                                                >
                                                                    {timing}
                                                                </Button>
                                                            ))
                                                        }
                                                        {header.column.columnDef.accessorKey === 'readyStatus' &&
                                                            Object.values(READY_STATUS).map(status => (
                                                                <Button
                                                                    key={status}
                                                                    size="sm"
                                                                    variant={filters.readyStatus.includes(status) ? "solid" : "ghost"}
                                                                    colorScheme={READY_STATUS_COLORS[status]}
                                                                    style={{
                                                                        backgroundColor: filters.readyStatus.includes(status)
                                                                            ? READY_STATUS_COLORS[status]
                                                                            : 'transparent'
                                                                    }}
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
                {/* 행 추가 버튼을 포함한 행 */}
                <Tr>
                    <Td colSpan={table.getAllColumns().length}>
                        <Button
                            leftIcon={<LucideIcon icon={PlusSquare} />}
                            onClick={addNewRow}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            mx="auto"
                            display="block"
                            w="100%"
                        >
                            새로운 항목 추가
                        </Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    );
};

export default TableComponent;