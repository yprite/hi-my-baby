import React from 'react';
import { READY_STATUS, READY_STATUS_COLORS } from '../constants/readyStatusConstants';

// 다음 상태로 변경하는 함수
export const getNextReadyStatus = (currentStatus) => {
    switch (currentStatus) {
        case READY_STATUS.READY:
            return READY_STATUS.IN_PROGRESS;
        case READY_STATUS.IN_PROGRESS:
            return READY_STATUS.COMPLETED;
        case READY_STATUS.COMPLETED:
            return READY_STATUS.READY;
        default:
            return READY_STATUS.READY;
    }
};