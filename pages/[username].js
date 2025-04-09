import { useRouter } from 'next/router';

export default function UserProfile() {
    const router = useRouter();
    const { username } = router.query; // Get username from URL

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>This is {username}'s personalized portfolio page.</p>
        </div>
    );
}

