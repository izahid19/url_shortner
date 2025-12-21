import { useState, useEffect } from "react";
import { UrlState } from "@/context";
import { User, Mail, Calendar, Camera, Loader2, Save, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";



const Profile = () => {
  const { user, fetchUser, setUser } = UrlState();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    profilePic: null,
    preview: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        profilePic: null,
        preview: user.profilePic || null,
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const { user: updatedUser, error: apiError } = await updateProfile({
        name: formData.name,
        profilepic: formData.profilePic,
      });

      if (apiError) throw new Error(apiError.message);

      await fetchUser(); // Refresh user data in context
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-start px-4 relative overflow-hidden">

       
       {/* Ambient Background Glow */}
       <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#f97316]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Profile Header Section */}
      <div className="flex flex-col items-center gap-6 mb-12 w-full max-w-lg relative z-10">
        <div className="relative group">
          {/* Glowing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#f97316] to-yellow-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-black/50 relative bg-zinc-900 z-10 shadow-2xl">
            {formData.preview ? (
              <img
                src={formData.preview}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f97316] to-red-600 flex items-center justify-center text-white text-4xl font-bold">
                {formData.name?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
            )}
            
            {isEditing && (
              <label 
                htmlFor="profile-upload" 
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
              >
                <Camera className="text-white w-8 h-8 mb-1 drop-shadow-md" />
                <span className="text-xs text-white font-medium drop-shadow-md">Change</span>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          </div>



        
        <div className="text-center space-y-2">
          {isEditing ? (
             <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-center text-3xl font-bold bg-transparent border-0 border-b-2 border-white/20 rounded-none focus-visible:ring-0 focus-visible:border-[#f97316] text-white placeholder:text-gray-600 px-0 py-2 h-auto w-full transition-colors"
                placeholder="Enter your Name"
                autoFocus
              />
          ) : (
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              {user?.name || "User"}
            </h1>
          )}
          <p className="text-gray-400 font-medium">{user?.email}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
             <div className="p-2 bg-[#f97316]/10 rounded-lg text-[#f97316]">
                <User size={20} />
             </div>
             {isEditing && <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Editable</span>}
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Full Name</p>
          <p className="text-lg text-white font-semibold truncate">
            {isEditing ? formData.name || "Enter name..." : user?.name || "Not set"}
          </p>
        </div>

        <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm">
           <div className="flex items-start justify-between mb-4">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Mail size={20} />
             </div>
             <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Read Only</span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
          <p className="text-lg text-white font-semibold truncate">{user?.email}</p>
        </div>

        <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm md:col-span-2">
           <div className="flex items-start justify-between mb-4">
             <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                <Calendar size={20} />
             </div>
          </div>
          <div className="flex items-center gap-2">
             <p className="text-sm text-gray-500 font-medium">Joined Platform:</p>
             <p className="text-white font-medium">{formatDate(user?.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex gap-4 w-full max-w-md">
        {isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-white/10 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all text-base"
              disabled={loading}
            >
              <X className="w-5 h-5 mr-2" /> Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white transition-all text-base font-medium shadow-lg shadow-orange-500/20"
              disabled={loading}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <>
              <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-white/10 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 transition-all text-base"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-gray-100 transition-all text-base font-bold shadow-lg shadow-white/5"
            >
              Edit Profile
            </Button>
          </>
        )}
      </div>

    </div>
  );
};

export default Profile;
