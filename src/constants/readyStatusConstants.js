import React from 'react';

// 준비 상태 정의
export const READY_STATUS = {
    READY: '준비 전',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료'
};

// 준비 상태별 색상 정의
export const READY_STATUS_COLORS = {
    [READY_STATUS.READY]: '#708090',
    [READY_STATUS.IN_PROGRESS]: '#1e90ff',
    [READY_STATUS.COMPLETED]: '#32cd32'
};