import React, { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import CoinFallBackground from './CoinFallBackground';

export default function Profile() {
  const { user } = useAuth();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(false);
  
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

  // Check if user data exists before rendering
  if (!user) {
    return (
      <div className="container py-5">
        <CoinFallBackground />
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
        <CoinFallBackground />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">{user.name}</h2>
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
                    <div className="mb-2">Not: </div>
                    <div className="mb-2">Connected: </div>
                    <div className="mb-2">To: </div>
                    <div className="mb-2">Anything: just adding just in case we want to add more</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
