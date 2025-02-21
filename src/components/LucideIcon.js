import React from 'react';

// Lucide 아이콘을 Chakra UI와 함께 사용하기 위한 wrapper 컴포넌트
export const LucideIcon = ({ icon: Icon, ...props }) => (
    <Icon
        size={16}
        strokeWidth={2}
        {...props}
    />
);