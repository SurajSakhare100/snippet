'use client';

import Image from 'next/image';
import { User } from 'next-auth';

interface UserAvatarProps {
  user: Pick<User, 'name' | 'image'>;
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <div className="relative h-8 w-8">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || 'User avatar'}
          fill
          className="rounded-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium">
            {user.name?.charAt(0) || 'U'}
          </span>
        </div>
      )}
    </div>
  );
} 