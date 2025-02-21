import React from 'react';


// 분류별 색상 매핑
export const CATEGORY_COLORS = {
    '침구류': 'blue',
    '아기 의류': 'green',
    '수유용품': 'purple',
    '아기 피부용품': 'pink',
    '아기 위생용품': 'teal',
    '아기 세제': 'cyan',
    '기저귀': 'orange',
    '외출용품': 'yellow',
    '놀이용품': 'red',
    '가전/가구': 'gray',
    '산모용품': 'purple',
    '상비약': 'red',
    '기타': 'gray'
};

// 분류 옵션
export const CATEGORIES = [
    '침구류', '아기 의류', '수유용품', '기타', '아기 피부용품',
    '아기 위생용품', '아기 세제', '기저귀', '외출용품', '놀이용품',
    '가전/가구', '산모용품', '상비약'
];

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

// 준비 시기 정의
export const READY_TIMING = {
    EARLY: '산전',
    LATE: '산후'
};

// 준비 시기별 색상 정의
export const READY_TIMING_COLORS = {
    [READY_TIMING.EARLY]: '#ce694c',
    [READY_TIMING.LATE]: '#4cb1ce'
};