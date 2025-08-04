import 'next-auth'

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        username?: string
    }
    interface Session {
        user: {
            id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}