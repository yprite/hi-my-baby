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
    useToast
} from '@chakra-ui/react';
import { CELL_TYPES, COLUMN_WIDTHS } from '../constants/cellTypes';

export const EditableCell = ({ type, value, options, onSubmit }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(value);
    const toast = useToast();

    React.useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const getColumnWidth = (type) => {
        return COLUMN_WIDTHS[type] || "100%";
    };

    const formatValue = (type, value) => {
        if (isEditing) return value;  // 편집 중에는 포맷팅하지 않음

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

    const showErrorToast = (message = "숫자만 입력 가능합니다.") => {
        toast({
            title: "입력 오류",
            description: message,
            status: "error",
            duration: 2000,
            isClosable: true,
        });
    };

    const handleSubmit = (newValue) => {
        setIsEditing(false);  // 제출 시 편집 모드 종료
        
        switch (type) {
            case CELL_TYPES.UNIT_PRICE:
                const cleanValue = newValue.replace(/[^0-9]/g, '');
                const numericValue = cleanValue ? parseInt(cleanValue) : 0;
                onSubmit(numericValue);
                setCurrentValue(numericValue);
                break;
            case CELL_TYPES.REQUIRED_QTY:
            case CELL_TYPES.PURCHASED_QTY:
                if (/^\d+$/.test(newValue)) {
                    const intValue = parseInt(newValue);
                    onSubmit(intValue);
                    setCurrentValue(intValue);
                } else {
                    showErrorToast();
                    setCurrentValue(value || 0);
                }
                break;
            default:
                onSubmit(newValue);
                setCurrentValue(newValue);
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

    // 일반 입력 필드로 표시
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
};