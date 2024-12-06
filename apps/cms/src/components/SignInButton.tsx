import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserCircle } from 'lucide-react';
import type { Account } from '@w3ui/react';

export interface UserInfo {
    email: string;
    did: string;
}

export const SignInButton = ({
    account,
    handleSignIn,
    handleSignOut
}: {
    account: Account | null;
    handleSignIn: () => void;
    handleSignOut: () => void;
}) => {
    const email = account?.toEmail();
    // const handleSignIn = () => {
    //     setIsLoggedIn(true);
    // };

    // const handleSignOut = () => {
    //     setIsLoggedIn(false);
    // };

    if (!account?.did()) {
        return (
            <Button onClick={handleSignIn} className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Sign In
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {account?.toEmail().charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{email}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Account Info</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium">Email</span>
                    <span className="text-sm text-muted-foreground break-all">{email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium">DID</span>
                    <span className="text-sm text-muted-foreground break-all">{account.did()}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};