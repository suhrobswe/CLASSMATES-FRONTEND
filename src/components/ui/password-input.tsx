"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "./input-group";

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <InputGroup>
                <InputGroupInput
                    className="rounded-md text-white"
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    {...props}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        size="icon-xs"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                        className="bg-transparent border-none p-0 hover:bg-transparent focus-visible:ring-0"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
