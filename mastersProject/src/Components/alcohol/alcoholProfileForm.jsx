import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts";
import DayTracker from "./DayTracker";


import { get } from "../../lib/api";

const AlcoholLanding = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser?.uid) return;

      try {
        const data = await get(`/alcohol/profile/${currentUser.uid}`);
        setProfile(data);
        setHasProfile(!!data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setHasProfile(false);
        setProfile(null);
      }
    };

    checkProfile();
  }, [currentUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Alcohol Recovery Journey</CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            {hasProfile
              ? "Welcome back! Here's a snapshot of your progress:"
              : "This space is dedicated to helping you reduce or quit drinking at your own pace."}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4 mt-2">
          {hasProfile && profile ? (
            <div className="w-full flex flex-col items-center space-y-4">
              <p className="text-lg font-semibold">🎯 Target Days: {profile.targetDays ?? 0}</p>
              <DayTracker startDate={profile.startDate} targetDays={profile.targetDays} />
              <Button variant="outline" onClick={() => navigate("/alcohol/review")}>
                View or Edit My Motivation
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-lg">Ready to take your first step? Let’s set your personal goals.</p>
              <Button onClick={() => navigate("/alcoholForm")}>Get Started</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlcoholLanding;
