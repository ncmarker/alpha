import { ProfileForm } from '../components/ProfileForm';

export default function Profile() {
    return (
        <div className="flex flex-col w-full">
            <h1 className="mx-8 mt-4 text-4xl font-medium text-blue-600">Profile</h1>
            <ProfileForm/>
        </div>
    );
}