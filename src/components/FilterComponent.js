import React from 'react';
import {
    Th,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    VStack,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { flexRender } from '@tanstack/react-table';

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


const FilterComponent = ({ header, filters, toggleFilter }) => {
    const accessorKey = header.column.columnDef.accessorKey;

    if (['category', 'timing', 'readyStatus'].includes(accessorKey)) {
        const { isOpen, onOpen, onClose } = useDisclosure();

        return (
            <Th key={header.id} p={2}>
                <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
                    <PopoverTrigger>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onOpen}
                            rightIcon={filters[accessorKey]?.length ? <CheckIcon /> : undefined}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {filters[accessorKey]?.length ? ` (${filters[accessorKey].length})` : ''}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent w="auto">
                        <PopoverBody p={2}>
                            <VStack align="stretch" spacing={1}>
                                {accessorKey === 'category' &&
                                    CATEGORIES.map(category => (
                                        <Button
                                            key={category}
                                            size="sm"
                                            variant={filters.category?.includes(category) ? "solid" : "ghost"}
                                            colorScheme={CATEGORY_COLORS[category]}
                                            onClick={() => toggleFilter('category', category)}
                                            justifyContent="flex-start"
                                        >
                                            {category}
                                        </Button>
                                    ))
                                }
                                {accessorKey === 'timing' &&
                                    Object.values(READY_TIMING).map(timing => (
                                        <Button
                                            key={timing}
                                            size="sm"
                                            variant={filters.timing?.includes(timing) ? "solid" : "ghost"}
                                            colorScheme={getChakraColorScheme(READY_TIMING_COLORS[timing])}
                                            style={{
                                                backgroundColor: filters.timing?.includes(timing)
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
                                {accessorKey === 'readyStatus' &&
                                    Object.values(READY_STATUS).map(status => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={filters.readyStatus?.includes(status) ? "solid" : "ghost"}
                                            colorScheme={getChakraColorScheme(READY_STATUS_COLORS[status])}
                                            style={{
                                                backgroundColor: filters.readyStatus?.includes(status)
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

    // 필터가 없는 컬럼의 경우 기본 헤더 반환
    return (
        <Th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            cursor="pointer"
            p={2}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
                asc: ' 🔼',
                desc: ' 🔽',
            }[header.column.getIsSorted()] ?? null}
        </Th>
    );
};

export default FilterComponent;