import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Upload } from 'lucide-react';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getCandidateProfile(user._id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="btn btn-primary"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-navy-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-navy-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{profile?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{profile?.location || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-royal-100 text-royal-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          {profile?.resume ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{profile.resume.originalName}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="btn btn-secondary">Download</button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No resume uploaded</p>
              <button className="btn btn-primary">Upload Resume</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
