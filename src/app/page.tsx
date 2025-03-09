'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import { Dimension, Matrix, Sets } from '@/components';

export default function Home() {
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    return (
        <Box className="grow bg-background p-4">
            <Dimension setIsCalculated={setIsCalculated} />
            <Matrix setIsCalculated={setIsCalculated} />
            {isCalculated && <Sets />}
        </Box>
    );
}
