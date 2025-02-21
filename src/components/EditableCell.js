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

export const EditableCell = ({ type, value, options, onSubmit }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentValue, setCurrentValue] = React.useState(value);
    const toast = useToast();

    React.useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const getColumnWidth = (type) => {
        switch (type) {
            case "category": return "100px";
            case "timing": return "100px";
            case "requiredQty": return "80px";
            case "purchasedQty": return "80px";
            case "unitPrice": return "100px";
            case "totalCost": return "100px";
            case "readyStatus": return "80px";
            case "notes": return "200px";
            case "source": return "120px";
            default: return "100%";
        }
    };

    const formatValue = (type, value) => {
        switch (type) {
            case "unitPrice":
                return new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW'
                }).format(value);
            case "requiredQty":
            case "purchasedQty":
                return value.toString();
            default:
                return value;
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
        switch (type) {
            case "unitPrice":
                const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''));
                if (!isNaN(numericValue)) {
                    onSubmit(numericValue);
                    setCurrentValue(numericValue);
                } else {
                    showErrorToast();
                    setCurrentValue(value);
                }
                break;
            case "requiredQty":
            case "purchasedQty":
                if (/^\d+$/.test(newValue)) {
                    onSubmit(parseInt(newValue));
                    setCurrentValue(parseInt(newValue));
                } else {
                    showErrorToast();
                    setCurrentValue(value);
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