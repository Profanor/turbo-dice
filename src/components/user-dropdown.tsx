'use client';

import { useState } from 'react';
import { ChevronRight, User, ArrowDownCircle, ArrowUpCircle, Clock, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserDropdownProps {
  userImage?: string;
}

export default function UserDropdown({ userImage }: UserDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <div className="flex flex-col items-center py-4 px-2 border-b">
            <Avatar className="h-10 w-10 mb-2">
              <AvatarImage src={userImage} />
            </Avatar>
          </div>

          {[
            { icon: User, label: 'My account info' },
            { icon: ArrowDownCircle, label: 'Deposit' },
            { icon: ArrowUpCircle, label: 'Withdraw' },
            { icon: Clock, label: 'Transaction history' },
            { icon: LogOut, label: 'Logout' },
          ].map(({ icon: Icon, label }, index) => (
            <DropdownMenuItem key={index} className="py-3 cursor-pointer hover:bg-transparent hover:text-inherit">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-sky-400" />
                  <span className="text-white">{label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
