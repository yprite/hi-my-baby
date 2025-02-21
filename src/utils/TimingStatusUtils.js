import React from 'react';
import { READY_TIMING, READY_TIMING_COLORS } from '../context/ReadyTimingConstants';


// 다음 시기로 변경하는 함수
export const getNextTimingStatus = (currentTiming) => {
    switch (currentTiming) {
        case READY_TIMING.EARLY:
            return READY_TIMING.LATE;
        case READY_TIMING.LATE:
            return READY_TIMING.EARLY;
        default:
            return READY_TIMING.EARLY;
    }
};

