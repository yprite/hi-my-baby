import React from 'react';
import { Editable, EditablePreview, EditableInput } from '@chakra-ui/react';


// EditableCell 컴포넌트를 수정하여 Select 컴포넌트로 변경
export const EditableCell = ({ value, type, onSubmit, options }) => {
    const [isEditing, setIsEditing] = React.useState(false);

    // 향후 사용할 수 있어서 남겨놓음
    // 예를 들면, 쿠팡, 마켓컬리, 온라인 쇼핑몰 등등 리스트화해놓고,사용자가 선택하면 그중에 선택하도록 제한하거나 추천
    // if (options) {
    //     return (
    //         <Popover
    //             isOpen={isEditing}
    //             onClose={() => setIsEditing(false)}
    //             placement="bottom-start"
    //         >
    //             <PopoverTrigger>
    //                 <Button
    //                     size="sm"
    //                     variant="ghost"
    //                     onClick={() => setIsEditing(true)}
    //                     w="100%"
    //                     justifyContent="flex-start"
    //                     _hover={{
    //                         bg: "gray.100"
    //                     }}
    //                 >
    //                     {value || '선택하세요'}
    //                 </Button>
    //             </PopoverTrigger>
    //             <PopoverContent w="auto">
    //                 <PopoverBody p={2}>
    //                     <VStack align="stretch" spacing={1}>
    //                         {options.map(option => (
    //                             <Button
    //                                 key={option}
    //                                 size="sm"
    //                                 variant="ghost"
    //                                 onClick={() => {
    //                                     onSubmit(option);
    //                                     setIsEditing(false);
    //                                 }}
    //                                 justifyContent="flex-start"
    //                                 w="100%"
    //                             >
    //                                 {option}
    //                             </Button>
    //                         ))}
    //                     </VStack>
    //                 </PopoverBody>
    //             </PopoverContent>
    //         </Popover>
    //     );
    // }

    const getColumnWidth = (type) => {
        switch (type) {
            case "category": return "100px";
            case "timing": return "100px";
            case "requiredQty": return "80px";
            case "purchasedQty": return "80px";
            case "unitPrice": return "100px";
            case "totalCost": return "100px";
            case "readyStatus": return "80px";
            case "content": return "200px";
            case "source": return "120px";
            case "photo": return "80px";
            default: return "100%";
        }
    };

    if (type == "requiredQty" || type == "purchasedQty" || type == "unitPrice" || type == "totalCost") {
        return (
            <Editable
                defaultValue={value}
                isPreviewFocusable={true}
                submitOnBlur={true}
                onSubmit={onSubmit}
            >
                <EditablePreview
                    w={getColumnWidth(type)}
                    px={2}
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer"
                    }}
                />
                <EditableInput px={2} w={getColumnWidth(type)} />
            </Editable>
        );
    }

    return (
        <Editable
            defaultValue={value}
            isPreviewFocusable={true}
            submitOnBlur={true}
            onSubmit={onSubmit}
        >
            <EditablePreview
                w={getColumnWidth(type)}
                px={2}
                _hover={{
                    background: "gray.100",
                    cursor: "pointer"
                }}
            />
            <EditableInput px={2} w={getColumnWidth(type)} />
        </Editable>
    );
};