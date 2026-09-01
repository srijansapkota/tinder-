import Image from 'next/image';
import PhotoUpload from '@/components/profile/PhotoUpload';

interface AvatarUploadFieldProps {
  avatarUrl: string;
  onPhotoUploaded: (url: string) => void;
}

export default function AvatarUploadField({
  avatarUrl,
  onPhotoUploaded,
}: AvatarUploadFieldProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Profile Picture
      </label>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={avatarUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-full h-full object-cover"
              width={96}
              height={96}
            />
          </div>
          <PhotoUpload onPhotoUploaded={onPhotoUploaded} />
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Upload a new profile picture
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            JPG, PNG or GIF. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}