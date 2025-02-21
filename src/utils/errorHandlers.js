export const showToastError = (toast, message) => {
    toast({
        title: "입력 오류",
        description: message,
        status: "error",
        duration: 2000,
        isClosable: true,
    });
}; 