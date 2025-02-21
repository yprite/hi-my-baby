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

import FilterComponent from './FilterComponent';

export const TableComponent = ({ table, filters, toggleFilter, addNewRow }) => {
    return (
        <Table variant="simple" size="sm" layout="fixed" w="auto" minW="100%">
            <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <FilterComponent
                                key={header.id}
                                header={header}
                                filters={filters}
                                toggleFilter={toggleFilter}
                            />
                        ))}
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