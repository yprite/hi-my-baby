import { createStandaloneToast } from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export const ERROR_TYPES = {
    NUMERIC: 'NUMERIC',
    REQUIRED: 'REQUIRED',
    INVALID: 'INVALID'
};

export const ERROR_MESSAGES = {
    [ERROR_TYPES.NUMERIC]: "숫자만 입력 가능합니다.",
    [ERROR_TYPES.REQUIRED]: "필수 입력 항목입니다.",
    [ERROR_TYPES.INVALID]: "잘못된 입력입니다."
};

export const showToastError = (errorType = ERROR_TYPES.INVALID, customMessage) => {
    toast({
        title: "입력 오류",
        description: customMessage || ERROR_MESSAGES[errorType],
        status: "error",
        duration: 2000,
        isClosable: true,
    });
};

export const validateNumericInput = (value) => {
    if (!value) return false;
    return /^\d+$/.test(value.toString());
};

export const validateRequiredInput = (value) => {
    return value !== null && value !== undefined && value !== '';
}; 