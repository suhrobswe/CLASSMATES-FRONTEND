import React from "react";

export const useToggle = () => {
    const [isOpen, setOpen] = React.useState(false);

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    return { isOpen, open, close };
};
