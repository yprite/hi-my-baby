export const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(value);
};

export const validateNumericInput = (value) => {
    return /^\d+$/.test(value);
}; 