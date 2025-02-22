import React from 'react';
import {
    Editable,
    EditableInput,
    EditablePreview,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { CELL_TYPES, COLUMN_WIDTHS } from '../constants/cellTypes';
import {
    showToastError,
    ERROR_TYPES,
    validateNumericInput
} from '../utils/errorHandlers';

export const EditableCell = ({ type, value, options, onSubmit }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(value);

    React.useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const getColumnWidth = (type) => {
        return COLUMN_WIDTHS[type] || "100%";
    };

    const formatValue = (type, value) => {
        if (isEditing) return value;

        switch (type) {
            case CELL_TYPES.UNIT_PRICE:
                return value ? new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW'
                }).format(value) : '₩0';
            case CELL_TYPES.REQUIRED_QTY:
            case CELL_TYPES.PURCHASED_QTY:
                return value?.toString() || '0';
            default:
                return value || '';
        }
    };

    const handleSubmit = (newValue) => {
        setIsEditing(false);

        switch (type) {
            case CELL_TYPES.UNIT_PRICE:
                const cleanValue = newValue.replace(/[^0-9]/g, '');
                const numericValue = cleanValue ? parseInt(cleanValue) : 0;
                if (validateNumericInput(cleanValue)) {
                    onSubmit(numericValue);
                    setCurrentValue(numericValue);
                } else {
                    showToastError(ERROR_TYPES.NUMERIC);
                    setCurrentValue(value || 0);
                }
                break;
            case CELL_TYPES.REQUIRED_QTY:
            case CELL_TYPES.PURCHASED_QTY:
                if (validateNumericInput(newValue)) {
                    const intValue = parseInt(newValue);
                    onSubmit(intValue);
                    setCurrentValue(intValue);
                } else {
                    showToastError(ERROR_TYPES.NUMERIC);
                    setCurrentValue(value || 0);
                }
                break;
            default:
                if (newValue.trim() === '' && type === 'item') {
                    showToastError(ERROR_TYPES.REQUIRED);
                    setCurrentValue(value);
                } else {
                    onSubmit(newValue);
                    setCurrentValue(newValue);
                }
        }
    };

    // 옵션이 있는 경우 드롭다운 스타일로 표시
    if (options) {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
            <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
                <PopoverTrigger>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onOpen}
                        w="100%"
                        justifyContent="flex-start"
                        _hover={{ bg: "gray.100" }}
                    >
                        {value || '선택하세요'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent w="auto">
                    <PopoverBody p={2}>
                        <VStack align="stretch" spacing={1}>
                            {options.map(option => (
                                <Button
                                    key={option}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        onSubmit(option);
                                        onClose();
                                    }}
                                    justifyContent="flex-start"
                                >
                                    {option}
                                </Button>
                            ))}
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Editable
            value={formatValue(type, currentValue)}
            onEdit={() => setIsEditing(true)}
            isPreviewFocusable={true}
            submitOnBlur={true}
            onSubmit={handleSubmit}
            onChange={(newValue) => setCurrentValue(newValue)}
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
};1