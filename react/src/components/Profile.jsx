import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import defaultProfileImage from '../assets/Travelers-Emblem.jpg';
import './ProfilePicture.css'; // Import the CSS file
import CoinFallBackground from './CoinFallBackground';

export default function Profile() {
  const { user, login } = useAuth();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || defaultProfileImage);
  const fileInputRef = useRef(null);
  
  // Fetch manager details if we only have the ID
  useEffect(() => {
    if (user && user.managerId && typeof user.managerId !== 'object') {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/employees/${user.managerId}`, {
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch manager details');
          }
          return response.json();
        })
        .then((managerData) => {
          if (managerData) {
            setManager(managerData);
          }
        })
        .catch((err) => {
          console.error("Error fetching manager:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (user && user.managerId && typeof user.managerId === 'object') {
      // If managerId is already an object with the manager details
      setManager(user.managerId);
    }
  }, [user]);

  // Set profile image when user changes
  useEffect(() => {
    if (user) {
      setProfileImage(user.profilePicture || defaultProfileImage);
    }
  }, [user]);

  // Handle profile picture click to trigger file input
  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    // Read the file as a data URL (base64)
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setProfileImage(imageDataUrl);
      
      // Store in localStorage (temporary solution)
      localStorage.setItem('userProfilePicture', imageDataUrl);
      
      // Update user object in memory
      if (login) {
        login({
          ...user,
          profilePicture: imageDataUrl
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Check if user data exists before rendering
  if (!user) {
    return (
      <div className="container py-5">
        <CoinFallBackground/>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center">
                <p>Please log in to view your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
        <CoinFallBackground/>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Profile picture positioned above the card */}
          <div className="profile-picture-container">
            <div 
              className="profile-picture"
              onClick={handleProfilePictureClick}
              title="Click to change profile picture"
            >
              <img 
                src={profileImage} 
                alt={`${user.name}'s profile`}
                onError={(e) => {
                  e.target.src = defaultProfileImage;
                }}
              />
              <div className="upload-overlay">
                <span>Click to change profile picture</span>
              </div>
              
              {/* Hidden file input */}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden-input"
                accept="image/jpeg, image/png, image/gif"
              />
            </div>
          </div>
          
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0 text-center">{user.name}</h2>
            </div>
            <div className="card-body">
              <div className="employee-details p-3">
                <div className="mb-2">Phone Number: {user.phone}</div>
                <div className="mb-2">Job Role: {user.role}</div>
                <div className="mb-2">Work Location: {user.location}</div>
                <div className="mb-2">Salary: ${user.salary}</div>
                <div className="mb-2">
                  Manager: {
                    loading ? 'Loading...' : 
                    manager ? manager.name : 
                    user.managerId ? 'Unknown' : 'None'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
