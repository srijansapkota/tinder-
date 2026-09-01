import { EditProfileFormData } from "@/lib/hooks/useProfileEditForm";


interface ProfileNameFieldsProps {
  formData: EditProfileFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function ProfileNameFields({
  formData,
  onChange,
}: ProfileNameFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-ink mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-ink mb-2"
          >
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
            placeholder="Choose a username"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-ink mb-2"
          >
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-ink mb-2"
          >
            Birthday *
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink"
          />
        </div>
      </div>

      <div className="mb-8">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-ink mb-2"
        >
          About Me *
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onChange}
          required
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-lime bg-bone-soft text-ink resize-none"
          placeholder="Tell others about yourself..."
        />
        <p className="text-xs text-ink-soft mt-1">
          {formData.bio.length}/500 characters
        </p>
      </div>
    </>
  );
}