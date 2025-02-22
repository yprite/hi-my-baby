import React from 'react';
import {
    Box,
    Input,
    Button,
    Image as ChakraImage
} from '@chakra-ui/react';
import { Image as LucideImage } from 'lucide-react';
import { LucideIcon } from './LucideIcon';

export const ImageUploader = ({ rowIndex, value, onImageUpload }) => {
    const handleImageUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(rowIndex, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box position="relative" w="50px" h="50px">
            <Input
                type="file"
                accept="image/*"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                w="100%"
                h="100%"
                cursor="pointer"
                onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            {value ? (
                <ChakraImage
                    src={value}
                    alt="제품 이미지"
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                />
            ) : (
                <Button
                    w="100%"
                    h="100%"
                    variant="outline"
                    colorScheme="gray"
                    fontSize="sm"
                    p={0}
                >
                    <LucideIcon icon={LucideImage} size={16} />
                </Button>
            )}
        </Box>
    );
}; 