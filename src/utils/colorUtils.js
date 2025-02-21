import Color from 'color';

// Chakra UI의 기본 컬러 스킴 정의
const CHAKRA_COLOR_SCHEMES = {
    red: '#E53E3E',
    orange: '#DD6B20',
    yellow: '#D69E2E',
    green: '#38A169',
    teal: '#319795',
    blue: '#3182CE',
    cyan: '#00B5D8',
    purple: '#805AD5',
    pink: '#D53F8C',
    gray: '#718096'
};

// HEX 컬러 팔레트 값을 받아서 가장 비슷한 Chakra UI 컬러 스킴으로 변환
export const getChakraColorScheme = (hexColor) => {
    const color = Color(hexColor);
    const [h, s, l] = color.hsl().array();

    const closestColor = Object.entries(CHAKRA_COLOR_SCHEMES).reduce((prev, [scheme, hex]) => {
        const compareColor = Color(hex);
        const [ch, cs, cl] = compareColor.hsl().array();
        
        // HSL 색상 공간에서의 거리 계산
        const distance = Math.sqrt(
            Math.pow(h - ch, 2) + 
            Math.pow(s - cs, 2) + 
            Math.pow(l - cl, 2)
        );
        return distance < prev.distance ? { scheme, distance } : prev;
    }, { scheme: 'gray', distance: Infinity }).scheme;
    return closestColor;
};
