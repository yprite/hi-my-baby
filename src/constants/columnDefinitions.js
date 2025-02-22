import { Box, Button, HStack, Text, useDisclosure, VStack, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';
import { LucideIcon } from '../components/LucideIcon';
import {
    ShoppingBasket,
    Star,
    Settings,
    Calendar,
    PlusSquare,
    Repeat,
    Calculator,
    DollarSign,
    CheckCircle,
    HelpCircle,
    Store,
    Image as LucideImage,
} from 'lucide-react';

import { EditableCell } from '../components/EditableCell';
import { ImageUploader } from '../components/ImageUploader';
import {
    CELL_TYPES,
    CELL_TYPES_KOREAN,
    CATEGORIES,
    CATEGORY_COLORS,
    READY_TIMING_COLORS,
    READY_STATUS_COLORS
} from '../constants';

const renderHeader = (text, icon) => (
    <HStack spacing={2}>
        {icon}
        <Text>{text}</Text>
    </HStack>
);

export const getColumnDefinitions = ({
    handleCategoryChange,
    handleReadyTimingChange,
    handleReadyStatusChange,
    setTableData
}) => [
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
                                            onClose();
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
        cell: info => (
            <Button
                size="sm"
                variant="solid"
                style={{ backgroundColor: READY_TIMING_COLORS[info.getValue()] }}
                onClick={() => handleReadyTimingChange(info.row.index, info.getValue())}
                w="100px"
                h="30px"
                fontSize="sm"
            >
                {info.getValue() || '선택하세요'}
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
                {info.getValue() || '선택하세요'}
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
    }
];